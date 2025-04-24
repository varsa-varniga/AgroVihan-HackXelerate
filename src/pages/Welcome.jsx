import React from "react";
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";


// Importing images
import WelcomeImage from "../assets/Welcome.png";
import Welcome1 from "../assets/Welcome_2.jpg";
import Welcome2 from "../assets/Welcome_1.jpg";
import Welcome3 from "../assets/Welcome_3.png";
import Welcome4 from "../assets/Welcome_4.png";


// Feature data with image references
const features = [
  {
    title: "100% Natural",
    description: "Consectetur adipiscing elit. Enim, nec at iaculis in. Faucibus arcu varius",
    image: Welcome1,
  },
  {
    title: "100% Organic",
    description: "Consectetur adipiscing elit. Enim, nec at iaculis in. Faucibus arcu varius",
    image: Welcome2,
  },
  {
    title: "Fresh Product",
    description: "Consectetur adipiscing elit. Enim, nec at iaculis in. Faucibus arcu varius",
    image: Welcome3,
  },
  {
    title: "Best Quality",
    description: "Consectetur adipiscing elit. Enim, nec at iaculis in. Faucibus arcu varius",
    image: Welcome4,
  },
];


const WelcomeSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        px: 6,
        py: 8,
        gap: 6,
      }}
    >
      {/* Left Welcome Image */}
      <Box
        sx={{
          width: "350px",
          flexShrink: 0,
        }}
      >
        <img
          src={WelcomeImage}
          alt="Welcome"
          style={{ width: "100%", height: "auto" }}
        />
      </Box>


      {/* Right Content */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Welcome to AgroVihan
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mb={4}
          maxWidth="750px"
        >
          Quis vehicula vitae et facilisi at nulla leo ut curabitur. Ipsum,
          fringilla imperdiet nisi faucibus pharetra egestas nunc, mattis.
          Risus lectus enim tincidunt.
        </Typography>


        {/* Cards Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            gap: 3,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                width: "100%",
                maxWidth: 220,
                textAlign: "center",
                boxShadow: 3,
                flexShrink: 0,
                py: 2,
              }}
            >
              <Avatar
                src={feature.image}
                alt={feature.title}
                sx={{
                  width: 80,
                  height: 80,
                  margin: "0 auto 16px",
                  border: "3px solid #76b947", // Soft green border
                }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};


export default WelcomeSection;  
