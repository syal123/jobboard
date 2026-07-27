import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

const cardStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "40px auto",
  padding: 32,
  backgroundColor: "#ffffff",
  color: "#1e293b",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
};

const fieldWrapperStyle: React.CSSProperties = { marginBottom: 16 };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  backgroundColor: "#f8fafc",
  color: "#1e293b",
  boxSizing: "border-box",
  marginTop: 4,
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

function LoginPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await apiClient.post("/auth/login", { userName, password });
      localStorage.setItem("token", response.data.token);
      setSuccessMessage("Login successful!");
      setTimeout(() => {
        navigate("/jobs");
      }, 1200);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, color: "#dc2626" }}>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={fieldWrapperStyle}>
          <label>
            Username
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={inputStyle}
            />
          </label>
        </div>
        <div style={fieldWrapperStyle}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </label>
        </div>
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
