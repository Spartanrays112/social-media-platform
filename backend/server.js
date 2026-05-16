// backend/server.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import followRoutes from "./routes/follow.routes.js";
import postRoutes from "./routes/post.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";



const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/follow", followRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
