import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>About VES Connect</h3>
          <p>
            A platform to connect students, alumni, and organizations. Stay
            updated with news, events, and career opportunities.
          </p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <a href="/home">Home</a>
          <a href="/events">Events</a>
          <a href="/careers">Careers</a>
          <a href="/about">About Us</a>
        </div>

        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>Email: connect@ves.ac.in</p>
          <p>Phone: +91 12345 67890</p>
          <p>Address: VES Campus, Chembur, Mumbai</p>
        </div>

        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/128/733/733579.png" alt="Twitter" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/128/145/145807.png" alt="LinkedIn" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VES Connect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
