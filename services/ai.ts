import { GoogleGenAI, Type } from "@google/genai";

export interface ProductDiagnostic {
  specs: {
    label: string;
    value: string;
    unit: string;
  }[];
  integrityScore: number;
  statusMessage: string;
}

export const generateProductDiagnostic = async (productName: string, tagline: string): Promise<ProductDiagnostic> => {
  // Always create a new instance right before the call to ensure fresh API key usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a futuristic technical diagnostic on a product called "${productName}" (${tagline}). 
      Provide 3 highly technical and unique futuristic specifications. 
      Also provide a general structural integrity score (0-100) and a short 1-sentence status message.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            specs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "Technical name of the metric" },
                  value: { type: Type.STRING, description: "Numeric or alphanumeric value" },
                  unit: { type: Type.STRING, description: "Metric unit" }
                },
                required: ["label", "value", "unit"]
              }
            },
            integrityScore: { type: Type.NUMBER },
            statusMessage: { type: Type.STRING }
          },
          required: ["specs", "integrityScore", "statusMessage"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Diagnostic failed:", error);
    // Fallback data for robust UI
    return {
      specs: [
        { label: "Core Flux", value: "0.82", unit: "THz" },
        { label: "Sync Latency", value: "1.2", unit: "ns" },
        { label: "Energy Efficiency", value: "A++", unit: "NODE" }
      ],
      integrityScore: 99,
      statusMessage: "System operational. All parameters within nominal range."
    };
  }
};