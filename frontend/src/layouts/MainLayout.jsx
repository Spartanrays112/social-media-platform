import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />

      <div style={{ display: "flex", marginTop: "60px" }}>
        <LeftSidebar />

        <div
          style={{
            flex: 2,
            padding: "20px",
            background: "#f0f2f5",
            minHeight: "100vh",
          }}
        >
          {children}
        </div>

        <RightSidebar />
      </div>
    </>
  );
};

export default MainLayout;
