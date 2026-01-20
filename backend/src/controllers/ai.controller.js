import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../config/firebase.js"; // Assuming db is exported from here or similar config

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;
        const userId = req.user?.uid;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "AI service not configured" });
        }

        // 1. Fetch Menu Context (Cached or Fresh)
        // For simplicity, fetching generic categories or popular items. 
        // In production, you might want to cache this or use a vector store.
        const foodSnapshot = await db.collection("food").limit(20).get(); // Limit context size
        const menuItems = foodSnapshot.docs.map(doc => {
            const data = doc.data();
            return `${data.name} (₹${data.price}) - ${data.description} [${data.category}]`;
        }).join("\n");

        // 2. System Prompt
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

        // 3. Generate Response
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
};
