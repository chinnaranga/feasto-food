import { GoogleGenerativeAI } from "@google/genai";
import { db } from "../config/firebase.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // 1. Fetch Menu Context
        const foodSnapshot = await db.collection("food").limit(20).get();
        const menuItems = foodSnapshot.docs.map(doc => {
            const data = doc.data();
            return `${data.name} (₹${data.price}) - ${data.description} [${data.category}]`;
        }).join("\n");

        const systemPrompt = `
      You are 'Feasto Bot', the helpful AI assistant for the Feasto food delivery platform.
      
      Your Traits:
      - Friendly, concise, and food-loving.
      - You ONLY discuss food, orders, and the Feasto menu.
      - If asked about non-food topics, politely steer back to food.
      
      Menu Context:
      ${menuItems}
      
      User's Request: ${message}
      
      Answer as Feasto Bot. If suggesting food, mention the price.
    `;

        // 2. ONLY VALID MODEL (per User Instruction)
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
        });

        const result = await model.generateContent(systemPrompt);

        const text =
            result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            result?.response?.text() ||
            "Sorry, I couldn't think of a reply 😅";

        return res.json({
            success: true,
            reply: text,
        });

    } catch (error) {
        console.error("AI Chat Error:", error);
        return res.status(500).json({
            success: false,
            reply: "Oops! My brain froze 🥶. Try again?",
        });
    }
};
