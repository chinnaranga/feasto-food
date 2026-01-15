import express from "express";

const router = express.Router();

import { GoogleGenerativeAI } from "@google/generative-ai";

router.post("/chat-order", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY not configured in backend");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are Feasto AI, a helpful food ordering assistant.
        Context: The user is asking about food.
        User Message: "${message}"
        
        Respond in JSON format with two keys:
        1. "recommendationReason": A friendly, short explanation of what you recommend and why.
        2. "followUp": A follow-up question to narrow down their choice.
        
        Keep it brief and appetizing.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Cleanup JSON markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        res.json(data);

    } catch (error) {
        console.error("AI Error:", error);
        console.error(error.stack);
        res.status(500).json({ error: "AI processing failed" });
    }
});

export default router;
