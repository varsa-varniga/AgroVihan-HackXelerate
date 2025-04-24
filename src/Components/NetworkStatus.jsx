// src/Components/NetworkStatus.jsx
import React, { useState, useEffect } from "react";
import { Box, Chip, Badge, Tooltip } from "@mui/material";
import { Wifi as WifiIcon, WifiOff as WifiOffIcon } from "@mui/icons-material";

const NetworkStatus = ({ pendingUploads = 0 }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <Box sx={{ position: "fixed", top: 20, right: 20, zIndex: 2000 }}>
      <Tooltip
        title={
          isOnline
            ? "Connected to the internet"
            : `Offline mode - ${pendingUploads} calculations pending upload`
        }
      >
        <Badge
          badgeContent={!isOnline && pendingUploads > 0 ? pendingUploads : 0}
          color="warning"
        >
          <Chip
            icon={isOnline ? <WifiIcon /> : <WifiOffIcon />}
            label={isOnline ? "Online" : "Offline"}
            color={isOnline ? "success" : "default"}
            variant={isOnline ? "outlined" : "filled"}
            sx={{
              fontWeight: "bold",
              backgroundColor: isOnline
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(211, 47, 47, 0.1)",
            }}
          />
        </Badge>
      </Tooltip>
    </Box>
  );
};

export default NetworkStatus;
