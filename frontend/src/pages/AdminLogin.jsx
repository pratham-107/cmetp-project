import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "aos/dist/aos.css";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        formData
      );
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminName", res.data.name);
      navigate("/admin-dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="admin-login-container">
      <form
        className="admin-login-form"
        onSubmit={handleSubmit}
        data-aos="zoom-in"
      >
        <h2>Admin Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Admin Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}
