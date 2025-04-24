import React from 'react';
import { Box, Typography } from '@mui/material';
import image from '../assets/Fertilizer.png';


export default function ClimatePredictionSection() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        minHeight: '100vh',
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
          p: { xs: 6, md: 10 },
        }}
      >
        <Box sx={{ maxWidth: '600px' }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
          >
            Compost is a cornerstone of organic farming. It enriches soil with nutrients, improves structure,
            and enhances microbial life. Use well-decomposed plant or animal matter for best results and balance.
            <br /><br />
            Vermicompost, produced using earthworms, is nutrient-rich and easy to apply. It boosts soil fertility
            and microbial activity. Regular application helps crops thrive without synthetic inputs, supporting
            long-term soil health.
            <br /><br />
            Green manures like legumes and cover crops add nitrogen and organic matter. When plowed back into the
            soil, they improve texture, prevent erosion, and support biodiversity, ensuring sustainable farm productivity.
          </Typography>
        </Box>
      </Box>


      {/* Right: Image Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          {/* Heading */}
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
            Fertilizer <br /> Suggestions
          </Typography>


          {/* Image */}
          <Box
            component="img"
            src={image}
            alt="Fertilizer Suggestions"
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
