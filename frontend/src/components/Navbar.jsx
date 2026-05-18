import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🏢 EmpAI</h2>
      {user && (
        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>
            Dashboard
          </Link>
          <Link to="/employees" style={styles.link}>
            Employees
          </Link>
          <Link to="/ai" style={styles.link}>
            AI Insights
          </Link>
          <span style={styles.user}>👤 {user.name}</span>
          <button onClick={handleLogout} style={styles.btn}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#1e293b",
    color: "white",
  },
  logo: { margin: 0, color: "#38bdf8" },
  links: { display: "flex", gap: "16px", alignItems: "center" },
  link: { color: "#cbd5e1", textDecoration: "none", fontWeight: "500" },
  user: { color: "#94a3b8", fontSize: "14px" },
  btn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Navbar;
