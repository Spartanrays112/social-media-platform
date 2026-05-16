// import express from "express";
// import { authenticateToken } from "../middleware/authMiddleware.js";
// import {
//   createPost,
//   getUserPosts,
// } from "../controllers/post.controller.js";

// const router = express.Router();

// // Create a post
// router.post("/", authenticateToken, createPost);

// // Get all posts of a user (profile page)
// router.get("/user/:userId", authenticateToken, getUserPosts);

// // export default router;
// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import upload from "../middleware/multer.middleware.js";
// import { createPost } from "../controllers/post.controller.js";

// const router = express.Router();

// router.post(
//   "/",
//   authMiddleware,
//   upload.single("image"),
//   createPost
// );

// export default router;

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.middleware.js";
import { createPost, getPosts } from "../controllers/post.controller.js";
import { deletePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getPosts);
router.post("/", authMiddleware, upload.single("image"), createPost);

router.delete("/:id", authMiddleware, deletePost);


export default router;

