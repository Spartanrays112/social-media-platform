import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [commentTextMap, setCommentTextMap] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [deletePostId, setDeletePostId] = useState(null);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [activeReply, setActiveReply] = useState({}); // <-- tracks which reply input is open

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const userId = JSON.parse(atob(token.split(".")[1])).id;

  /* ================= FETCH POSTS ================= */
  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/api/posts", { headers });
    setPosts(res.data);

    const cm = {}, ot = {}, ct = {}, rt = {}, ar = {};
    res.data.forEach((p) => {
      cm[p.id] = [];
      ot[p.id] = false;
      ct[p.id] = "";
      rt[p.id] = {};
      ar[p.id] = null; // active reply
    });

    setCommentsMap(cm);
    setOpenComments(ot);
    setCommentTextMap(ct);
    setReplyTextMap(rt);
    setActiveReply(ar);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ================= LIKE ================= */
  const handleLike = async (postId, liked) => {
    await axios.post(
      `http://localhost:5000/api/likes/${liked ? "unlike" : "like"}`,
      { postId },
      { headers }
    );
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: liked ? 0 : 1,
              likeCount: liked ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      )
    );
  };

  /* ================= COMMENTS ================= */
  const toggleComments = async (postId) => {
    if (!openComments[postId]) {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${postId}`,
        { headers }
      );
      setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
    }
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId, parentCommentId = null) => {
    const text = parentCommentId
      ? replyTextMap[postId]?.[parentCommentId]
      : commentTextMap[postId];
    if (!text?.trim()) return;

    await axios.post(
      "http://localhost:5000/api/comments",
      { postId, text, parentCommentId },
      { headers }
    );

    const res = await axios.get(
      `http://localhost:5000/api/comments/${postId}`,
      { headers }
    );
    setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));

    if (parentCommentId) {
      setReplyTextMap((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], [parentCommentId]: "" },
      }));
      setActiveReply((prev) => ({ ...prev, [postId]: null })); // <-- CLOSE reply input
    } else {
      setCommentTextMap((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
      headers,
    });
    const res = await axios.get(
      `http://localhost:5000/api/comments/${postId}`,
      { headers }
    );
    setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
  };

  const handleUpdateComment = async (commentId, postId) => {
    await axios.put(
      `http://localhost:5000/api/comments/${commentId}`,
      { text: editCommentText },
      { headers }
    );
    const res = await axios.get(
      `http://localhost:5000/api/comments/${postId}`,
      { headers }
    );
    setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
    setEditingCommentId(null);
    setEditCommentText("");
  };

  /* ================= DELETE POST ================= */
  const handleDeletePost = async (postId) => {
    await axios.delete(`http://localhost:5000/api/posts/${postId}`, { headers });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setDeletePostId(null);
  };

  /* ================= RENDER COMMENTS ================= */
  const renderComments = (comments, postId, level = 0) =>
    comments.map((c) => (
      <div key={c.id} className={`comment-row ${level ? "nested" : ""}`}>
        <div className="comment-line">
          <strong className="comment-username">{c.name}</strong>
          {editingCommentId === c.id ? (
            <input
              className="edit-input"
              value={editCommentText}
              onChange={(e) => setEditCommentText(e.target.value)}
            />
          ) : (
            <span className="comment-text">{c.text}</span>
          )}
        </div>

        <div className="comment-actions">
          {/* REPLY BUTTON TOGGLE */}
          <button
            className="action-btn"
            onClick={() =>
              setActiveReply((prev) => ({
                ...prev,
                [postId]: prev[postId] === c.id ? null : c.id, // <-- toggle
              }))
            }
          >
            Reply
          </button>

          {c.user_id === userId && (
            <>
              {editingCommentId === c.id ? (
                <button
                  className="action-btn"
                  onClick={() => handleUpdateComment(c.id, postId)}
                >
                  Save
                </button>
              ) : (
                <button
                  className="action-btn"
                  onClick={() => {
                    setEditingCommentId(c.id);
                    setEditCommentText(c.text);
                  }}
                >
                  Edit
                </button>
              )}
              <button
                className="action-btn danger"
                onClick={() => handleDeleteComment(c.id, postId)}
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* REPLY INPUT */}
        {activeReply[postId] === c.id && (
          <div className="reply-input">
            <input
              placeholder="Reply..."
              value={replyTextMap[postId]?.[c.id] || ""}
              onChange={(e) =>
                setReplyTextMap((prev) => ({
                  ...prev,
                  [postId]: { ...prev[postId], [c.id]: e.target.value },
                }))
              }
            />
            <button onClick={() => handleAddComment(postId, c.id)}>Post</button>
          </div>
        )}

        {c.replies?.length > 0 && (
          <div className="nested-comments">
            {renderComments(c.replies, postId, level + 1)}
          </div>
        )}
      </div>
    ));

  return (
    <MainLayout>
      <div className="home-container">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            {/* HEADER */}
            <div className="post-header">
              <div className="post-user">
                <div
                  className="avatar"
                  onClick={() => navigate(`/profile/${post.user_id}`)}
                >
                  {post.profile_image ? (
                    <img
                      src={`http://localhost:5000/uploads/${post.profile_image}`}
                      alt=""
                    />
                  ) : (
                    post.user_name.charAt(0)
                  )}
                </div>
                <span
                  className="username"
                  onClick={() => navigate(`/profile/${post.user_id}`)}
                >
                  {post.user_name}
                </span>
              </div>

              {post.user_id === userId && (
                <button
                  className="menu-btn"
                  onClick={() => setDeletePostId(post.id)}
                >
                  ⋮
                </button>
              )}
            </div>

            {post.image && (
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
                className="post-img"
                alt=""
              />
            )}

            {post.caption && <p className="post-caption-text">{post.caption}</p>}

            <div className="post-actions">
              <button onClick={() => handleLike(post.id, post.isLiked)}>
                {post.isLiked ? "❤️" : "🤍"} {post.likeCount}
              </button>
              <button onClick={() => toggleComments(post.id)}>💬 Comments</button>
            </div>

            {openComments[post.id] && (
              <div className="comments-section">
                {renderComments(commentsMap[post.id], post.id)}

                <div className="add-comment">
                  <input
                    placeholder="Add a comment..."
                    value={commentTextMap[post.id]}
                    onChange={(e) =>
                      setCommentTextMap((p) => ({ ...p, [post.id]: e.target.value }))
                    }
                  />
                  <button onClick={() => handleAddComment(post.id)}>Post</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {deletePostId && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Delete Post?</h3>
              <div className="modal-actions">
                <button
                  className="danger"
                  onClick={() => handleDeletePost(deletePostId)}
                >
                  Delete
                </button>
                <button onClick={() => setDeletePostId(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
