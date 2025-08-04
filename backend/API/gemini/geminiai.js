import express from 'express'
import { GoogleGenAI } from "@google/genai";
const router = express.Router();
router.use(express.json())

router.post("/geminiapi", async (req, res) => {
    const { contents,formattedHistory} = req.body
    console.log("content:", contents)
    try {
        const ai = new GoogleGenAI({});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            formattedHistory,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0, // Disables thinking
                },
                systemInstruction:'You are a chat bot that helps user, and solve their finance realted question if user asks not related to finance just say not my expertise. Your name is Finance Bro'
            }
        });
        res.status(200).json({
            message: response.text,
        })

    }
    catch (error) {
        res.status(400).json({
            message: "Failed to get message from Gemini Ai",
            error
        })
    }
})
export default router;