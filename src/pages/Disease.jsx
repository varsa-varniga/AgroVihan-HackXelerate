import React from 'react';
import { Box, Typography } from '@mui/material';
import image from '../assets/Disease.jpg';


export default function ClimatePredictionSection() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row', // Keep the image on the left, text on the right
        minHeight: '100vh',
        width: '100%',
        overflow: 'visible',
        pt: { xs: 10, md: 14 },
      }}
    >
      {/* Left: Image Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center', // Vertically center the image
          justifyContent: 'center',
          p: 4,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: '24px',
            overflow: 'visible',
          }}
        >
          {/* Heading with black text and light background, positioned to the top right of the image */}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              position: 'absolute',
              top: '-50px', // Move the first half of the text above the image
              right: '20px', // Position the text on the right side
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              color: '#000',
              padding: '10px 20px',
              borderRadius: '12px',
              backdropFilter: 'blur(6px)',
              textShadow: '1px 1px 4px rgba(255,255,255,0.5)',
              zIndex: 2,
            }}
          >
            AI Based <br /> Disease Detection
          </Typography>


          {/* Image */}
          <Box
            component="img"
            src={image}
            alt="Climate Prediction"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '24px',
              display: 'block',
            }}
          />
        </Box>
      </Box>


      {/* Right: Text Section */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
        AI-based disease detection in organic farming uses machine learning and image analysis to identify early
         symptoms in crops. This helps farmers act quickly, reducing losses and maintaining organic standards.
          <br /><br />
          By analyzing leaf patterns, color changes, and environmental data, AI models predict diseases before
          they spread. This supports timely intervention using eco-friendly methods, vital for sustainable and
          organic farming practices.
          <br /><br />
          Integrating AI tools with mobile apps empowers farmers with real-time insights. This tech-driven
          approach minimizes chemical use, promotes crop health, and enhances productivity while preserving the
          integrity of organic farming systems.
        </Typography>
      </Box>
    </Box>
  );
}


