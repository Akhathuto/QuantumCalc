import { GoogleGenAI, Type } from "@google/genai";
import { Explanation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getFormulaExplanation = async (expression: string): Promise<Explanation | null> => {
  try {
    const prompt = `
      Analyze the primary mathematical function in this expression: "${expression}".
      Ignore basic arithmetic. Focus on the most significant function (e.g., sqrt, sin, log, nCr).

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

      For trigonometric functions like sin, use 'θ' as the parameter. For logarithms, use 'log_b(x)'. For combinations, use 'nCr(n, k)'.
      The 'parameters' array should describe each variable in the formula. If there are no parameters (like for Pi), return an empty array.
      If no specific function is found, return null.
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
    return {
      functionName: "Error",
      formula: "N/A",
      description: "Could not fetch an explanation at this time. The Gemini API might be unavailable or the request could not be processed.",
      example: "Please try another calculation."
    };
  }
};