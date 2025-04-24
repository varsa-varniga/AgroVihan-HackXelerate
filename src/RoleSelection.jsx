import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { Agriculture, Person } from "@mui/icons-material";

const RoleSelector = ({ onRoleSelect }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        flexWrap: "wrap",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: 250,
          textAlign: "center",
          cursor: "pointer",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
            bgcolor: "#f0f0f0",
          },
        }}
        onClick={() => onRoleSelect("farmer")}
      >
        <Agriculture sx={{ fontSize: 60, color: "green", mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Farmer
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Access farm management tools and market data
        </Typography>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: 250,
          textAlign: "center",
          cursor: "pointer",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
            bgcolor: "#f0f0f0",
          },
        }}
        onClick={() => onRoleSelect("user")}
      >
        <Person sx={{ fontSize: 60, color: "blue", mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          User
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse marketplace and purchase farm products
        </Typography>
      </Paper>
    </Box>
  );
};

export default RoleSelector;
