import express from "express";
import { login, register , updateProfile,deleteAccount,toggleBookmark,getBookmarks } from "../controllers/authControllers";
import { protect } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteAccount);
router.put("/bookmark", protect, toggleBookmark);
router.get("/bookmarks", protect, getBookmarks);

export default router;