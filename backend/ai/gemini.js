import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini AI Client (Server-side only)
 * Used for:
 * - Natural language food search
 * - AI chat ordering
 * - Recommendation explanations
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use fast + cheap model for chat/search
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

/**
 * SYSTEM PROMPT
 * Controls AI behavior strictly for Feasto
 */
const SYSTEM_PROMPT = `
You are Feasto AI 🍽️ — a food ordering assistant.

RULES:
- Recommend food ONLY from provided menu items
- Be concise, friendly, and helpful
- Prices are in INR ₹
- Never hallucinate dishes
- Prefer healthy/light options for dinner
- Explain recommendations in simple language
- Ask short follow-up questions if helpful

OUTPUT FORMAT (JSON ONLY):
{
  "intent": "search | recommend | order | followup",
  "filters": {
    "spicy": boolean,
    "maxPrice": number | null,
    "category": string | null
  },
  "recommendationReason": string,
  "followUp": string | null
}
`;

/**
 * Main Gemini Query Function
 */
export async function queryGemini(userMessage, menu = []) {
    try {
        const menuText = menu
            .map(
                (item) =>
                    `- ${item.name} | ₹${item.price} | ${item.cuisine} | rating ${item.rating}`
            )
            .join("\n");

        const prompt = `
${SYSTEM_PROMPT}

MENU:
${menuText}

USER MESSAGE:
"${userMessage}"
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Try to parse JSON safely
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;

        if (jsonStart === -1) {
            throw new Error("Invalid AI response format");
        }

        return JSON.parse(text.slice(jsonStart, jsonEnd));
    } catch (error) {
        console.error("Gemini AI error:", error);

        return {
            intent: "search",
            filters: {},
            recommendationReason: "Couldn't understand clearly, showing best options.",
            followUp: "Want something spicy or light?",
        };
    }
}
