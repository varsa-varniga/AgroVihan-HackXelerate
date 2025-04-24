import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import GoogleTranslate from "../GoogleTranslate.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        bgcolor: "#ffffff",
        color: "#000",
        fontFamily: "'Poppins', sans-serif",
        width: "100%",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar
        sx={{
          px: 3,
          minHeight: "80px !important",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" aria-label="menu" sx={{ mr: 2, color: "#000" }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            AgroVihan
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button sx={{ color: "#000", fontWeight: "bold", textTransform: "none" }} onClick={() => navigate("/")}>
            Home
          </Button>
          <Button sx={{ color: "#000", fontWeight: "bold", textTransform: "none" }} onClick={() => navigate("/about")}>
            About
          </Button>
          <Button sx={{ color: "#000", fontWeight: "bold", textTransform: "none" }} onClick={() => navigate("/features")}>
            Features
          </Button>

          {/* Google Translate */}
          <Box sx={{ display: "flex", alignItems: "center", mx: 1 }}>
            <GoogleTranslate />
          </Box>

          <Button
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: "#000",
              color: "#fff",
              fontWeight: 500,
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Login / Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
