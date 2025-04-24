import React, { useState, useEffect } from "react";
import ChatContainer from "../../chatbot/ChatContainer.jsx";
import LanguageSelector from "../../chatbot/LanguageSelector.jsx";
import "./MultilingualChatBot.css";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", icon: "🇬🇧" },
  { code: "ta", name: "Tamil", icon: "🇮🇳" },
  { code: "hi", name: "Hindi", icon: "🇮🇳" },
];

function MultilingualChatBot() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [messages, setMessages] = useState([]);

  const getWelcomeMessage = async (language) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/welcome?language=${language}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.full_message;
    } catch (error) {
      console.error("Error fetching welcome message:", error);
      return "Hello! How can I help you?";
    }
  };

  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    // Clear existing messages when language changes
    setMessages([]);

    // Show welcome message in the new language
    const welcomeMessage = await getWelcomeMessage(lang);
    const botMessage = {
      id: Date.now(),
      text: welcomeMessage,
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    setMessages([botMessage]);
  };

  const handleNewMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Show initial welcome message
  useEffect(() => {
    const initializeChat = async () => {
      const welcomeMessage = await getWelcomeMessage(selectedLanguage);
      const botMessage = {
        id: Date.now(),
        text: welcomeMessage,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([botMessage]);
    };

    initializeChat();
  }, []);

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-header">
        <h3>Farming Assistant Chatbot</h3>
      </div>

      <div className="language-selector-container">
        <LanguageSelector
          languages={SUPPORTED_LANGUAGES}
          selected={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <div className="chat-container-wrapper">
        <ChatContainer
          messages={messages}
          onNewMessage={handleNewMessage}
          language={selectedLanguage}
        />
      </div>
    </div>
  );
}

export default MultilingualChatBot;
