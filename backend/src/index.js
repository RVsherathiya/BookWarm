import express from "express";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import { connnectDB } from "./lib/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());
app.use("/api/auth", authRoutes);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("quizPrompt", async (topic) => {
    console.log("📩 Quiz prompt from client:", topic);

    try {
      const stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          {
            role: "user",
            content: `Generate 5 multiple-choice questions about ${topic}.
            Each question must be a single line of JSON (NDJSON), like:
            {"question":"string","options":["a","b","c","d"],"answer":"correct option"}
            Do NOT wrap in an array, do NOT add extra text.`
          }
        ]
      });

      let buffer = "";

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        if (!token) continue;
      
        buffer += token;
      
        // Look for a newline that ends one JSON object
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const jsonLine = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);
      
          if (jsonLine) {
            try {
              const parsed = JSON.parse(jsonLine);
              socket.emit("quizItem", parsed); // ✅ send one question at a time
            } catch (e) {
              console.error("❌ JSON parse error:", e, "line:", jsonLine);
            }
          }
        }
      }
      
      socket.emit("done");
      
    } catch (err) {
      console.error("❌ Error:", err);
      socket.emit("error", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  connnectDB();
});
