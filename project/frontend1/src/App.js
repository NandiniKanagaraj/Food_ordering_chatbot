
import logo from 'D:\\7 sem\\7 sem\\FSD\\project\\frontend1\\src\\logo.svg';
import 'D:\\7 sem\\7 sem\\FSD\\project\\frontend1\\src\\App.css';  
import React, { useState } from "react";
import $ from "jquery";

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSend = () => {
    if (userInput.trim()) {
      const userMessage = { sender: "user", text: userInput };
      setMessages([...messages, userMessage]); // Add user message to chat
      setUserInput(""); // Clear input field

      // Send user message to the backend using jQuery AJAX
      $.ajax({
        url: "http://localhost:5000/api/conversation", // Backend API endpoint
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ text: userInput }),
        success: (response) => {
          // Process and add bot responses to chat
          const botMessages = response.messages.map((msg) => ({
            sender: "bot",
            text: msg,
          }));
          setMessages((prevMessages) => [...prevMessages, ...botMessages]);
        },
        error: (error) => {
          console.error("Error fetching bot response:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: "Sorry, something went wrong. Please try again later." },
          ]);
        },
      });
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <img src="https://via.placeholder.com/40" alt="Profile" />
        <h1>FoodBot</h1>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Chat Footer */}
      <div className="chat-footer">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>⮞</button>
      </div>
    </div>
  );
}

export default App;
