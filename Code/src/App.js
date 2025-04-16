import React, { useState } from "react";
import $ from "jquery";
import "./App.css";
import Cookies from 'js-cookie';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [ajaxCalls, setAjaxCalls] = useState([]);
  const [cookieConsent, setCookieConsent] = useState(Cookies.get('cookieConsent') || '');

  useEffect(() => {
    if (cookieConsent === 'accept' && !Cookies.get('messages')) {
        Cookies.set('messages', JSON.stringify(messages), { expires: 1 });
    }
}, [cookieConsent, messages]);



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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleCookieConsent = (consent) => {
    setCookieConsent(consent);
    Cookies.set('cookieConsent', consent, { expires: 365 });
    if (consent === 'reject') {
        Cookies.remove('messages');
        setMessages([]);
    }
};

const saveChatToCookies = () => {
    if (cookieConsent === 'accept') {
        Cookies.set('messages', JSON.stringify(messages), { expires: 1 });
        alert('Chat saved to cookies!');
    } else {
        alert('Please accept cookies to enable chat saving.');
    }
};

  return (
    <div className="app-container">
      {/* Chat Section */}
      <div className="chat-container">
        <div className="chat-header">
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

        {/* <div className="chat-footer">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>⮞</button>
        </div> */}

<div className="chat-footer">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
            {cookieConsent === '' && (
                <div style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
                    <button onClick={() => handleCookieConsent('accept')}>Accept Cookies</button>
                    <button onClick={() => handleCookieConsent('reject')}>Reject Cookies</button>
                </div>
            )}
            <button style={{ position: 'fixed', bottom: '10px', left: '10px' }} onClick={saveChatToCookies}>
                Save Chat
            </button>
      </div>

      {/* AJAX Call Details Section */}
      <div className="ajax-details-container">
        <AjaxDetails ajaxCalls={ajaxCalls} />
      </div>
    </div>
  );
}

// Component to render AJAX call details
function AjaxDetails({ ajaxCalls }) {
  return (
    <div className="ajax-details">
      <h2>AJAX Call Details</h2>
      <div className="ajax-list">
        {ajaxCalls.map((call, index) => (
          <div key={index} className="ajax-box">
            <p><strong>URL:</strong> {call.url}</p>
            <p><strong>Method:</strong> {call.method}</p>
            <p><strong>Content-Type:</strong> {call.contentType}</p>
            <p><strong>Data:</strong> {call.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;