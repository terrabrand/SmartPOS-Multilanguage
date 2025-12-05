import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getUpsellRecommendation = async (currentItems: string[]): Promise<string> => {
  if (!apiKey) {
    return "API Key missing. Cannot generate recommendation.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      I have a customer at a restaurant POS who has ordered the following items: ${currentItems.join(', ')}.
      Suggest ONE single complementary item to upsell (e.g., a specific drink, side, or dessert) that goes well with this order.
      Keep the suggestion short, catchy, and under 10 words. Do not include quotes.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        maxOutputTokens: 50,
        temperature: 0.7,
      }
    });

    return response.text || "Try our special fries!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Would you like to add a drink?";
  }
};