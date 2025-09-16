import express from "express";
import OpenAI from "openai";
import "dotenv/config";

const router = express.Router();

const client = new OpenAI({
  apiKey: process?.env?.OPENAI_API_KEY, 
});

router.post("/register", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("🚀 ~ prompt:", prompt);
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // or "llama3" if using Ollama
      messages: [{ role: "user", content: prompt }],
    });

    console.log("🚀 ~ response:", response?.choices[0]?.message);
   
    res?.json(response?.choices[0]?.message?.content)
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
