import React from "react";
import { Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import HeroVideo from "../assets/Hero_Page.mp4";


const HeroPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  return (
    <Box
      sx={{
        position: "relative",
        width: "98vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={HeroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      {/* Overlay Content with Page Padding */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          px: { xs: 2, sm: 6, md: 8 }, // responsive left/right gap
          py: { xs: 4, md: 6 },
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h3"}
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          Empowering smallholder farmers to remove carbon from the atmosphere
        </Typography>
        <Typography variant={isMobile ? "body1" : "h6"} textAlign="center">
          On a mission to sequester{" "}
          <span style={{ color: "#FFC107", fontWeight: "bold" }}>
            1 Billion Tonnes
          </span>{" "}
          of CO₂e on smallholder lands
        </Typography>
      </Box>
    </Box>
  );
};


export default HeroPage;
