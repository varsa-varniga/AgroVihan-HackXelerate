import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/Login_Bg.jpg";
import sideImage from "../assets/Login_SideCard.jpg";
import GoogleLogin from "../Authentication/GoogleLogin";
import RoleSelector from "../RoleSelection.jsx";

const SignIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleSelect = (role) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  const handleSignIn = () => {
    if (!userRole) return;

    // Store role and update login status
    onLogin(email, userRole);

    // Redirect based on role
    if (userRole === "farmer") {
      navigate("/dashboard/climate-forecast");
    } else {
      navigate("/dashboard/home"); // DashboardHome component for regular users
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        px: 2,
        overflow: "hidden",
      }}
    >
      {/* Blurred Background Layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px)",
          zIndex: 0,
        }}
      />

      {/* Foreground Content */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            maxWidth: 800,
            borderRadius: 3,
            boxShadow: 6,
            overflow: "hidden",
            bgcolor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Left: Side Image */}
          <Box
            sx={{
              width: "50%",
              backgroundImage: `url(${sideImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Right: Form Card */}
          <Box
            component={Paper}
            elevation={0}
            sx={{
              width: "50%",
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "green",
              color: "white",
            }}
          >
            {!userRole ? (
              <>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  align="center"
                  mb={2}
                >
                  Choose Your Role
                </Typography>
                <Typography align="center" mb={3} sx={{ fontSize: "1.1rem" }}>
                  Select whether you are a farmer or user
                </Typography>
                <RoleSelector onRoleSelect={handleRoleSelect} />
              </>
            ) : (
              <>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  align="center"
                  mb={2}
                >
                  Welcome Back
                </Typography>
                <Typography align="center" mb={3} sx={{ fontSize: "1.1rem" }}>
                  Please sign in to your {userRole} account
                </Typography>

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "#eee" },
                    },
                    "& .MuiInputLabel-root": { color: "white" },
                  }}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "#eee" },
                    },
                    "& .MuiInputLabel-root": { color: "white" },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSignIn}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#ffffff",
                    color: "green",
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "#e0e0e0" },
                    mb: 2,
                  }}
                >
                  Sign In as{" "}
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Button>

                <Divider
                  sx={{
                    my: 2,
                    color: "white",
                    "&::before, &::after": {
                      borderColor: "white",
                    },
                  }}
                >
                  or
                </Divider>

                <GoogleLogin onLogin={onLogin} userRole={userRole} />

                <Typography variant="body2" align="center" mt={3}>
                  Don't have an account?{" "}
                  <Button
                    onClick={() => navigate("/signup")}
                    size="small"
                    sx={{ color: "white", textTransform: "none" }}
                  >
                    Sign Up
                  </Button>
                </Typography>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => setUserRole(null)}
                  sx={{
                    textTransform: "none",
                    color: "white",
                    mt: 2,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Change Role
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;