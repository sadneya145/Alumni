import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PeopleProfile.css';
import ChatBox from './ChatBox'; // Import the ChatBox component
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';

const Profile = () => {
  const { email } = useParams();
  const [person, setPerson] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Track chatbox visibility

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://api.sheetbest.com/sheets/6794bafd-366b-4b94-a42f-ac3629755813`
        );
        const userProfile = res.data.find(user => user.email === email);
        setPerson(userProfile);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();

    const stored = localStorage.getItem(`follow_${email}`);
    if (stored === 'true') setIsFollowing(true);
  }, [email]);

  const handleFollow = () => {
    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    localStorage.setItem(`follow_${email}`, newFollowState);
  };

  const handleChatOpen = () => {
    setIsChatOpen(true); // Open the chat popup
  };

  const handleChatClose = () => {
    setIsChatOpen(false); // Close the chat popup
  };

  if (!person) {
    return <div className="loading">Loading...</div>;
  }

  const firstName = person.name.split(' ')[0];

  return (
    <>
    <Header/>
    <div className="linkedin-profile">
      {/* Banner */}
      <div className="banner" />

      {/* Profile Header */}
      <div className="profile-info-container">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}`}
          alt={person.name}
          className="avatar"
        />
        <div className="info-text">
          <h1>{person.name} {person.surname}</h1>
          <p className="headline">{person.branch} • Class of {person.year}</p>
          <p className="location">Mumbai, India</p>
          <p className="email"><a href={`mailto:${person.email}`}>{person.email}</a></p>
          <p className="phone">📞 {person.number}</p>
        </div>
        <div className="profile-actions">
          <button onClick={handleChatOpen}>Message</button>
          <button onClick={handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Body Sections */}
      <div className="profile-sections">
        <section>
          <h2>About</h2>
          <p>{person.about || "This user hasn't added an about section yet."}</p>
        </section>

        <section>
          <h2>Education</h2>
          <p>{person.branch}, VESIT - Class of {person.year}</p>
        </section>

        <section>
          <h2>Posts</h2>
          <p>No posts available yet.</p>
        </section>
      </div>

      {/* ChatBox Popup */}
      {isChatOpen && (
        <ChatBox 
          receiverEmail={person.email} 
          receiverName={person.name} 
          onClose={handleChatClose} // Close the chatbox when needed
        />
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Profile;
