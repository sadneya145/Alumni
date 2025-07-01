import React, {useEffect, useState} from 'react';
import './Header.css';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {Link} from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <header className="header">
      <div className="top-bar">
        <div className="logo">
          <Link to="/">
            <img
              src="https://vesit.ves.ac.in/navbar2024nobackground.png"
              alt="VES Logo"
              style={{cursor: 'pointer'}}
            />
          </Link>
        </div>

        {user && (
          <div className="user-actions">
            <Link to="/home/profile" className="profile-link">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                  user.displayName || user.email
                }`}
                alt="User Avatar"
                className="user-avatar"
              />
              <span className="user-name">
                {user.displayName || user.email}
              </span>
            </Link>
            <div className="icons">
              <i className="fas fa-bell"></i>
              <i className="fas fa-comment-alt"></i>
              <i className="fas fa-ellipsis-v"></i>
            </div>
          </div>
        )}
      </div>

      <nav className="nav-bar">
        <ul>
          <li>
            <a href="/home/announcements">Announcements</a>
          </li>
          <li>
            <a href="/home/stories">Alumni Stories</a>
          </li>
          <li>
            <a href="/home/events">Reunions & Events</a>
          </li>
          <li>
            <a href="/home/search-people">Find Classmates</a>
          </li>
          <li>
            <a href="/home/alumni-directory">Alumni Directory ▾</a>
          </li>
          <li>
            <a href="/home/career-support/profiles">Career Support ▾</a>
          </li>
          <li>
            <a href="/home/mentorship">Mentorship Program</a>
          </li>
          <li>
            <a href="/home/fundraising">Fund Raising</a>
          </li>
          <li>
            <a href="/messages">Alumni Groups</a>
          </li>
          <li>
            <a href="/video_call">Live Connect</a>
          </li>
          <li>
            <a href="/home/career-support/jobboard">Job Opportunities</a>
          </li>
          <li>
            <a href="/home/discussionPage">Forum Discussions</a>
          </li>
          <li>
            <a href="/">About Our Network</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
