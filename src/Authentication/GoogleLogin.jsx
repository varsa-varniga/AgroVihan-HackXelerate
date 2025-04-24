import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "firebaseConfig";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";

const GoogleLogin = ({ onLogin, userRole }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);

      if (user && onLogin) {
        onLogin(user.email, userRole);
      }

      // Redirect based on role
      navigate(
        userRole === "farmer"
          ? "/dashboard/climate-forecast"
          : "/dashboard/home"
      );
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("Popup was closed by the user.");
      } else {
        console.error("Login Failed:", error);
        alert("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      fullWidth
      disabled={loading}
      variant="outlined"
      startIcon={<GoogleIcon />}
      sx={{
        textTransform: "none",
        borderColor: "#ccc",
        color: "#333",
        "&:hover": {
          borderColor: "#888",
          bgcolor: "#f9f9f9",
        },
      }}
    >
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleLogin;
