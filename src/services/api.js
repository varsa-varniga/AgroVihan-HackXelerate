// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export const sendMessage = async (text, language) => {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text, language: language }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};