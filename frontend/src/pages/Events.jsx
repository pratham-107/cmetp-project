import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import EventCard from "../components/EventCard";
import "../styles/Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUserId = JSON.parse(atob(token?.split(".")[1] || "{}")).id;

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      alert("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append("upload_preset", "cmpt_unsigned");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbsomxy7s/image/upload",
        cloudFormData
      );
      setFormData((prev) => ({ ...prev, image: res.data.secure_url }));
    } catch (err) {
      console.log("Cloudinary upload error:", err.response || err);
      alert("Image upload failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/events", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        image: "",
      });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating event");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="events-container container mt-4">
      <h2 className="text-center mb-4" data-aos="fade-down">
        Campus Events
      </h2>

      <form
        onSubmit={handleCreate}
        className="event-form mb-5 p-4 shadow-sm rounded"
        data-aos="zoom-in"
      >
        <h5 className="mb-3 text-primary fw-semibold">Create New Event</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="2"
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
          </div>
          {formData.image && (
            <div className="col-12">
              <img
                src={formData.image}
                alt="Uploaded preview"
                className="img-fluid"
                style={{ borderRadius: "8px", maxHeight: "200px" }}
              />
            </div>
          )}
        </div>
        <div className="text-end mt-3">
          <button className="btn btn-success px-4">Add Event</button>
        </div>
      </form>

      <div className="row event-list">
        {events.map((event) => (
          <div className="col-md-4 mb-4" key={event._id} data-aos="fade-up">
            <EventCard
              event={event}
              onDelete={handleDelete}
              currentUserId={currentUserId}
            />
          </div>
        ))}
      </div>

      <div className="floating-buttons">
        <button
          className="btn btn-primary mb-2"
          onClick={() => navigate("/dashboard")}
        >
          📊 Dashboard
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>
    </div>
  );
}
