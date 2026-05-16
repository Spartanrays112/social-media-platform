import { useEffect, useState } from "react";
import axios from "axios";
import "./RightSidebar.css";

const RightSidebar = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [activities, setActivities] = useState([]);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  /* ================= SUGGESTIONS ================= */
  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/suggestions",
        { headers }
      );
      setSuggestions(res.data);
    } catch (err) {
      console.error("Suggestions error", err);
    }
  };

  const handleFollow = async (userId) => {
    await axios.post(
      "http://localhost:5000/api/user/follow",
      { followingId: userId },
      { headers }
    );

    setSuggestions((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isFollowing: true } : u
      )
    );
  };

  const handleUnfollow = async (userId) => {
    await axios.post(
      "http://localhost:5000/api/user/unfollow",
      { followingId: userId },
      { headers }
    );

    setSuggestions((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isFollowing: false } : u
      )
    );
  };

  /* ================= ACTIVITY ================= */
  const fetchActivity = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/activity",
        { headers }
      );
      setActivities(res.data);
    } catch (err) {
      console.error("Activity error", err);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    fetchActivity();
  }, []);

  return (
    <div className="right-sidebar">
      {/* ===== Suggestions ===== */}
      <div className="sidebar-card">
        <h4>Suggestions</h4>

        {suggestions.length === 0 && <p>No suggestions</p>}

        {suggestions.map((user) => (
          <div key={user.id} className="sidebar-item">
            <span>{user.name}</span>

            {user.isFollowing ? (
              <button
                className="unfollow-btn"
                onClick={() => handleUnfollow(user.id)}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="follow-btn"
                onClick={() => handleFollow(user.id)}
              >
                Follow
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ===== Latest Activity ===== */}
      <div className="sidebar-card">
        <h4>Latest Activity</h4>

        {activities.length === 0 && <p>No recent activity</p>}

        {activities.map((a, index) => (
          <p key={index}>
            <strong>{a.name}</strong> started following you
          </p>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
