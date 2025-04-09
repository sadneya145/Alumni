import React, { useState } from "react";
import axios from "axios";
import './AddEvent.css';

const AddEvent = () => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/events", event);
      alert(res.data.message);
      setEvent({ title: "", description: "", date: "", time: "" });
    } catch (error) {
      console.error("Error creating event", error);
    }
  };

  return (
    <div className="add-event-container">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Event Title" value={event.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Event Description" value={event.description} onChange={handleChange} required />
        <input type="date" name="date" value={event.date} onChange={handleChange} required />
        <input type="time" name="time" value={event.time} onChange={handleChange} required />
        <button type="submit" className="eventsubmitbutton">Create Event</button>
      </form>
    </div>
  );
};

export default AddEvent;
