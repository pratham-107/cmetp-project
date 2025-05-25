import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Login.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Init AOS on mount
  useState(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center login-bg">
      <div className="card shadow p-4 login-card" data-aos="zoom-in">
        <h2 className="text-center mb-4 text-primary">Student Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Enter your university email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-center small text-muted">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}
