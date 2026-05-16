import db from "../db.js";

/* ================= CREATE POST ================= */
export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { caption } = req.body;
    const image = req.file ? req.file.filename : null;

    // content is REQUIRED in DB
    const content = caption || "";

    await db.query(
      "INSERT INTO posts (user_id, content, caption, image) VALUES (?, ?, ?, ?)",
      [userId, content, caption || null, image]
    );

    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= GET POSTS ================= */
export const getPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const [posts] = await db.query(
      `
      SELECT 
        p.id,
        p.user_id,
        p.caption,
        p.image,
        p.created_at,

        -- USER DATA (THIS WAS MISSING)
        u.name AS user_name,
        u.profile_image,

        -- like count
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likeCount,

        -- comment count
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS commentCount,

        -- is liked by logged-in user
        EXISTS (
          SELECT 1 FROM likes l 
          WHERE l.post_id = p.id AND l.user_id = ?
        ) AS isLiked

      FROM posts p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
      `,
      [userId]
    );

    res.json(posts);
  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [post] = await db.query(
      "SELECT * FROM posts WHERE id = ?",
      [id]
    );

    if (post.length === 0)
      return res.status(404).json({ message: "Post not found" });

    if (post[0].user_id !== userId)
      return res.status(403).json({ message: "Not authorized" });

    // delete comments
    await db.query("DELETE FROM comments WHERE post_id = ?", [id]);

    // delete likes
    await db.query("DELETE FROM likes WHERE post_id = ?", [id]);

    // delete post
    await db.query("DELETE FROM posts WHERE id = ?", [id]);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};
