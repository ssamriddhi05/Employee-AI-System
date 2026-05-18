import { useEffect, useState } from "react";
import API from "../api/axios";

const AIRecommendations = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/employees").then((res) => setEmployees(res.data));
  }, []);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAnalyze = async () => {
    const chosen = employees.filter((e) => selected.includes(e._id));
    if (chosen.length === 0) return alert("Select at least one employee");
    setLoading(true);
    setResult("");
    try {
      const { data } = await API.post("/ai/recommend", { employees: chosen });
      setResult(data.recommendation);
    } catch (err) {
      setResult("Error: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <h2>🤖 AI Performance Insights</h2>
      <p style={{ color: "#64748b" }}>
        Select employees to analyze and get AI-powered recommendations.
      </p>

      <div style={styles.grid}>
        {employees.map((emp) => (
          <div
            key={emp._id}
            onClick={() => toggle(emp._id)}
            style={{
              ...styles.card,
              border: selected.includes(emp._id)
                ? "2px solid #3b82f6"
                : "2px solid transparent",
            }}
          >
            <h4 style={{ margin: "0 0 4px" }}>{emp.name}</h4>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
              {emp.department} • Score: {emp.performanceScore}
            </p>
          </div>
        ))}
      </div>

      <button onClick={handleAnalyze} disabled={loading} style={styles.btn}>
        {loading ? "⏳ Analyzing..." : "🚀 Generate AI Recommendations"}
      </button>

      {result && (
        <div style={styles.result}>
          <h3>📊 AI Analysis Results</h3>
          <pre style={styles.pre}>{result}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: "32px", maxWidth: "1000px", margin: "0 auto" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
    gap: "12px",
    margin: "20px 0",
  },
  card: {
    background: "white",
    borderRadius: "10px",
    padding: "16px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "all 0.2s",
  },
  btn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "8px",
  },
  result: {
    marginTop: "28px",
    background: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  pre: {
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
    lineHeight: "1.7",
    color: "#334155",
  },
};

export default AIRecommendations;
