import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        alert("Admin login successful!");
        navigate("/admin-dashboard"); // Redirect to Admin Dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    background: "#fff",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    background: "#28a745",
    color: "white",
    cursor: "pointer"
  },
  error: {
    color: "red",
    fontSize: "14px"
  }
};

export default AdminLogin;
