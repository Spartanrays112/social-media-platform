
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/authService"; // ✅ use service
import "./signup.css";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await signup({ name, email, password }); // ✅ service call

      setMessage("Signup successful! Please login.");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Signup</h2>

        <form onSubmit={handleSignup}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
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

          <button type="submit">Signup</button>
        </form>

        {message && <p className="auth-error">{message}</p>}

        <Link to="/">Already have an account? Login</Link>
      </div>
    </div>
  );
}

export default Signup;
