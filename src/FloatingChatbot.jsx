import React, { useState } from "react";
import { Box, Fab, Drawer, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import MultilingualChatBot from "./pages/sidebar/MultilingualAgriBot";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Show only when chatbot is closed */}
      {!isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 39,
            right: 24,
            zIndex: 1300,
          }}
        >
          <Fab
            color="primary"
            aria-label="chat"
            onClick={toggleChat}
            sx={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.24)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
              },
            }}
          >
            <ChatIcon sx={{ fontSize: 28 }} />
          </Fab>
        </Box>
      )}

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleChat}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            maxWidth: "100%",
            height: "85vh",
            maxHeight: "85vh",
            borderRadius: { xs: "20px 20px 0 0", sm: "16px 0 0 16px" },
            bottom: { xs: 0, sm: "3vh" },
            top: { xs: "6vh", sm: "3vh" },
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "relative",
            background: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2.5,
              background: "linear-gradient(to right, #f8f9fa, #ffffff)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              Farming Assistant
            </h3>
            <IconButton
              onClick={toggleChat}
              sx={{
                "&:hover": {
                  background: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <CloseIcon sx={{ color: "#757575" }} />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <MultilingualChatBot />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default FloatingChatbot;
