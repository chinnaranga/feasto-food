import { GoogleGenerativeAI } from "@google/generative-ai";
import Restaurant from "../models/Restaurant.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // 1. Fetch Menu Context from MongoDB
        // We fetch restaurants and flatten their menus to get a list of items
        const restaurants = await Restaurant.find({ isOpen: true, isAvailable: true }).limit(10).select('name menu');

        let menuItemsContext = "";
        restaurants.forEach(restaurant => {
            if (restaurant.menu && restaurant.menu.length > 0) {
                // Take up to 5 items per restaurant to save context window
                restaurant.menu.slice(0, 5).forEach(item => {
                    if (item.isAvailable) {
                        menuItemsContext += `- ${item.name} (${item.category}) at ${restaurant.name}: ₹${item.price}. ${item.description || ''}\n`;
                    }
                });
            }
        });

        if (!menuItemsContext) {
            menuItemsContext = "No items currently available.";
        }

        const systemPrompt = `
      You are 'Flavor Bot', the helpful AI assistant for the Flavor food delivery platform.
      
      Your Traits:
      - Friendly, concise, and food-loving.
      - You ONLY discuss food, orders, and the Flavor menu.
      
      Current Available Menu Context:
      ${menuItemsContext}
      
      User's Request: ${message}
      
      RESPONSE FORMAT:
      You MUST respond with a valid JSON object starting with { and ending with }.
      Include:
      - "reply": A short friendly conversational response (under 30 words).
      - "recommendationReason": Why you suggested specific items based on the context.
      - "suggestedItem": The name of the most relevant item.
      - "followUp": A follow-up question.
    `;

        // 2. Generate Response
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(systemPrompt);
        const aiResponse = JSON.parse(result.response.text());

        return res.json({
            success: true,
            ai: {
                reply: aiResponse.reply,
                recommendationReason: aiResponse.recommendationReason,
                suggestedItem: aiResponse.suggestedItem,
                followUp: aiResponse.followUp
            }
        });

    } catch (error) {
        console.error("AI Chat Error:", error);
        return res.status(500).json({
            success: false,
            reply: "Oops! My brain froze 🥶. Try again?",
        });
    }
};
