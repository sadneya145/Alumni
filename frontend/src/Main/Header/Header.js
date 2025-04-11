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
          <Link to="/home">
            <img
              src="https://vesit.ves.ac.in/navbar2024nobackground.png"
              alt="VES Logo"
              style={{cursor: 'pointer'}}
            />
          </Link>
        </div>

        {user && (
          <div className="user-actions">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`}
              alt="User Avatar"
              className="user-avatar"
            />
            <span className="user-name">{user.displayName || user.email}</span>
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
          <li>Noticeboard</li>
          <li>News & Stories</li>
          <li><a href="/home/events">Events</a></li>
          <li><a href="/home/search-people">Batchmates</a></li>
          <li>Find Alumni ▾</li>
          <li>Careers ▾</li>
          <li>Mentorship</li>
          <li>Fund Raising</li>
          <li>Groups</li>
          <li><a href="/home/discussionPage">Discussions</a></li>
          <li><a href="/home">About</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
