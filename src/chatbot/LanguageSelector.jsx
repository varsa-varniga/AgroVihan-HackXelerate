// src/components/LanguageSelector.js
import React from "react";

const LanguageSelector = ({
  languages,
  selectedLanguage,
  onLanguageChange, // Changed to match the prop being passed
}) => {
  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`language-btn ${
            selectedLanguage === lang.code ? "active" : ""
          }`}
          onClick={() => onLanguageChange(lang.code)} // Updated function call
        >
          {lang.icon} {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
