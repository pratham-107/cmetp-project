import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/events/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Event approved!");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to approve event");
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    if (!token) return navigate("/admin-login");
    fetchEvents();
  }, []);

  const pendingEvents = events.filter((event) => !event.isApproved);
  const approvedEvents = events.filter((event) => event.isApproved);

  const renderEventCard = (event, showApprove = false) => (
    <div className="col-md-4 mb-4" key={event._id} data-aos="fade-up">
      <div className="card h-100 shadow-sm admin-event-card">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="card-img-top"
            style={{ maxHeight: "180px", objectFit: "cover" }}
          />
        )}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{event.title}</h5>
          <p className="card-text flex-grow-1">{event.description}</p>
          <p>
            <strong>📍</strong> {event.location}
          </p>
          <p>
            <strong>📅</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-muted small">
            Created by: {event.createdBy?.name || "Unknown"}
          </p>

          {event.isApproved && (
            <span className="badge bg-success mb-2">Approved</span>
          )}

          {showApprove && (
            <button
              onClick={() => handleApprove(event._id)}
              className="btn btn-outline-success btn-sm mb-2"
              title="Approve Event"
              aria-label={`Approve event titled ${event.title}`}
            >
              ✅ Approve
            </button>
          )}

          <button
            onClick={() => handleDelete(event._id)}
            className="btn btn-outline-danger btn-sm mt-auto"
            title="Delete Event"
            aria-label={`Delete event titled ${event.title}`}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/");
  };

  return (
    <div className="admin-dashboard container mt-4">
      <h2 className="mb-4">
        📋 Admin Dashboard
        <button
          className="btn btn-secondary float-end"
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </h2>

      <h4 className="mb-3">⏳ Pending Events</h4>
      <div className="row">
        {loading ? (
          <p>Loading events...</p>
        ) : pendingEvents.length > 0 ? (
          pendingEvents.map((event) => renderEventCard(event, true))
        ) : (
          <p className="text-muted">No pending events</p>
        )}
      </div>

      <h4 className="mt-5 mb-3">✅ Approved Events</h4>
      <div className="row">
        {loading ? (
          <p>Loading events...</p>
        ) : approvedEvents.length > 0 ? (
          approvedEvents.map((event) => renderEventCard(event))
        ) : (
          <p className="text-muted">No approved events</p>
        )}
      </div>
    </div>
  );
}
