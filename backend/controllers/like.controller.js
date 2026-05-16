import db from "../db.js";

// 👍 LIKE POST
export const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    await db.query(
      "INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)",
      [userId, postId]
    );

    res.json({ message: "Post liked" });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 👎 UNLIKE POST
export const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    await db.query(
      "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
      [userId, postId]
    );

    res.json({ message: "Post unliked" });
  } catch (err) {
    console.error("UNLIKE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
