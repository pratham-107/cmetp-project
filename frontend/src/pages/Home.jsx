import { Link } from "react-router-dom";
import "../styles/Home.css";
import { useEffect } from "react";
import AOS from "aos";

export default function Home() {
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <div className="home-container text-center">
      <div className="overlay" data-aos="zoom-in" data-aos-duration="1000">
        <h1 className="display-4 text-white">🎓 Campus Event Tracker</h1>
        <p className="lead text-white" data-aos="fade-up" data-aos-delay="200">
          Discover, join, and manage student events on your campus.
        </p>

        <div className="mt-4 button-group" data-aos="fade-up" data-aos-delay="400">
          <Link to="/register" className="btn btn-primary mx-2 mb-2">
            Register as User
          </Link>
          <Link to="/login" className="btn btn-outline-light mx-2 mb-2">
            User Login
          </Link>
          <Link to="/admin-login" className="btn btn-warning mx-2 mb-2">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
