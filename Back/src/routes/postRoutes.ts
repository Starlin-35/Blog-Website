import express from "express";
import {createPost,getAllPosts,getSinglePost,updatePost,deletePost,likePost,} from "../controllers/postControllers";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/upload";

const router = express.Router();

router.post("/", protect, upload.single("image"), createPost);
router.get("/", getAllPosts);
router.get("/:id", getSinglePost);
router.put("/like/:id", protect, likePost);
router.put("/:id", protect, upload.single("image"), updatePost);
router.delete("/:id", protect, deletePost);

export default router;