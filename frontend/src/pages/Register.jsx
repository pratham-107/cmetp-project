import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Error during registration");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center register-bg">
      <div className="card shadow p-4 register-card" data-aos="zoom-in">
        <h2 className="text-center mb-4 text-success">
          Create Your Student Account
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="College Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-success w-100">Register</button>
        </form>
        <p className="mt-3 text-center small text-muted">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}
