
import db from "../db.js";

/**
 * ADD COMMENT / REPLY
 * Protected Route
 */export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId, text, parentCommentId } = req.body;

    if (!postId || !text) {
      return res.status(400).json({ message: "Missing data" });
    }

    await db.query(
      `INSERT INTO comments (user_id, post_id, text, parent_comment_id)
       VALUES (?, ?, ?, ?)`,
      [userId, postId, text, parentCommentId || null]
    );

    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GET COMMENTS BY POST (NESTED)
 * Public Route
 */export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        c.id,
        c.text,
        c.parent_comment_id,
        c.user_id,
        u.name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
      `,
      [postId]
    );

    const commentMap = {};
    const rootComments = [];

    rows.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    rows.forEach((comment) => {
      if (comment.parent_comment_id) {
        commentMap[comment.parent_comment_id]?.replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    res.json(rootComments);
  } catch (err) {
    console.error("GET COMMENTS ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * EDIT COMMENT
 * Protected Route (only owner)
 */
export const editComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const [result] = await db.query(
      "UPDATE comments SET text = ? WHERE id = ? AND user_id = ?",
      [text, commentId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "You can edit only your own comment" });
    }

    res.status(200).json({
      message: "Comment updated successfully",
      comment: { id: commentId, text }
    });
  } catch (err) {
    console.error("EDIT COMMENT ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * DELETE COMMENT
 * Protected Route (only owner)
 */
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const [result] = await db.query(
      "DELETE FROM comments WHERE id = ? AND user_id = ?",
      [commentId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "You can delete only your own comment" });
    }

    res.status(200).json({ message: "Comment deleted successfully", commentId });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
