import { useEffect, useState } from "react";
import API from "../api/axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    skills: "",
    performanceScore: "",
    experience: "",
  });
  const [msg, setMsg] = useState("");

  const fetchEmployees = async () => {
    const { data } = await API.get("/employees");
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async () => {
    const { data } = await API.get(
      `/employees/search?department=${dept}&name=${search}`,
    );
    setEmployees(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()),
      performanceScore: Number(form.performanceScore),
      experience: Number(form.experience),
    };
    try {
      if (editId) {
        await API.put(`/employees/${editId}`, payload);
        setMsg("Employee updated!");
      } else {
        await API.post("/employees", payload);
        setMsg("Employee added!");
      }
      setForm({
        name: "",
        email: "",
        department: "",
        skills: "",
        performanceScore: "",
        experience: "",
      });
      setShowForm(false);
      setEditId(null);
      fetchEmployees();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    }
  };

  const handleEdit = (emp) => {
    setForm({ ...emp, skills: emp.skills.join(", ") });
    setEditId(emp._id);
    setShowForm(true);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>👥 Employees</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm({
              name: "",
              email: "",
              department: "",
              skills: "",
              performanceScore: "",
              experience: "",
            });
          }}
          style={styles.addBtn}
        >
          {showForm ? "Cancel" : "+ Add Employee"}
        </button>
      </div>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>{editId ? "Edit Employee" : "Add New Employee"}</h3>
          {["name", "email", "department"].map((f) => (
            <input
              key={f}
              style={styles.input}
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              required
            />
          ))}
          <input
            style={styles.input}
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Performance Score (0-100)"
            type="number"
            min="0"
            max="100"
            value={form.performanceScore}
            onChange={(e) =>
              setForm({ ...form, performanceScore: e.target.value })
            }
            required
          />
          <input
            style={styles.input}
            placeholder="Years of Experience"
            type="number"
            min="0"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            required
          />
          <button type="submit" style={styles.submitBtn}>
            {editId ? "Update" : "Add"} Employee
          </button>
        </form>
      )}

      <div style={styles.searchBar}>
        <input
          style={styles.searchInput}
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          style={styles.searchInput}
          placeholder="Filter by department..."
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        />
        <button onClick={handleSearch} style={styles.searchBtn}>
          Search
        </button>
        <button onClick={fetchEmployees} style={styles.resetBtn}>
          Reset
        </button>
      </div>

      <div style={styles.grid}>
        {employees.map((emp) => (
          <div key={emp._id} style={styles.card}>
            <h3 style={styles.empName}>{emp.name}</h3>
            <p>📧 {emp.email}</p>
            <p>🏢 {emp.department}</p>
            <p>
              ⭐ Score:{" "}
              <strong
                style={{ color: emp.performanceScore >= 70 ? "green" : "red" }}
              >
                {emp.performanceScore}
              </strong>
            </p>
            <p>🕐 {emp.experience} years exp</p>
            <p>🛠 {emp.skills.join(", ")}</p>
            <div style={styles.actions}>
              <button onClick={() => handleEdit(emp)} style={styles.editBtn}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(emp._id)}
                style={styles.delBtn}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: "32px", maxWidth: "1200px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  addBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },
  form: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    boxSizing: "border-box",
  },
  submitBtn: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
  },
  searchBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  searchInput: {
    padding: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    flex: "1",
    minWidth: "150px",
  },
  searchBtn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  resetBtn: {
    background: "#94a3b8",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
    gap: "16px",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  empName: { color: "#1e293b", marginTop: 0 },
  actions: { display: "flex", gap: "8px", marginTop: "12px" },
  editBtn: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  delBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Employees;
