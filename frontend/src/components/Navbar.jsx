import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Navbar.css";

export default function Navbar({ onToggleCalendar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark custom-navbar px-4 shadow-sm"
      data-aos="fade-down"
    >
      <Link className="navbar-brand fw-bold fs-4" to="/dashboard">
        <i className="bi bi-calendar-event-fill me-2"></i>CMETP
      </Link>

      <div className="collapse navbar-collapse justify-content-end">
        <div className="btn-wrapper d-flex align-items-center">
          <button
            className="btn uniform-btn btn-outline-light me-3"
            onClick={onToggleCalendar}
            title="Toggle Calendar"
          >
            <i className="bi bi-calendar3 me-1"></i> Calendar
          </button>
          <button
            className="btn uniform-btn btn-light text-primary me-3"
            onClick={() => navigate("/events")}
          >
            <i className="bi bi-plus-circle me-1"></i> Add Event
          </button>
          <button className="btn uniform-btn btn-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
