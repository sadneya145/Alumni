import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventParticipation.css';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';

const EventParticipation = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleFilter = type => setFilter(type);
  const handleEnroll = event => setSelectedEvent(event);
  const handleFormChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    alert(`Enrolled in ${selectedEvent.title}`);

    // 📄 Generate PDF pass
    const doc = new jsPDF();
    doc.text('Event Participation Pass', 20, 20);
    doc.text(`Event: ${selectedEvent.title}`, 20, 30);
    doc.text(`Name: ${formData.name}`, 20, 40);
    doc.text(`Email: ${formData.email}`, 20, 50);
    doc.text(`Phone: ${formData.phone}`, 20, 60);

    const qrCanvas = document.getElementById('userEventQR');
    if (qrCanvas) {
      const imgData = qrCanvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, 70, 50, 50);
    }

    doc.save(`${formData.name}_event_pass.pdf`);

    setFormData({ name: '', email: '', phone: '' });
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    if (filter === 'past') return eventDate < today;
    if (filter === 'upcoming') return eventDate >= today;
    return true;
  });

  const categoryMap = {
    'All Events': 'all',
    'Past Events': 'past',
    'Upcoming Events': 'upcoming',
    'Attended by Me': 'attended',
  };

  const handleCopy = link => {
    navigator.clipboard.writeText(link);
    alert('Meeting link copied!');
  };

  const downloadQR = (canvasId, title) => {
    const canvas = document.getElementById(canvasId);
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${title}_qr.png`;
    downloadLink.click();
  };

  const handleWhatsAppShare = (event) => {
    const message = `Join me at ${event.title} on ${event.date}! 🎉\n\nEvent Link: ${event.meetingLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Header />

      <div className="event-page-container">
        <div className="topbar-events">
          {Object.keys(categoryMap).map(category => {
            const key = categoryMap[category];
            const isDisabled = key === 'attended';
            return (
              <button
                key={key}
                className={`category-chip ${filter === key ? 'active' : ''} ${
                  isDisabled ? 'disabled' : ''
                }`}
                onClick={() => !isDisabled && handleFilter(key)}
                disabled={isDisabled}
              >
                {category}
              </button>
            );
          })}
        </div>

        <main className="event-content">
          {filteredEvents.length === 0 ? (
            <p>No events to display.</p>
          ) : (
            filteredEvents.map((event, index) => (
              <div className="event-card" key={event._id}>
                <img
                  src={event.imageUrl || 'https://via.placeholder.com/150'}
                  alt={event.title}
                />
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Location:</strong> {event.location || 'VES Campus'}</p>
                  <span className={`badge ${new Date(event.date) < new Date() ? 'past' : 'upcoming'}`}>
                    {new Date(event.date) < new Date() ? 'Past Event' : 'Upcoming'}
                  </span>
                  <button onClick={() => handleEnroll(event)}>
                    {new Date(event.date) < new Date() ? 'View' : 'Participate'}
                  </button>

                  <p>
                    <a href={event.meetingLink} target="_blank" rel="noopener noreferrer">Join Event</a>
                  </p>

                  <div className="qr-small-share">
                    <QRCodeCanvas
                      value={event.qrCode || event.meetingLink}
                      size={80}
                      id={`qrCode-${index}`}
                    />
                    <div className="qr-actions">
                      <button onClick={() => downloadQR(`qrCode-${index}`, event.title)}>⬇️ Save</button>
                      <button onClick={() => handleWhatsAppShare(event)}>📱 WhatsApp</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>

        {selectedEvent && (
          <div className="form-overlay">
            <div className="form-popup">
              <h3>Enroll for {selectedEvent.title}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="VES Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
                {/* Hidden QR for PDF pass */}
                <div style={{ display: 'none' }}>
                  <QRCodeCanvas
                    id="userEventQR"
                    value={selectedEvent.meetingLink}
                    size={150}
                  />
                </div>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setSelectedEvent(null)}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default EventParticipation;
