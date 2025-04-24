import React from 'react';
import { Box, Typography } from '@mui/material';
import image from '../assets/Chat.png';


export default function ClimatePredictionSection() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        overflow: 'visible',
        pt: { xs: 10, md: 14 },
      }}
    >
      {/* Left: Text Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
        }}
      >
        <Box
          sx={{
            maxWidth: '600px',
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
            }}
          >
            A multilingual AI chatbot helps farmers by answering queries about organic farming practices in their
            local language. It bridges the knowledge gap by providing instant, accessible, and culturally relevant advice.
            <br /><br />
            This AI tool supports crop planning, natural pest control, composting methods, and organic certification
            guidance. It adapts to regional climates and soil types, offering localized solutions for sustainable
            agricultural practices.
            <br /><br />
            With voice and text capabilities, the chatbot empowers even non-literate users. It builds trust through
            continuous learning, fostering eco-friendly farming, improving yields, and promoting healthier food systems
            across diverse communities.
          </Typography>
        </Box>
      </Box>


      {/* Right: Image Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            borderRadius: '24px',
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
            Multilingual <br /> AI ChatBot
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
