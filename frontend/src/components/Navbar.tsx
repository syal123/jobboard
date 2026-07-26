import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #ccc" }}>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      <Link to="/jobs">Jobs</Link>
      <Link to="/dashboard">Dashboard</Link>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
