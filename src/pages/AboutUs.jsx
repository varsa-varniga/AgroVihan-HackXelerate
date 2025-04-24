import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import backgroundImage from '../assets/AboutUsBg.jpg';



const OurStory = () => {
    
  return (
    <Box
    
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'black', // Set text color to black
        p: 3,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.8)', // Light background for contrast
          borderRadius: 3,
          py: 4,
          px: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🌿 Our Story: Rooted in Nature, Grown with Purpose
        </Typography>


        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          We started with a simple idea: reconnect with nature and grow food the way it was meant to be—pure, honest, and full of life.
        </Typography>


        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          Inspired by childhood memories of fresh harvests and earthy flavors, we turned away from chemicals and shortcuts.
        </Typography>


        <Typography variant="h6" component="blockquote" sx={{ fontStyle: 'italic', my: 2 }}>
          “What if going back to the roots is the way forward?”
        </Typography>


        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          Our journey began to grow more than just crops—we’re growing trust, sustainability, and healthier communities.
        </Typography>


        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          Working with farmers, we nurture both land and livelihoods using mindful, eco-friendly methods.
        </Typography>


        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          To us, organic isn’t a trend—it’s a tribute to the land, the farmer, and to you.
        </Typography>


        <Typography variant="h6" component="p" sx={{ mt: 3, fontWeight: 'bold' }}>
          This is more than farming. It’s a movement. Grow with us.
        </Typography>
      </Container>
    </Box>
  );
};


export default OurStory;
