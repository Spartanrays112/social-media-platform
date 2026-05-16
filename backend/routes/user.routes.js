// import express from "express";
// import {
//   getProfile,
//   getUsers,
//   followUser,
//   unfollowUser,
//   getFollowCounts,
//   getSuggestions,
//   getLatestActivity,
  
// } from "../controllers/user.controller.js";

// import authMiddleware from "../middleware/authMiddleware.js";


// const router = express.Router();

// /* ================= ROUTES ================= */
// router.get("/profile", authMiddleware, getProfile);
// router.get("/list", authMiddleware, getUsers);
// router.get("/follow-count", authMiddleware, getFollowCounts);
// router.get("/suggestions", authMiddleware, getSuggestions);

// router.post("/follow", authMiddleware, followUser);
// router.post("/unfollow", authMiddleware, unfollowUser);
// router.get("/activity", authMiddleware, getLatestActivity);

// // ✅ PROFILE IMAGE UPLOAD (NEW)
// router.post(
//   "/profile-image",
//   authMiddleware,
//   uploadProfile.single("image"),
//   uploadProfileImage
// );

// export default router;
import express from "express";

import {
  getProfile,
  getUsers,
  followUser,
  unfollowUser,
  getFollowCounts,
  getSuggestions,
  getLatestActivity,
  uploadProfileImage, 
  searchUsers, // ✅ controller
} from "../controllers/user.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.middleware.js"; // ✅ THIS IS THE KEY

const router = express.Router();

/* ================= ROUTES ================= */
router.get("/profile", authMiddleware, getProfile);
router.get("/list", authMiddleware, getUsers);
router.get("/follow-count", authMiddleware, getFollowCounts);
router.get("/suggestions", authMiddleware, getSuggestions);
router.get("/search", authMiddleware, searchUsers);


router.post("/follow", authMiddleware, followUser);
router.post("/unfollow", authMiddleware, unfollowUser);
router.get("/activity", authMiddleware, getLatestActivity);

/* ================= PROFILE IMAGE UPLOAD ================= */
router.post(
  "/profile-image",
  authMiddleware,
  upload.single("image"), // ✅ FIXED (NOT uploadProfile)
  uploadProfileImage
);

export default router;
