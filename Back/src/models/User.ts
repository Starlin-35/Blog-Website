import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    bookmarks: [
    {
    type: Schema.Types.ObjectId,
    ref: "Post",
    },
],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;