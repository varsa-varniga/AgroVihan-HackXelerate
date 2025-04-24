// src/components/ChatInput.js
import React, { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your question..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatInput;
