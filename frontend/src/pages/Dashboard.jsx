import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import EventCard from "../components/EventCard";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const token = localStorage.getItem("token");
  const currentUserId = JSON.parse(atob(token?.split(".")[1] || "{}")).id;

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events", err);
      }
    };

    fetchEvents();
  }, [token]);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date).toDateString();
    return eventDate === selectedDate.toDateString();
  });

  return (
    <>
      <Navbar onToggleCalendar={toggleCalendar} />

      <div className="container dashboard mt-4">
        <div className="welcome-box p-4 rounded shadow" data-aos="fade-up">
          <h2 className="text-primary">
            <i className="bi bi-person-circle me-2"></i>Welcome Back!
          </h2>
          <p className="text-muted">Here are your upcoming campus events.</p>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={toggleCalendar}
          >
            {showCalendar ? "Hide Calendar" : "Show Calendar"}
          </button>
        </div>

        {showCalendar && (
          <div className="calendar-container my-4" data-aos="fade-down">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="rounded shadow p-3 calendar-box"
            />
          </div>
        )}

        <h4 className="mt-4 mb-3 fw-semibold text-dark">
          {showCalendar ? "Events on Selected Date" : "All Upcoming Events"}
        </h4>

        <div className="row">
          {(showCalendar ? filteredEvents : events).length > 0 ? (
            (showCalendar ? filteredEvents : events).map((event) => (
              <div
                className="col-md-6 col-lg-4 mb-4"
                key={event._id}
                data-aos="fade-up"
              >
                <EventCard event={event} currentUserId={currentUserId} />
              </div>
            ))
          ) : (
            <p className="text-muted mt-4">No events found.</p>
          )}
        </div>
      </div>
    </>
  );
}
