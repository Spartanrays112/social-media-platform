import { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/user/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
    setLoading(false);
  };

  const handleFollow = async (userId) => {
    await axios.post(
      "http://localhost:5000/api/user/follow",
      { followingId: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isFollowing: true } : u
      )
    );
  };

  const handleUnfollow = async (userId) => {
    await axios.post(
      "http://localhost:5000/api/user/unfollow",
      { followingId: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isFollowing: false } : u
      )
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="userlist-container" >
      <h2>User List</h2>

      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <span>{user.name}</span>

          {user.isFollowing ? (
            <button onClick={() => handleUnfollow(user.id)}>
              Unfollow
            </button>
          ) : (
            <button onClick={() => handleFollow(user.id)}>
              Follow
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserList;
