import express from "express";
import OpenAI from "openai";
import "dotenv/config";

const router = express.Router();

// const client = new OpenAI({ apiKey:  process.env.OPENAI_API_KEY });
const client = new OpenAI({
  apiKey: "", // no key needed for local Ollama
  baseURL: "http://localhost:11434/v1",
});

router.post("/register", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("🚀 ~ prompt:", prompt);
    const response = await client.chat.completions.create({
      model: "llama3",
      messages: [{ role: "user", content: prompt ,stream:true}],
    });
    console.log("🚀 ~ response:", response?.choices[0]?.message);
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
