// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import Home from "./pages/Home";
// import Profile from "./pages/profile ";
// import UserList from "./pages/UserList";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";

// const App = () => {
//   const token = localStorage.getItem("token");

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />

//         {/* OWN PROFILE */}
//         <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />

//         {/* OTHER USER PROFILE */}
//         <Route path="/profile/:id" element={token ? <Profile /> : <Navigate to="/login" />} />

//         <Route path="/users" element={token ? <UserList /> : <Navigate to="/login" />} />

//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/profile ";
import UserList from "./pages/UserList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Routes
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Own profile */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Other user profile */}
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Users list */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
