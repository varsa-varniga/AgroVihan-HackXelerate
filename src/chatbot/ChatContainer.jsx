// src/components/ChatContainer.js
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import { sendMessage } from "../services/api";

const ChatContainer = ({ messages, language, onNewMessage }) => {
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    onNewMessage(userMessage);

    try {
      // Send message to backend
      const response = await sendMessage(text, language);

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        text: response.answer,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      onNewMessage(botMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      onNewMessage({
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={chatEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;
