const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();
const userAuth = require("../middleware/auth");
const Content = require("../models/content");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/ask-brain", userAuth, async (req, res) => {
    try {
        const { question } = req.body;
        const userId = req.user._id;

        // Fetch user's content to use as context
        const userContent = await Content.find({ userId: userId });
        
        // Prepare context from user's content
        const context = userContent.map(c => `Title: ${c.title}\nType: ${c.type}\nTags: ${c.tags.join(", ")}\nLink: ${c.link}\nDescription: ${c.description || ""}`).join("\n\n");

        const prompt = `You are a "Second Brain" assistant. Answer the user's question based ONLY on the following content from their knowledge base. If the answer is not in the context, say so.
        
        User's Content:
        ${context}

        Question: ${question}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Simple source matching (basic heuristic)
        const sources = userContent.filter(c => 
            text.toLowerCase().includes(c.title.toLowerCase()) || 
            question.toLowerCase().includes(c.title.toLowerCase())
        ).slice(0, 3).map(c => ({
            title: c.title,
            link: c.link,
            type: c.type
        }));

        res.json({
            answer: text,
            suggestedContent: sources
        });

    } catch (e) {
        console.error("AI Error:", e);
        res.status(500).json({ 
            message: "Error processing request",
            error: e.message,
            details: e.toString()
        });
    }
});

module.exports = router;
