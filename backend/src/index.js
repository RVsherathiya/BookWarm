import express from "express";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import { connnectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connnectDB(); 
}); 



