import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/postRoutes";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB Connected");
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB Error:", error);

    res.status(500).json({
      message: "MongoDB connection failed",
      error: error instanceof Error ? error.message : error,
    });
  }
});

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

app.use("/uploads", express.static("uploads"));

export default app;