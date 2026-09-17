import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "..//models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response)=> {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { name, email } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBookmark = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { postId } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    const alreadySaved = user.bookmarks.some(
      (id: any) => id.toString() === postId
    );

    if (alreadySaved) {
      user.bookmarks = user.bookmarks.filter(
        (id: any) => id.toString() !== postId
      );
    } else {
      user.bookmarks.push(postId as any);
    }

    await user.save();

    res.status(200).json({
      message: alreadySaved ? "Removed from bookmarks" : "Post saved",
      bookmarks: user.bookmarks,
      saved: !alreadySaved,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookmarks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(userId).populate({
      path: "bookmarks",
      populate: { path: "author", select: "name email" },
    });

    res.status(200).json(user?.bookmarks || []);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
