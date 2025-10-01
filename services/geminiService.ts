import { GoogleGenAI, Type } from "@google/genai";
import { Explanation } from '../types';

const getAiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Gemini API key is not configured. Please set the API_KEY environment variable.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const missingKeyExplanation: Explanation = {
    functionName: "API Key Not Configured",
    formula: "N/A",
    description: "The Gemini API key has not been configured for this application. Please contact the administrator to enable AI-powered features.",
    example: "An administrator needs to set the API_KEY environment variable."
};

const invalidKeyExplanation: Explanation = {
    functionName: "Invalid API Key",
    formula: "N/A",
    description: "The provided Gemini API key is invalid or has expired. The application administrator needs to verify the key.",
    example: "The configured API key may be incorrect or lack necessary permissions."
};

const missingKeyForecast: string = "The Gemini API key has not been configured. Please contact the administrator.";
const invalidKeyForecast: string = "The provided Gemini API key is invalid. Please contact the administrator.";


export const getFormulaExplanation = async (expression: string): Promise<Explanation | null> => {
  const ai = getAiClient();
  if (!ai) {
    return missingKeyExplanation;
  }

  try {
    const prompt = `
      Analyze the primary mathematical, statistical, or financial function in this expression: "${expression}".
      Ignore basic arithmetic. Focus on the most significant function (e.g., sqrt, sin, log, nCr, mean, pmt).

      Return a JSON object with this exact structure:
      {
        "functionName": "Name (e.g., 'Square Root')",
        "formula": "User-friendly text formula (e.g., 'sqrt(x)')",
        "latexFormula": "Simplified LaTeX version (e.g., '\\sqrt{x}')",
        "description": "A clear, one-paragraph explanation.",
        "parameters": [
          { "param": "x", "description": "The number to find the square root of (radicand)." }
        ],
        "example": "A simple usage example (e.g., 'sqrt(16) = 4')."
      }

      GUIDELINES:
      - For statistical functions that take a list of numbers like mean or std, use 'x₁, x₂, ..., xₙ' for parameters and describe it as 'A set of numbers'. Example: 'mean(2, 4, 9)'.
      - For the financial function 'pmt', assume the signature is 'pmt(annualRate, termYears, principal)'. Clearly define each parameter.
      - For trigonometric functions like sin, use 'θ' as the parameter. For logarithms, use 'log_b(x)'. For combinations, use 'nCr(n, k)'.
      - The 'parameters' array should describe each variable in the formula. If there are no parameters (like for Pi), return an empty array.
      - If no specific function is found, return null.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              functionName: { type: Type.STRING },
              formula: { type: Type.STRING },
              latexFormula: { type: Type.STRING },
              description: { type: Type.STRING },
              parameters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    param: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["param", "description"]
                }
              },
              example: { type: Type.STRING }
            },
            required: ["functionName", "formula", "description", "example"]
          },
        }
    });

    const jsonText = response.text.trim();
    if (!jsonText) return null;
    
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error fetching formula explanation from Gemini:", error);
     if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
       return invalidKeyExplanation;
    }
    return {
      functionName: "Error",
      formula: "N/A",
      description: "Could not fetch an explanation at this time. The Gemini API might be unavailable or the request could not be processed.",
      example: "Please try another calculation."
    };
  }
};

export const getCurrencyForecast = async (from: string, to: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return missingKeyForecast;
  }

  try {
    const prompt = `
      Provide a brief, general, and educational analysis of the typical factors influencing the exchange rate between ${from} and ${to}.
      Do NOT give financial advice, predict future prices, or use speculative language like "will rise" or "will fall".
      Focus on general economic principles.
      For example: "The ${from}/${to} rate is often influenced by factors such as the interest rate decisions of their respective central banks, inflation data, and trade balances."
      Keep the response under 60 words.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    
    return response.text.trim();

  } catch (error) {
    console.error("Error fetching currency forecast from Gemini:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
        return invalidKeyForecast;
    }
    return "Could not retrieve analysis at this time. Please try again later.";
  }
};
