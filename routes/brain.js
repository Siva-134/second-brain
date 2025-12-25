const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();
const userAuth = require("../middleware/auth");
const Content = require("../models/content");
require("dotenv").config();

// Initialize model dynamically
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getModel() {
    try {
        // Explicitly fetch models using REST because SDK listModels can be tricky in some versions
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        
        let modelName = 'gemini-1.5-flash'; // Default fallback

        if (data.models) {
            // Find first available 'generateContent' model, preferring flash/pro
            const validModels = data.models
                .filter(m => m.supportedGenerationMethods.includes('generateContent'))
                .map(m => m.name.replace('models/', ''));

            console.log("Available Gemini Models:", validModels);

            const preferred = validModels.find(m => m.includes('flash')) || 
                              validModels.find(m => m.includes('pro')) || 
                              validModels[0];
            
            if (preferred) modelName = preferred;
        }
        
        console.log(`Using Gemini Model: ${modelName}`);
        return genAI.getGenerativeModel({ model: modelName });
    } catch (e) {
        console.error("Error selecting model:", e);
        return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
}

router.post("/ask-brain", userAuth, async (req, res) => {
    try {
        const { question } = req.body;
        const userId = req.user._id;

        // Fetch user's content to use as context
        const userContent = await Content.find({ userId: userId });
        
        // Prepare context from user's content
        const context = userContent.map(c => `Title: ${c.title}\nType: ${c.type}\nTags: ${c.tags.join(", ")}\nLink: ${c.link}\nDescription: ${c.description || ""}`).join("\n\n");

        const prompt = `You are a helpful "Second Brain" assistant.
        
        First, check the following "User's Knowledge Base" for any relevant information to answer the question. 
        If you find relevant information in the Knowledge Base, use it to answer and explicitly reference it.
        
        If the answer is NOT found in the Knowledge Base, simply answer the question using your own general knowledge as a helpful AI assistant.
        
        User's Knowledge Base:
        ${context}

        User's Question: ${question}
        `;

        const model = await getModel();
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
