import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    socket.emit('userMessage', input);
    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');
  };

  useEffect(() => {
    socket.on('botMessage', (msg) => {
      setMessages((prev) => [...prev, { type: 'bot', text: msg }]);
    });
  }, []);

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.type}>
            {msg.text}
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;
