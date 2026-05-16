
import jwt from "jsonwebtoken";
import db from "../db.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔑 MUST MATCH auth.controller.js
    const decoded = jwt.verify(token, "secretkey");

    const [rows] = await db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
  