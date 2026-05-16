// import "../styles/post.css";

// const PostCard = ({ post }) => {
//   return (
//     <div className="post-card">
//       <strong>{post.user_name}</strong>
//       <p>{post.caption}</p>

//       {post.image && (
//         <img
//           src={`http://localhost:5000/uploads/${post.image}`}
//           alt=""
//         />
//       )}

//       <div className="post-actions">
//         <button>🤍 Like</button>
//         <button>💬 Comment</button>
//       </div>
//     </div>
//   );
// };

// export default PostCard;

const PostCard = ({ post, onLike, onToggleComments }) => {
  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={`http://localhost:5000/uploads/${post.avatar || "default-avatar.png"}`}
          alt="User"
          className="avatar"
        />
        <strong>{post.user_name}</strong>
      </div>

      {post.image && (
        <img
          src={`http://localhost:5000/uploads/${post.image}`}
          alt=""
          className="post-image"
        />
      )}

      {post.caption && <p className="post-caption">{post.caption}</p>}

      <div className="post-actions">
        <button onClick={() => onLike(post.id)}>
          {post.isLiked ? "❤️" : "🤍"} {post.likeCount || 0}
        </button>
        <button onClick={() => onToggleComments(post.id)}>
          💬 Comments
        </button>
      </div>
    </div>
  );
};

export default PostCard;

