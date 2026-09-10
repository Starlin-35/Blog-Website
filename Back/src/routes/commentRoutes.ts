import express from "express";
import {addComment,getComments,deleteComment,} from "../controllers/commentControllers";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/:postId", getComments);
router.delete("/:id", protect, deleteComment);

export default router;