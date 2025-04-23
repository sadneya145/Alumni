import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Message.css';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:4000');

const Message = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientsTotal, setClientsTotal] = useState(0);
  const [typingUser, setTypingUser] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const messageContainerRef = useRef(null);

  const roomOptions = [
    'Placement Discussions',
    'General Foreign Studies',
    "Master's in Science (MS)",
    "Master's in Business Analytics (MBA)",
    'GATE Examination',
  ];

  useEffect(() => {
    socket.on('clients-total', count => setClientsTotal(count));
    
    socket.on('chat-message', data => {
      setMessages(prev => [...prev, { ...data, read: false }]);
      // Scroll to bottom on new message
      setTimeout(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      }, 100);
    });
    
    socket.on('chat-history', history => setMessages(history));
    
    socket.on('typing', user => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(''), 2000);
    });

    socket.on('message-read', messageId => {
      setMessages(prev =>
        prev.map(msg => (msg.id === messageId ? { ...msg, read: true } : msg))
      );
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('email');
    if (storedName) {
      // Option to auto-populate username from stored email
      if (!username && storedName) {
        const usernameFromEmail = storedName.split('@')[0];
        setUsername(usernameFromEmail);
      }
    }
  }, [username]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll messages container to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const joinRoom = () => {
    if (room.trim() !== '') {
      socket.emit('join-room', room);
    }
  };

  const sendMessage = e => {
    e.preventDefault();
    if (message.trim()) {
      const chatData = { 
        user: username, 
        message, 
        room, 
        timestamp: new Date(),
        id: Date.now().toString()  // Add unique ID for each message
      };
      socket.emit('message', chatData);
      setMessage('');
    }
  };

  let typingTimeout;
  const handleTyping = () => {
    if (room) {
      socket.emit('typing', { username, room });

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit('stopped-typing', room);
      }, 2000);
    }
  };
  
  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
  };

  return (
    <>
    <Header />
    <div className="home-container-m">
      <div className="chat-container-m">
        <h1 className="title">
          Chat Room 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37485 5.27072 7.03255C6.10083 5.69025 7.28825 4.60557 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94695 20.885 8.91565 21 11V11.5Z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </h1>

        {!isLoggedIn ? (
          <div className="login-container-chat">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <button onClick={() => setIsLoggedIn(username.trim() !== '')}>
              Start Chatting
            </button>
          </div>
        ) : (
          <div className="main">
            <div className="name">
              <input
                type="text"
                className="name-input"
                value={username}
                disabled
              />
            </div>

            {/* Room Selection with Dropdown */}
            <div className="room_chat" ref={dropdownRef}>
              <div className="room-input-container">
                <input
                  type="text"
                  placeholder="Enter room name"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                />
                <button
                  className="dropdown-button"
                  onClick={e => {
                    e.stopPropagation();
                    setShowDropdown(prev => !prev);
                  }}
                >
                  ▼
                </button>
              </div>

              {showDropdown && (
                <ul className="dropdown-menu">
                  {roomOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setRoom(option);
                        setShowDropdown(false);
                        // Auto-join room when selected from dropdown
                        setTimeout(() => {
                          socket.emit('join-room', option);
                        }, 100);
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}

              <button onClick={joinRoom}>Join Room</button>
            </div>

            <ul className="message-container" ref={messageContainerRef}>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <li
                    key={index}
                    className={`message ${msg.user === username ? 'right' : 'left'} 
                      ${msg.read ? 'read' : ''}`}
                  >
                    <strong>{msg.user}:</strong> {msg.message}
                    <span className="timestamp">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="empty-messages">No messages yet in this room. Start the conversation!</li>
              )}
            </ul>

            {typingUser && (
              <p className="typing">{typingUser} is typing...</p>
            )}

            <form className="message-form" onSubmit={sendMessage}>
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleTyping}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}

        <h3 className="clients-total">Online Users: {clientsTotal}</h3>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Message;