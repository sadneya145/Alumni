import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import "./CalendarStyle.css"; // External CSS

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = data.map((event) => ({
          id: event._id, // Assuming MongoDB uses _id
          title: event.title,
          start: event.date,
          extendedProps: {
            description: event.description,
            url: event.meetingLink,
          },
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleDateClick = (selected) => {
    const title = prompt("Enter event title:");
    if (title) {
      const newEvent = {
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        allDay: selected.allDay,
      };
      setEvents([...events, newEvent]); // Add event locally
    }
  };

  const handleEventClick = (selected) => {
    if (window.confirm(`Delete event: '${selected.event.title}'?`)) {
      setEvents(events.filter((event) => event.id !== selected.event.id)); // Remove from UI
    }
  };

  return (
    <Box className="calendar-container">
      <Typography variant="h4" className="calendar-title">
        📅 Event Calendar
      </Typography>

      <Box display="flex" justifyContent="space-between">
        {/* Events List Sidebar */}
        <Box className="events-list">
          <Typography variant="h5">Events</Typography>
          <List>
            {events.map((event) => (
              <ListItem key={event.id} className="event-item">
                <ListItemText
                  primary={event.title}
                  secondary={formatDate(event.start, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Full Calendar Component */}
        <Box className="calendar-box">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={events}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarComponent;
