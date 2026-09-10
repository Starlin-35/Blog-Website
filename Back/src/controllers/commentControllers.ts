import { Request, Response } from "express";
import Comment from "../models/Comment";

export const addComment = async (req: Request, res: Response) => {
  try {
    const { text, postId } = req.body;

    if (!text || !postId) {
      res.status(400).json({ message: "Text and postId are required" });
      return;
    }

    const newComment = new Comment({
      text,
      post: postId,
      user: (req as any).user.id,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "user",
      "name email"
    );

    res.status(201).json(populatedComment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ post: req.params.postId as string })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.user.toString() !== (req as any).user.id) {
      res.status(403).json({ message: "You can delete only your comment" });
      return;
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};