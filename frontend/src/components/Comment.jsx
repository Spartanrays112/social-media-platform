// src/components/Comment.jsx
import React, { useState } from "react";

const Comment = ({ comment, userId, handleAddReply, handleEditComment, handleDeleteComment }) => {
  const [replyText, setReplyText] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  return (
    <div style={{ marginLeft: comment.parent_id ? "20px" : "0px", marginTop: "5px" }}>
      <b>{comment.name}:</b>{" "}
      {editing ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button onClick={() => { handleEditComment(comment.id, editText); setEditing(false); }}>💾</button>
          <button onClick={() => setEditing(false)}>❌</button>
        </>
      ) : (
        <>
          {comment.text}{" "}
          {comment.user_id === userId && (
            <>
              <button onClick={() => setEditing(true)}>✏️</button>
              <button onClick={() => handleDeleteComment(comment.id)}>🗑️</button>
            </>
          )}
        </>
      )}

      {/* Reply button */}
      <button onClick={() => setReplyOpen(!replyOpen)}>Reply</button>

      {replyOpen && (
        <div style={{ marginTop: "5px" }}>
          <input
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button onClick={() => {
            handleAddReply(comment.id, replyText);
            setReplyText("");
            setReplyOpen(false);
          }}>Post</button>
        </div>
      )}

      {/* Render nested replies recursively */}
      {comment.replies?.length > 0 && (
        <div style={{ marginTop: "5px" }}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              userId={userId}
              handleAddReply={handleAddReply}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
