import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { likePost, unlikePost } from "../controllers/like.controller.js";

const router = express.Router();

router.post("/like", authMiddleware, likePost);
router.post("/unlike", authMiddleware, unlikePost);

export default router;
