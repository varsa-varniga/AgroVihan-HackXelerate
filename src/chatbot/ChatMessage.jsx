// src/components/ChatMessage.js
import React from "react";

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.sender}`}>
      <div className="message-bubble">
        <p>{message.text}</p>
        <span className="timestamp">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
