import { GoogleGenerativeAI } from "@google/generative-ai";
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

        // 2. Generate Response using stable SDK
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
        });

        const result = await model.generateContent(systemPrompt);

        return res.status(200).json({
            success: true,
            reply: result.response.text(),
        });
    } catch (err) {
        console.error("AI Chat Error:", err);
        return res.status(500).json({
            success: false,
            error: "AI service failed",
        });
    }
};
