import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    API.get("/employees").then((res) => setEmployees(res.data));
  }, []);

  const avgScore = employees.length
    ? (
        employees.reduce((s, e) => s + e.performanceScore, 0) / employees.length
      ).toFixed(1)
    : 0;

  const departments = [...new Set(employees.map((e) => e.department))].length;
  const topEmployee = employees[0];

  return (
    <div style={styles.page}>
      <h2>Welcome back, {user?.name} 👋</h2>
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Total Employees</h3>
          <p style={styles.num}>{employees.length}</p>
        </div>
        <div style={styles.card}>
          <h3>Avg Performance</h3>
          <p style={styles.num}>{avgScore}</p>
        </div>
        <div style={styles.card}>
          <h3>Departments</h3>
          <p style={styles.num}>{departments}</p>
        </div>
        <div style={styles.card}>
          <h3>Top Performer</h3>
          <p style={styles.num}>{topEmployee?.name || "N/A"}</p>
        </div>
      </div>

      <h3 style={{ marginTop: "32px" }}>🏆 Top 5 Employees</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            {["Rank", "Name", "Department", "Score", "Experience"].map((h) => (
              <th key={h} style={styles.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.slice(0, 5).map((emp, i) => (
            <tr key={emp._id}>
              <td style={styles.td}>{i + 1}</td>
              <td style={styles.td}>{emp.name}</td>
              <td style={styles.td}>{emp.department}</td>
              <td style={styles.td}>
                <span
                  style={{
                    color: emp.performanceScore >= 70 ? "green" : "red",
                  }}
                >
                  {emp.performanceScore}
                </span>
              </td>
              <td style={styles.td}>{emp.experience} yrs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  page: { padding: "32px", maxWidth: "1000px", margin: "0 auto" },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "16px",
    marginTop: "24px",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  num: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#3b82f6",
    margin: "8px 0 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  th: {
    background: "#1e293b",
    color: "white",
    padding: "12px 16px",
    textAlign: "left",
  },
  td: { padding: "12px 16px", borderBottom: "1px solid #f1f5f9" },
};

export default Dashboard;
