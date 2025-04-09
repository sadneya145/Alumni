import React, {useEffect, useState} from 'react';
import './Header.css';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import { Link } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const getInitials = name => {
    if (!name) return '';
    const names = name.split(' ');
    return names
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

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
            {user.photoURL ? (
              <img
                src="https://img.icons8.com/?size=100&id=xXjlE05o3dcg&format=png&color=000000"
                alt="User Avatar"
                className="user-avatar"
              />
            ) : (
              <div
                className="user-initial"
                style={{backgroundColor: '#e91e63'}}
              >
                {getInitials(user.displayName || user.email)}
              </div>
            )}
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
          <li>
            <a href="/home/events">Events </a>
          </li>
          <li>
            <a href="/home/search-people">Batchmates </a>
          </li>
          <li>Find Alumni ▾</li>
          <li>Careers ▾</li>
          <li>Mentorship</li>
          <li>Fund Raising</li>
          <li>Groups</li>
          <li>
            <a href="/home/discussionPage">Discussions </a>
          </li>
          <li>
            <a href="/home">About </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
