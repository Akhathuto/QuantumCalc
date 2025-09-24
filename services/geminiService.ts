
import { GoogleGenAI, Type } from "@google/genai";
import { Explanation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getFormulaExplanation = async (expression: string): Promise<Explanation | null> => {
  try {
    const prompt = `
      Analyze the following mathematical expression and identify the primary mathematical function or concept being used: "${expression}".
      
      Provide a concise explanation for that single, most prominent function/concept.
      Return the explanation in a JSON object with the following structure:
      {
        "functionName": "The common name of the function (e.g., 'Sine', 'Square Root', 'Logarithm')",
        "formula": "The general mathematical formula (e.g., 'sin(θ) = opposite/hypotenuse', '√x', 'log_b(x) = y')",
        "description": "A clear, one-paragraph explanation of what the function does and its purpose.",
        "example": "A simple, practical example of its use (e.g., 'sin(30°) = 0.5')."
      }

      Do not explain basic arithmetic (+, -, *, /). Focus on functions like sqrt, log, sin, cos, tan, pow, etc. If multiple functions are present, explain the outermost or most significant one. If no specific function is found, return null.
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
              description: { type: Type.STRING },
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
    return null;
  }
};
