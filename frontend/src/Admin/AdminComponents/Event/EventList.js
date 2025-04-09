import React, { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import './EventList.css';  // Import the CSS for styling

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetching the events from the backend
    axios.get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events", err));
  }, []);

  return (
    <div className="event-list-container">
      <h2>Event List</h2>
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        events.map((event) => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {event.date} | Time: {event.time}</p>
            <p><a href={event.meetingLink} target="_blank" rel="noopener noreferrer">Join Event</a></p>
            <div className="qr-code-container">
              <QRCodeCanvas value={event.qrCode} size={150} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;
