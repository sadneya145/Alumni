import React, {useState} from 'react';
import axios from 'axios';
import './Chatbot.css'
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatText = text => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Convert **bold** to <b>bold</b>
      .replace(/\n/g, '<br>') // Preserve line breaks
      .replace(/• /g, '🔹 ') // Convert bullet points to visual markers
      .replace(/\d+\.\s/g, match => `<br>${match}`); // Ensure numbered lists are well formatted
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {text: input, sender: 'user'};
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [{role: 'user', parts: [{text: input}]}],
        },
        {
          headers: {'Content-Type': 'application/json'},
          params: {key: 'AIzaSyDUIN4oveLZyR-CsMHr-H_K9_tC2CfmLws'},
        }
      );

      let botReply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      botReply = formatText(botReply);

      const botMessage = {text: botReply, sender: 'bot'};
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [
        ...prev,
        {text: 'Oops! Something went wrong.', sender: 'bot'},
      ]);
    }

    setInput('');
  };

  return (
    <>
      <button onClick={toggleChat} className="chat-button">
        💬 Chat
      </button>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <span>💬 Chatbot</span>
            <button onClick={toggleChat} className="chat-close-button">
              ✖
            </button>
          </div>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === 'user' ? 'user-message' : 'bot-message'
                }
                dangerouslySetInnerHTML={{__html: msg.text}}
              />
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="chat-input"
            />
            <button onClick={sendMessage} className="chat-send-button">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
