// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import {
//   addComment,
//   getCommentsByPost
// } from "../controllers/comment.controller.js";

// const router = express.Router();

// router.post("/", authMiddleware, addComment);
// router.get("/:postId", authMiddleware, getCommentsByPost);

// export default router;
import express from "express";
import { addComment, getCommentsByPost, editComment, deleteComment } from "../controllers/comment.controller.js";
import verifyToken from "../middleware/authMiddleware.js"; // fixed import

const router = express.Router();

router.post("/", verifyToken, addComment);
router.get("/:postId", getCommentsByPost);
router.put("/:id", verifyToken, editComment);
router.delete("/:id", verifyToken, deleteComment);

export default router;
