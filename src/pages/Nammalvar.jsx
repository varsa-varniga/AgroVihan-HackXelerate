import React from 'react';
import { Box, Typography } from '@mui/material';
import nammalvarImg from "../assets/nammalvar.png";       // Image 2 (Top Left - Round)
import nammalvarImg1 from "../assets/nammalvar_1.png";   // Image 1 (Bottom Right - Outline with text)

const NammalvarPage = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        backgroundColor: '#f0f4f8',
        overflow: 'hidden',
        px: 4,
        py: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Image 2 - Top Left Round */}
      <Box
        component="img"
        src={nammalvarImg}
        alt="Nammalvar Image 2 (Top Left - Round)"
        sx={{
          position: 'absolute',
          top: 30,
          left: 30,
          width: 350,
          height: 350,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid #ccc',
        }}
      />

      {/* Center Text */}
      <Box textAlign="center" maxWidth={700} zIndex={1}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Nammalvar and Organic Farming
        </Typography>
        <Typography variant="body1" fontSize={20}>
          Nammalvar was a visionary in Indian organic farming, advocating sustainable agriculture long before it became a global movement. 
          His teachings empowered countless farmers to return to eco-friendly, chemical-free practices, transforming the agricultural landscape of Tamil Nadu and beyond.
          <br /><br />
          As a staunch proponent of natural farming methods, Nammalvar emphasized soil health, biodiversity, and the use of indigenous seeds. 
          He tirelessly traveled across rural regions, educating farmers about the dangers of chemical fertilizers and the long-term benefits of organic techniques.
          <br /><br />
          Through hands-on demonstrations and deeply rooted philosophy, he inspired a wave of ecological awareness. His message was simple: 
          farming should be in harmony with nature, not in opposition to it.
          <br /><br />
          Nammalvar’s legacy lives on through the countless organic farms, training centers, and grassroots movements he helped establish. 
          His contributions continue to shape the organic farming community across India, making him a true pioneer of sustainable agriculture.
        </Typography>
      </Box>

      {/* Image 1 - Bottom Right with overlay text */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 380,
          maxWidth: '90%',
          border: '3px solid #888',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <Box
          component="img"
          src={nammalvarImg1}
          alt="Nammalvar Image 1 (Bottom Right)"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#fff',
              fontSize: 18,
              textAlign: 'center',
              maxWidth: '90%',
            }}
          >
            “By using chemical fertilisers, I found that farmers incurred only losses and costs went up. I realised then that to get optimal results, farmers should rely minimally on external inputs. This was a turning point in my life.”
            - [Nammalvar]
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NammalvarPage;
