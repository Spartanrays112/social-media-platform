// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";

// import { followUser, unfollowUser } from "../controllers/follow.controller.js";

// const router = express.Router();

// router.post("/:userId", authenticateToken, followUser);
// router.post("/unfollow/:userId", authenticateToken, unfollowUser);

// export default router;

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { followUser, unfollowUser } from "../controllers/follow.controller.js";

const router = express.Router();

// ✅ USE authMiddleware, not authenticateToken
router.post("/:userId", authMiddleware, followUser);
router.post("/unfollow/:userId", authMiddleware, unfollowUser);

export default router;
        