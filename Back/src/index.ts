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

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is running");
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

export default app;