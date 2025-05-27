import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function EventCalendar({ events }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsForDate, setEventsForDate] = useState([]);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      );
    });
    setEventsForDate(filtered);
  }, [selectedDate, events]);

  const formattedDate = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-3" style={{ maxWidth: 400, margin: "auto" }}>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="shadow-sm rounded"
      />

      <h5 className="mt-4 mb-3 text-center">Events on {formattedDate}:</h5>

      {eventsForDate.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          No events on this day.
        </p>
      ) : (
        <ul className="list-group">
          {eventsForDate.map((event) => (
            <li key={event._id} className="list-group-item">
              {event.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
