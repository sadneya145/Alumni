import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Karan Singh',
    batch: '2020',
    degree: 'Computer Science',
    current: 'Software Engineer at Tech Corp',
    location: 'Mumbai, India',
    email: 'karan.singh@gmail.com',
    phone: '+91 98765 43210',
    about: 'Passionate software engineer with expertise in web development and machine learning. Proud VES alumnus who enjoys contributing back to the community through mentorship and networking.',
    interests: ['Technology', 'Teaching', 'Entrepreneurship', 'Photography'],
    achievements: [
      'Workshop Expert: Attended 10+ technical workshops',
      'Intern Extraordinaire: Completed 3 internships',
      'Community Leader: Organized 5 college events'
    ],
    activities: [
      {
        id: 1,
        type: 'workshop',
        title: 'AI/ML Workshop',
        date: '2/15/2025',
        points: 50,
        icon: 'book'
      },
      {
        id: 2,
        type: 'internship',
        title: 'Software Development Intern at Tech Corp',
        date: '1/10/2025',
        points: 100,
        icon: 'briefcase'
      },
      {
        id: 3,
        type: 'project',
        title: 'College App Development',
        date: '12/20/2024',
        points: 75,
        icon: 'star'
      }
    ]
  });

  const [stats, setStats] = useState({
    events: 15,
    internships: 3,
    projects: 8,
    connections: 145,
    totalPoints: 171
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // In a real application, you would save the data to a backend
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };

  // Icon mapping
  const getIconClass = (type) => {
    switch(type) {
      case 'workshop': return 'book-icon';
      case 'internship': return 'briefcase-icon';
      case 'project': return 'star-icon';
      case 'connection': return 'users-icon';
      default: return 'calendar-icon';
    }
  };

  return (
    <div className="profile-wrapper">
      <Header />

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-container">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="profile-image" />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{profileData.name}</h1>
            <div className="profile-details">
              <span className="profile-label">Alumni</span>
              <span className="profile-dot">•</span>
              <span className="profile-label">{profileData.degree}</span>
              <span className="profile-dot">•</span>
              <span className="profile-label">Batch of {profileData.batch}</span>
            </div>
          </div>
          <div className="profile-points">
            <div className="points-box">
              <span className="points-value">{stats.totalPoints}</span>
              <span className="points-label">Total Points</span>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-box">
            <div className="stat-icon book-icon"></div>
            <div className="stat-value">{stats.events}</div>
            <div className="stat-label">Events</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon briefcase-icon"></div>
            <div className="stat-value">{stats.internships}</div>
            <div className="stat-label">Internships</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon shield-icon"></div>
            <div className="stat-value">{stats.projects}</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon users-icon"></div>
            <div className="stat-value">{stats.connections}</div>
            <div className="stat-label">Connections</div>
          </div>
        </div>

        {/* Achievements Section */}
        <section className="profile-section achievements-section">
          <h2 className="section-title">Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement-box">
              <div className="achievement-icon book-icon"></div>
              <div className="achievement-content">
                <h3>Workshop Expert</h3>
                <p>Attended 10+ technical workshops</p>
              </div>
            </div>
            <div className="achievement-box">
              <div className="achievement-icon briefcase-icon"></div>
              <div className="achievement-content">
                <h3>Intern Extraordinaire</h3>
                <p>Completed 3 internships</p>
              </div>
            </div>
            <div className="achievement-box">
              <div className="achievement-icon users-icon"></div>
              <div className="achievement-content">
                <h3>Community Leader</h3>
                <p>Organized 5 college events</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="profile-section activity-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {profileData.activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${getIconClass(activity.type)}`}></div>
                <div className="activity-content">
                  <h3>{activity.title}</h3>
                  <p>{activity.date}</p>
                </div>
                <div className="activity-points">
                  <span className="points-badge">{activity.points} points</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;