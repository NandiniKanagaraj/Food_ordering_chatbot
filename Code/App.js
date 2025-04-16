import logo from 'C:\\Users\\Devansh\\Downloads\\project\\Food_ordering_chatbot\\project\\frontend1\\src\\logo.svg';
import 'C:\\Users\\Devansh\\Downloads\\project\\Food_ordering_chatbot\\project\\frontend1\\src\\App.css';  
import React, { useState } from "react";
import $ from "jquery";

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [ajaxCalls, setAjaxCalls] = useState([]);

  const handleSend = () => {
    if (userInput.trim()) {
      const userMessage = { sender: "user", text: userInput };
      setMessages([...messages, userMessage]);
      setUserInput("");

      const ajaxDetails = {
        url: "http://localhost:5000/api/conversation",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ text: userInput }),
      };

      // Store the AJAX call details
      setAjaxCalls([...ajaxCalls, ajaxDetails]);

      // Send user message to the backend using jQuery AJAX
      $.ajax({
        ...ajaxDetails,
        success: (response) => {
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
      <div className="chat-header">
        <img src="https://via.placeholder.com/40" alt="Profile" />
        <h1>FoodBot</h1>
      </div>

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

      <div className="chat-footer">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>⮞</button>
      </div>

      {/* AJAX Call Details */}
      <AjaxDetails ajaxCalls={ajaxCalls} />
    </div>
  );
}

// Component to render AJAX call details
function AjaxDetails({ ajaxCalls }) {
  return (
    <div className="ajax-details">
      <h2>AJAX Call Details</h2>
      {ajaxCalls.map((call, index) => (
        <div key={index}>
          <p><strong>URL:</strong> {call.url}</p>
          <p><strong>Method:</strong> {call.method}</p>
          <p><strong>Content-Type:</strong> {call.contentType}</p>
          <p><strong>Data:</strong> {call.data}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
