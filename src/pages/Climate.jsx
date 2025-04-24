import React from 'react';
import { Box, Typography } from '@mui/material';
import image from '../assets/Climate.png';


export default function ClimatePredictionSection() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        width: '100%',
        overflow: 'visible',
        pt: { xs: 10, md: 18 },
      }}
    >
      {/* Left: Text Section */}
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
          AI-powered climate prediction provides farmers with timely, intelligent weather insights,
          enabling smarter decisions throughout the agricultural cycle. From forecasting rain patterns
          to identifying drought periods, AI tools offer critical warnings and tailored advice.
          <br /><br />
          With predictive models trained on years of climate data, it recommends the optimal time to sow,
          irrigate, and harvest crops—helping maximize yield and reduce losses. Farmers can receive
          early alerts about storms, pest outbreaks, or shifting seasonal trends, allowing them to act fast
          and protect their investments.
          <br /><br />
          In a world facing unpredictable climate shifts, AI ensures sustainable farming, smarter crop selection,
          and better resource management—driving efficiency while nurturing the earth.
        </Typography>
      </Box>


      {/* Right: Image Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          p: 4,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90%',
            borderRadius: '24px',
            overflow: 'visible',
          }}
        >
          {/* Heading with black text and light background */}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              position: 'absolute',
              top: '-40px',
              left: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              color: '#000',
              padding: '10px 20px',
              borderRadius: '12px',
              backdropFilter: 'blur(6px)',
              textShadow: '1px 1px 4px rgba(255,255,255,0.5)',
              zIndex: 2,
            }}
          >
            AI Based <br /> Climate Prediction
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
    </Box>
  );
}


