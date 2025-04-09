import React from 'react';
import './Connections.css';

const connections = [
  {
    id: 1,
    name: 'Aditi Sharma',
    role: 'Software Engineer atGoogle',
    location: 'Seattle, WA',
    mutuals: 5,
    avatar: 'https://i.pravatar.cc/60?img=1'
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Data Scientist atMicrosoft',
    location: 'New York, NY',
    mutuals: 3,
    avatar: 'https://i.pravatar.cc/60?img=2'
  },
  {
    id: 3,
    name: 'Sneha Kapoor',
    role: 'Product Manager atAmazon',
    location: 'Chicago, IL',
    mutuals: 2,
    avatar: 'https://i.pravatar.cc/60?img=3'
  }
];

const Connections = () => {
  return (
    <div className="connections-container">
      <h3>Connections</h3>
      <hr />
      {connections.map((user) => (
        <div key={user.id} className="connection-card">
          <img src={user.avatar} alt={user.name} className="conn-avatar" />
          <div className="conn-details">
            <strong>{user.name}</strong>
            <p>{user.role}</p>
            <p><i className="fas fa-map-marker-alt"></i> {user.location}</p>
            <p><i className="fas fa-users"></i> {user.mutuals} mutuals</p>
            <button className="conn-message-btn"><i className="fas fa-comment"></i> Message</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Connections;
