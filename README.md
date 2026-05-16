# Social Media Profile

A modern full-stack social media application built using the MERN-style architecture with React frontend and Node.js backend. Users can create posts, upload images, follow other users, like posts, and interact through comments.

---

## Features

- User Authentication with JWT
- User Registration & Login
- User Profile Pages
- Create, Read, and Delete Posts
- Image Upload Support
- Like & Unlike Posts
- Comment System
- Follow & Unfollow Users
- Protected Routes
- Responsive Frontend UI
- RESTful API Architecture

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Multer

---

## Project Structure

```bash
social-media-profile/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── App.jsx
```

---

## API Routes

### Authentication
- `/api/auth`

### Users
- `/api/user`

### Posts
- `/api/posts`

### Likes
- `/api/likes`

### Comments
- `/api/comments`

### Follow System
- `/api/follow`

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/Spartanrays112/social-media-platform.git
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Create `.env`

```env
JWT_SECRET=your_secret_key

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=social_media

PORT=5000
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

Backend runs on:

```bash
http://localhost:5000
```

---

## Environment Requirements

- Node.js >= 16
- MySQL Server

---

## Main Functionalities

- Secure JWT Authentication
- Full CRUD Operations for Posts
- Image Upload Handling
- Dynamic User Profiles
- Social Features (Likes, Comments, Follow)
- Protected Frontend Routes

---

## Future Improvements

- Real-time Chat
- Notifications
- Reels / Stories Feature
- Dark Mode
- Deploy on Cloud

---

## License

This project is licensed under the MIT License.# social-media-platform
