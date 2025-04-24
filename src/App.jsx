<<<<<<< HEAD
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Auth pages
import GoogleLogin from "./Authentication/GoogleLogin.jsx";
import Login from "./Authentication/Login.jsx";
import "./App.css";

// Public pages
import AboutUs from "./pages/AboutUs.jsx";
import HeroPage from "./pages/Heropage.jsx";
import Welcome from "./pages/Welcome.jsx";
import Climate from "./pages/Climate.jsx";
import Disease from "./pages/Disease.jsx";
import Fertilizer from "./pages/Fertilizer.jsx";
import Carbon from "./pages/Carbon_credit.jsx";
import Chat from "./pages/Chat.jsx";
import Hubs from "./pages/Hubs.jsx";

import TaskManagement from './pages/TaskManagement.jsx';

// Dashboard (Protected)
import Sidebar from "./pages/Sidebar.jsx";
import DashboardHome from "./pages/sidebar/DashboardHome.jsx";

// Common layout
import Layout from './Components/Layout.jsx';
import Suggestions from './pages/Suggestions.jsx';

// Floating chatbot
import FloatingChatbot from "./FloatingChatbot.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    const storedRole = localStorage.getItem("userRole");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
      setUserRole(storedRole);
    }
  }, []);

  const handleLogin = (email, role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
    if (email) {
      localStorage.setItem("userEmail", email);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
  };

  return (
    <BrowserRouter>
      {/* Floating Chatbot is available on all pages */}
      <FloatingChatbot />

      <Routes>
        {/* Layout for public pages (with Navbar/Footer) */}
        <Route
          element={<Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        >
          <Route path="/" element={<HeroPage />} />
          <Route path="/features" element={
            <>
            <Welcome/>
            <Climate/>
            <Disease/>
            <Fertilizer/>
            <Carbon/>
            <Chat/>
            <Hubs/>
            </>
          }/>
          <Route/>

          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/google-login" element={<GoogleLogin onLogin={handleLogin} />} />

          {/* Protected Suggestions + TaskManagement for farmers */}
          <Route
            path="/suggestions"
            element={
              isLoggedIn && userRole === "farmer" ? (
                <>
                  <Suggestions />
                  <TaskManagement />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Route>

        {/* Protected route for farmers */}
        <Route
          path="/dashboard/*"
          element={
            isLoggedIn && userRole === "farmer" ? (
              <Sidebar
                onLogout={handleLogout}
                userEmail={
                  localStorage.getItem("userEmail") || "user@example.com"
                }
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Protected route for regular users */}
        <Route
          path="/dashboard/home"
          element={
            isLoggedIn && userRole === "user" ? (
              <DashboardHome
                onLogout={handleLogout}
                userEmail={
                  localStorage.getItem("userEmail") || "user@example.com"
                }
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 
>>>>>>> 8303d73ae2937936d07fb964fdfaad0a8c6b5c5e
