

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams(); // undefined = own profile
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [posts, setPosts] = useState([]);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [commentsMap, setCommentsMap] = useState({});
  const [commentTextMap, setCommentTextMap] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [replyTextMap, setReplyTextMap] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [activeReply, setActiveReply] = useState({});
  const [deletePostId, setDeletePostId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const userId = JSON.parse(atob(token.split(".")[1])).id;

  const isOwnProfile = !id || id === userId.toString();

  const navigateToProfile = (clickedUserId) => {
    if (clickedUserId === userId) navigate("/profile");
    else navigate(`/profile/${clickedUserId}`);
  };

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      const profileRes = await axios.get(
        `http://localhost:5000/api/user/profile${id ? `?id=${id}` : ""}`,
        { headers }
      );
      setProfile(profileRes.data);

      const countRes = await axios.get(
        `http://localhost:5000/api/user/follow-count${id ? `?id=${id}` : ""}`,
        { headers }
      );
      setCounts(countRes.data);

      const postsRes = await axios.get("http://localhost:5000/api/posts", { headers });
      const userPosts = postsRes.data.filter((p) => p.user_id === profileRes.data.id);
      setPosts(userPosts);

      const cm = {}, ot = {}, ct = {}, rt = {}, ar = {};
      userPosts.forEach((p) => {
        cm[p.id] = [];
        ot[p.id] = false;
        ct[p.id] = "";
        rt[p.id] = {};
        ar[p.id] = null;
      });
      setCommentsMap(cm);
      setOpenComments(ot);
      setCommentTextMap(ct);
      setReplyTextMap(rt);
      setActiveReply(ar);
    } catch (err) {
      console.error("PROFILE FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* ================= PROFILE IMAGE UPLOAD ================= */
  const handleProfileImageUpload = async () => {
    if (!profileImage) return;
    const formData = new FormData();
    formData.append("image", profileImage);
    await axios.post("http://localhost:5000/api/user/profile-image", formData, { headers });
    setProfileImage(null);
    fetchData();
  };

  /* ================= CREATE POST ================= */
  const handleCreatePost = async () => {
    if (!caption && !image) return;
    const formData = new FormData();
    formData.append("caption", caption);
    if (image) formData.append("image", image);
    await axios.post("http://localhost:5000/api/posts", formData, { headers });
    setCaption("");
    setImage(null);
    fetchData();
  };

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
          ? { ...p, isLiked: liked ? 0 : 1, likeCount: liked ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    );
  };

  /* ================= COMMENTS ================= */
  const toggleComments = async (postId) => {
    if (!openComments[postId]) {
      const res = await axios.get(`http://localhost:5000/api/comments/${postId}`, { headers });
      setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
    }
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId, parentCommentId = null) => {
    const text = parentCommentId ? replyTextMap[postId]?.[parentCommentId] : commentTextMap[postId];
    if (!text?.trim()) return;
    await axios.post("http://localhost:5000/api/comments", { postId, text, parentCommentId }, { headers });
    const res = await axios.get(`http://localhost:5000/api/comments/${postId}`, { headers });
    setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
    if (parentCommentId) {
      setReplyTextMap((prev) => ({ ...prev, [postId]: { ...prev[postId], [parentCommentId]: "" } }));
      setActiveReply((prev) => ({ ...prev, [postId]: null }));
    } else {
      setCommentTextMap((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    await axios.delete(`http://localhost:5000/api/comments/${commentId}`, { headers });
    const res = await axios.get(`http://localhost:5000/api/comments/${postId}`, { headers });
    setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
  };

  const handleUpdateComment = async (commentId, postId) => {
    await axios.put(`http://localhost:5000/api/comments/${commentId}`, { text: editCommentText }, { headers });
    const res = await axios.get(`http://localhost:5000/api/comments/${postId}`, { headers });
    setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
    setEditingCommentId(null);
    setEditCommentText("");
  };

  /* ================= DELETE POST ================= */
  const handleDeletePost = async () => {
    await axios.delete(`http://localhost:5000/api/posts/${deletePostId}`, { headers });
    setPosts((prev) => prev.filter((p) => p.id !== deletePostId));
    setDeletePostId(null);
  };

  /* ================= RENDER COMMENTS ================= */
  const renderComments = (comments, postId, level = 0) =>
    comments.map((c) => (
      <div key={c.id} className={`comment-row ${level ? "nested" : ""}`}>
        <div className="comment-line">
          <strong className="comment-username">{c.name}</strong>
          {editingCommentId === c.id ? (
            <input value={editCommentText} onChange={(e) => setEditCommentText(e.target.value)} className="edit-input" />
          ) : (
            <span className="comment-text">{c.text}</span>
          )}
        </div>
        <div className="comment-actions">
          <button className="action-btn" onClick={() => setActiveReply((prev) => ({ ...prev, [postId]: prev[postId] === c.id ? null : c.id }))}>
            Reply
          </button>
          {c.user_id === userId && (
            <>
              {editingCommentId === c.id ? (
                <button className="action-btn" onClick={() => handleUpdateComment(c.id, postId)}>Save</button>
              ) : (
                <button className="action-btn" onClick={() => { setEditingCommentId(c.id); setEditCommentText(c.text); }}>Edit</button>
              )}
              <button className="action-btn danger" onClick={() => handleDeleteComment(c.id, postId)}>Delete</button>
            </>
          )}
        </div>
        {activeReply[postId] === c.id && (
          <div className="reply-input">
            <input placeholder="Reply..." value={replyTextMap[postId]?.[c.id] || ""} onChange={(e) => setReplyTextMap((prev) => ({ ...prev, [postId]: { ...prev[postId], [c.id]: e.target.value } }))} />
            <button onClick={() => handleAddComment(postId, c.id)}>Post</button>
          </div>
        )}
        {c.replies?.length > 0 && <div className="nested-comments">{renderComments(c.replies, postId, level + 1)}</div>}
      </div>
    ));

  if (!profile) return <p>Loading...</p>;

  return (
    <MainLayout>
      <div className="profile-container">
        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="profile-avatar clickable" onClick={() => navigateToProfile(profile.id)}>
            {profile.profile_image ? <img src={`http://localhost:5000/uploads/${profile.profile_image}`} alt="profile" /> : profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <div className="profile-counts">
              <span>Followers: {counts.followers}</span>
              <span>Following: {counts.following}</span>
            </div>
            {isOwnProfile && (
              <div className="profile-upload">
                <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
                <button onClick={handleProfileImageUpload}>Upload Photo</button>
              </div>
            )}
          </div>
        </div>

        {/* CREATE POST */}
        {isOwnProfile && (
          <div className="create-post">
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <textarea placeholder="Write caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
            <button onClick={handleCreatePost}>Post</button>
          </div>
        )}

        {/* POSTS FEED */}
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-user">
                <div className="avatar" onClick={() => navigateToProfile(post.user_id)}>
                  {profile.profile_image ? <img src={`http://localhost:5000/uploads/${profile.profile_image}`} alt="" /> : profile.name.charAt(0)}
                </div>
                <span className="username" onClick={() => navigateToProfile(post.user_id)}>{profile.name}</span>
              </div>
              {isOwnProfile && <button className="menu-btn" onClick={() => setDeletePostId(post.id)}>⋮</button>}
            </div>
            {post.image && <img src={`http://localhost:5000/uploads/${post.image}`} className="post-img" alt="" />}
            {post.caption && <p className="post-caption-text">{post.caption}</p>}
            <div className="post-actions">
              <button onClick={() => handleLike(post.id, post.isLiked)}>{post.isLiked ? "❤️" : "🤍"} {post.likeCount}</button>
              <button onClick={() => toggleComments(post.id)}>💬 Comments</button>
            </div>
            {openComments[post.id] && <div className="comments-section">{renderComments(commentsMap[post.id], post.id)}
              <div className="add-comment">
                <input placeholder="Add a comment..." value={commentTextMap[post.id]} onChange={(e) => setCommentTextMap((prev) => ({ ...prev, [post.id]: e.target.value }))} />
                <button onClick={() => handleAddComment(post.id)}>Post</button>
              </div>
            </div>}
          </div>
        ))}

        {/* DELETE POST MODAL */}
        {deletePostId && <div className="modal-overlay"><div className="modal-box">
          <h3>Delete Post?</h3>
          <div className="modal-actions">
            <button className="danger" onClick={handleDeletePost}>Delete</button>
            <button onClick={() => setDeletePostId(null)}>Cancel</button>
          </div>
        </div></div>}
      </div>
    </MainLayout>
  );
};

export default Profile;