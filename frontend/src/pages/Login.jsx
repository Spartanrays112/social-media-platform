
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./login.css";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login</h2>

        {/* 🚫 NO onSubmit */}
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ✅ BUTTON IS NOT SUBMIT */}
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <Link to="/signup">Don't have an account? Signup</Link>
      </div>
    </div>
  );
}

export default Login;