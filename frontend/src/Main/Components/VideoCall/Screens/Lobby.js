import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../Context/SocketProvider';
import Header from '../../../Header/Header';
import Footer from '../../../Footer/Footer';
import './Lobby.css';

const LobbyScreen = () => {
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');

  const socket = useSocket();
  const navigate = useNavigate();

  // Get stored email from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('email');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleSubmitForm = useCallback(
    e => {
      e.preventDefault();
      if (socket) {  // Add null check here
        socket.emit('room:join', { email, room });
      }
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    data => {
      const { email, room } = data;
      navigate(`/video_call/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (socket) {  // Add null check here
      socket.on('room:join', handleJoinRoom);
      return () => {
        socket.off('room:join', handleJoinRoom);
      };
    }
  }, [socket, handleJoinRoom]);

  return (
    <>
      <Header />
      <div className="lobby-content">
        <div className="lobby-form-container">
          <h2>Join a Video Call Room</h2>
          <form onSubmit={handleSubmitForm}>
            <div className="form-group">
              <label htmlFor="email">Email ID</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="room">Room Number</label>
              <input
                type="text"
                id="room"
                value={room}
                onChange={e => setRoom(e.target.value)}
                placeholder="Enter room code"
                required
              />
            </div>
            
            <button type="submit" className="join-button">Join Room</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LobbyScreen;