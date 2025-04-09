import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import React, {useState, useEffect} from 'react';
import './Home.css';

const slides = [
  {
    id: 1,
    title: 'Welcome to VES',
    subtitle: 'Empowering Education for All',
    image:
      'https://images.collegedunia.com/public/college_data/images/campusimage/1662553710campus%20front.jpg?mode=stretch',
  },
  {
    id: 2,
    title: 'Join the Alumni Network',
    subtitle: 'Reconnect. Mentor. Celebrate.',
    image:
      'https://miro.medium.com/v2/resize:fit:1200/1*ZiIQe8GEV-Fk42UbDIbW0A.png',
  },
  {
    id: 3,
    title: 'Campus Life',
    subtitle: 'Explore our vibrant events and achievements',
    image: 'https://vesit.ves.ac.in/storage/mediavideos/1697885519DSC_0445.jpg',
  },
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="home-wrapper">
      <Header />

      <section className="carousel">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${index === current ? 'active' : ''}`}
            style={{backgroundImage: `url(${slide.image})`}}
          >
            <div className="carousel-overlay">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          className="carousel-btn prev"
          onClick={() =>
            setCurrent((current - 1 + slides.length) % slides.length)
          }
        >
          &#10094;
        </button>
        <button
          className="carousel-btn next"
          onClick={() => setCurrent((current + 1) % slides.length)}
        >
          &#10095;
        </button>

        {/* Dots */}
        <div className="carousel-dots">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${current === idx ? 'active' : ''}`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </section>

      {/* Welcome Paragraph */}
      <section className="alumni-portal-section">
        <div className="alumni-text">
          <h2>Welcome to Vivekanand Education Society</h2>
          <p>
            Vivekanand Education Society (VES), founded with the noble vision of
            Shri Hashu Advaniji in 1959, has grown from a modest initiative into
            a leading educational foundation with 26 institutions across Chembur
            and Kurla. VES was built on the belief that quality education must
            reach everyone — including the economically underprivileged — and
            continues to uphold that commitment with pride.
          </p>
          <p>
            Today, the Society supports over 18,000 students annually across
            pre-primary to Ph.D. levels, backed by a community of passionate
            faculty, vibrant student life, and an ever-growing alumni network.
            VES ensures a well-rounded development with its leadership academy,
            sports facilities, vocational centers, and hostel accommodations for
            outstation students.
          </p>
          <p>
            What sets VES apart is its unwavering stand — no management quota,
            no capitation fee, no donations — just pure learning. We take pride
            in nurturing intellects, innovators, and leaders of tomorrow through
            integrity, equity, and excellence in education.
          </p>
          <p>
            As we evolve into a more connected world, this Alumni Portal marks
            the beginning of a new chapter — one that celebrates legacy, fosters
            collaboration, and bridges generations of learners. Whether you're
            reconnecting or mentoring, this space is yours.
          </p>
        </div>
        <div className="alumni-image">
          <img
            src="https://as1.ftcdn.net/v2/jpg/05/38/44/84/1000_F_538448475_Zb7JaTUspCoWSZ98QiVLLBIEeCHhpT0f.jpg"
            alt="VESIT Alumni"
          />
        </div>
      </section>
      <section className="alumni-features">
        <h2>What You Can Do Here</h2>
        <div className="features-grid">
          <div className="feature-box">
            <h3>🏠 Home</h3>
            <p>
              Your personalized dashboard to explore everything at a glance.
            </p>
          </div>
          <div className="feature-box">
            <h3>🔗 Connect</h3>
            <p>Find and reconnect with fellow alumni, faculty, and mentors.</p>
          </div>
          <div className="feature-box">
            <h3>💼 Jobs</h3>
            <p>Access job openings, internships, and career opportunities.</p>
          </div>
          <div className="feature-box">
            <h3>📰 News</h3>
            <p>
              Stay updated with college news, alumni achievements, and more.
            </p>
          </div>
          <div className="feature-box">
            <h3>💰 Fundraising</h3>
            <p>Contribute to meaningful causes and support campus growth.</p>
          </div>
          <div className="feature-box">
            <h3>💬 Messages</h3>
            <p>Exchange messages with your peers and groups.</p>
          </div>
          <div className="feature-box">
            <h3>📡 Join Room</h3>
            <p>Enter discussion rooms and group chats on topics you love.</p>
          </div>
          <div className="feature-box">
            <h3>📅 Events</h3>
            <p>Register for reunions, webinars, workshops, and celebrations.</p>
          </div>
          <div className="feature-box">
            <h3>🔍 Search</h3>
            <p>Quickly look up people, posts, jobs, and more.</p>
          </div>
          <div className="feature-box">
            <h3>👤 User</h3>
            <p>Manage your profile, experiences, and visibility settings.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
