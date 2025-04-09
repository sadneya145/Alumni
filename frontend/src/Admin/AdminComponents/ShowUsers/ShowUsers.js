import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShowUsers.css'; // For custom styling

const ShowUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users') // adjust your backend URL/port
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <div className="show-users-container">
      <h2>👥 Registered Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined On</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="4">No users found.</td></tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShowUsers;
