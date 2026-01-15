import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI not defined - running without database");
      return;
    }

    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.warn("⚠️ Continuing without database - some features may be limited");
    // Don't exit, allow server to run without DB for testing
  }
};

// Runtime connection errors
mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err.message);
});

export default connectDB;
