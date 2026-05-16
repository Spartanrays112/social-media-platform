import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../services/userService"; // your service
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle search input change
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const results = await searchUsers(value); // call backend
      setSearchResults(results);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Handle selecting a user
  const handleSelectUser = (userId) => {
    setQuery("");
    setSearchResults([]);
    setShowDropdown(false);
    navigate(`/profile/${userId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h3 onClick={() => navigate("/")}>MySocial</h3>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={handleSearchChange}
          onFocus={() => query && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // delay to allow click
        />

        {showDropdown && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="search-item"
                onClick={() => handleSelectUser(user.id)}
              >
                {user.username || user.name} {/* Display name */}
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Navbar;
