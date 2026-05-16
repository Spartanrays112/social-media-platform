// import { useNavigate, useLocation } from "react-router-dom";

// const LeftSidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation(); // get current URL

//   const menuItems = [
//     { name: "Home", path: "/", icon: "🏠" },
//     { name: "Profile", path: "/profile", icon: "👤" },
//     { name: "Users", path: "/users", icon: "👥" },
//     // { name: "Photos", path: "/photos", icon: "🖼" },
//     { name: "Settings", path: "/settings", icon: "⚙" },
//   ];

//   return (
//     <div
//       style={{
//         flex: 1,
//         padding: "20px",
//         background: "#fff",
//         minHeight: "100vh",
//         marginTop: "60px",
//       }}
//     >
//       {menuItems.map((item) => (
//         <p
//           key={item.name}
//           onClick={() => navigate(item.path)}
//           style={{
//             cursor: "pointer",
//             padding: "8px 12px",
//             borderRadius: "8px",
//             backgroundColor: location.pathname === item.path ? "#e4e6eb" : "transparent",
//             marginBottom: 5,
//           }}
//         >
//           <span style={{ marginRight: 8 }}>{item.icon}</span>
//           {item.name}
//         </p>
//       ))}
//     </div>
//   );
// };

// export default LeftSidebar;
import { useNavigate, useLocation } from "react-router-dom";
import "./leftSidebar.css";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "Users", path: "/users", icon: "👥" },
    { name: "Settings", path: "/settings", icon: "⚙" },
  ];

  return (
    <div className="left-sidebar">
      {menuItems.map((item) => (
        <div
          key={item.name}
          className={`sidebar-item ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => navigate(item.path)}
        >
          <span className="sidebar-icon">{item.icon}</span>
          <span className="sidebar-text">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;

