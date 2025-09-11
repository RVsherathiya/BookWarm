import mongoose from "mongoose";
export const connnectDB = async() => {
    try {
        const conn = await mongoose?.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("🚀 ~ connnectDB ~ error:", error)
        process.exit(1);
    }
};