import { Link, useNavigate } from "react-router-dom";

const SIDEBAR_WIDTH = 220;

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle: React.CSSProperties = {
    color: "white",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 6,
  };

  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: SIDEBAR_WIDTH,
        backgroundColor: "#1e293b",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px 16px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.06em",
          marginBottom: 32,
          color: "#ef4444",
        }}
      >
        🚀 JobBoard
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flexGrow: 1 }}>
        <Link to="/register" style={linkStyle}>
          Register
        </Link>
        <Link to="/login" style={linkStyle}>
          Login
        </Link>
        <Link to="/jobs" style={linkStyle}>
          Jobs
        </Link>
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          backgroundColor: "#334155",
          color: "white",
          border: "none",
          padding: "10px 12px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Sidebar;
export { SIDEBAR_WIDTH };
