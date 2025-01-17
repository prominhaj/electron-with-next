import mongoose from "mongoose";
import config from "./config";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURL = config.MONGO_URL || "";
    if (!mongoURL) {
      throw new Error("MONGO_URL is not defined in the environment variables.");
    }

    await mongoose.connect(mongoURL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
