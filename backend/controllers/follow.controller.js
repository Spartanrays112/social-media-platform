import db from "../db.js"; // Make sure the path to db.js is correct

// Follow a user
export const followUser = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user
    const { userId: targetUserId } = req.params;

    // Prevent following self
    if (+userId === +targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if already following
    const [existing] = await db.execute(
      "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
      [userId, targetUserId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Insert follow
    await db.execute(
      "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
      [userId, targetUserId]
    );

    res.json({ message: "User followed successfully" });
  } catch (error) {
    console.error("FOLLOW USER ERROR:", error);
    res.status(500).json({ message: "Failed to follow user" });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userId: targetUserId } = req.params;

    await db.execute(
      "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
      [userId, targetUserId]
    );

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("UNFOLLOW USER ERROR:", error);
    res.status(500).json({ message: "Failed to unfollow user" });
  }
};
