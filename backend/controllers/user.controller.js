
import db from "../db.js";

export const getProfile = async (req, res) => {
  try {
    // if id exists → other user profile
    // else → own profile (JWT)
    const userId = req.query.id || req.user.id;

    const [user] = await db.query(
      `
      SELECT 
        id,
        name,
        email,
        profile_image
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= USERS LIST ================= */
export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const [users] = await db.execute(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        CASE 
          WHEN f.follower_id IS NOT NULL THEN true
          ELSE false
        END AS isFollowing
      FROM users u
      LEFT JOIN followers f
        ON u.id = f.following_id
        AND f.follower_id = ?
      WHERE u.id != ?
      `,
      [currentUserId, currentUserId]
    );

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ================= FOLLOW ================= */
export const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { followingId } = req.body;

    await db.execute(
      "INSERT IGNORE INTO followers (follower_id, following_id) VALUES (?, ?)",
      [followerId, followingId]
    );

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Follow failed" });
  }
};

/* ================= UNFOLLOW ================= */
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { followingId } = req.body;

    await db.execute(
      "DELETE FROM followers WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId]
    );

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unfollow failed" });
  }
};

/* ================= FOLLOW COUNTS ================= */
export const getFollowCounts = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[followers]] = await db.execute(
      "SELECT COUNT(*) AS count FROM followers WHERE following_id = ?",
      [userId]
    );

    const [[following]] = await db.execute(
      "SELECT COUNT(*) AS count FROM followers WHERE follower_id = ?",
      [userId]
    );

    res.json({
      followers: followers.count,
      following: following.count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch follow counts" });
  }
};

/* ================= SUGGESTIONS ================= */
export const getSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await db.execute(
      `
      SELECT id, name
      FROM users
      WHERE id != ?
      AND id NOT IN (
        SELECT following_id
        FROM followers
        WHERE follower_id = ?
      )
      LIMIT 5
      `,
      [userId, userId]
    );

    res.json(users);
  } catch (err) {
    console.error("Suggestions error:", err);
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
};
export const getLatestActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(`
      SELECT 
        u.name,
        'started following you' AS action
      FROM followers f
      JOIN users u ON u.id = f.follower_id
      WHERE f.following_id = ?
      ORDER BY f.id DESC
      LIMIT 5
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error("Activity error:", err);
    res.status(500).json({ message: "Failed to load activity" });
  }
};
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    await db.query(
      "UPDATE users SET profile_image = ? WHERE id = ?",
      [req.file.filename, userId]
    );

    res.json({ profile_image: req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const    searchUsers = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query required" });
  }

  try {
    const [users] = await db.query(
      `SELECT id, name, profile_image 
       FROM users 
       WHERE name LIKE ? 
       LIMIT 10`,
      [`%${q}%`]
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};
