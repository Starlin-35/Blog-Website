import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.log("MONGO_URI is missing");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);
    process.exit(1);
  });