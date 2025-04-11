import React, { useState } from 'react';
import './ChatBox.css';

const ChatBox = ({ receiverEmail, receiverName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (text.trim()) {
      setMessages([...messages, { sender: "You", content: text, type: 'sent' }]);
      setText('');
    }
  };

  return (
    <div className="chatbox-popup">
      <div className="chatbox">
        <div className="chatbox-header">
          <span>Chat with {receiverName || "user"}</span>
          <button onClick={onClose}>×</button>
        </div>
        <div className="chatbox-messages">
          {messages.map((msg, i) => (
            <p key={i} className={msg.type}>{msg.sender}: {msg.content}</p>
          ))}
        </div>
        <div className="chatbox-input">
          <input 
            type="text" 
            value={text}
            placeholder="Type a message..." 
            onChange={(e) => setText(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
