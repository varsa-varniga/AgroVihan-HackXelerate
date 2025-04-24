// src/regionalhub/MapPage.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Card, 
  CardContent, 
  CardActions, 
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import WorkIcon from '@mui/icons-material/Work';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';

// Fix for default marker icons in leaflet with webpack (standard red markers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const MapPage = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Added useNavigate hook

  // Sample data for Tamil Nadu districts with enhanced details
  const locations = [
    {
      id: 1,
      name: "Erode",
      description: "Turmeric capital with rich agricultural heritage",
      position: [11.3410, 77.7172],
      color: "#FF9800", // Orange
      mainCrops: ["Turmeric", "Sugar Cane", "Paddy"],
      icon: <EmojiNatureIcon sx={{ color: "#FF9800" }} />
    },
    {
      id: 2,
      name: "Salem",
      description: "Diverse cultivation zone with mangoes and cotton",
      position: [11.6643, 78.1460],
      color: "#4CAF50", // Green
      mainCrops: ["Mango", "Tapioca", "Cotton"],
      icon: <EmojiNatureIcon sx={{ color: "#4CAF50" }} />
    },
    {
      id: 3,
      name: "Coimbatore",
      description: "Industrial agriculture hub with focus on coconut",
      position: [11.0168, 76.9558],
      color: "#2196F3", // Blue
      mainCrops: ["Coconut", "Vegetables", "Millets"],
      icon: <EmojiNatureIcon sx={{ color: "#2196F3" }} />
    },
    {
      id: 4,
      name: "Villupuram",
      description: "Fertile plains with traditional grain cultivation",
      position: [11.9401, 79.4861],
      color: "#9C27B0", // Purple
      mainCrops: ["Paddy", "Sugarcane", "Groundnut"],
      icon: <EmojiNatureIcon sx={{ color: "#9C27B0" }} />
    }
  ];

  const handleViewDetails = (locationId) => {
    navigate(`/dashboard/resource-hubs/details/${locationId}`);
  };

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={0} 
        sx={{ 
          my: 4, 
          p: 3, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AgricultureIcon sx={{ fontSize: 32, mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            AgroVihan Initiative
          </Typography>
        </Box>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            opacity: 0.8,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            pl: 2
          }}
        >
          Tamil Nadu Regional Hubs for Youth Employment & Agricultural Development
        </Typography>
        
        <Box 
          sx={{ 
            height: '500px', 
            borderRadius: 2, 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <MapContainer 
            center={[11.1271, 78.6569]} 
            zoom={7} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {locations.map((location) => (
              <Marker 
                key={location.id} 
                position={location.position}
                // Using default Leaflet markers (red pins)
              >
                <Popup 
                  closeButton={false}
                  className="custom-popup"
                >
                  <Card 
                    elevation={0} 
                    sx={{ 
                      minWidth: 250, 
                      border: 'none',
                      overflow: 'visible',
                      position: 'relative',
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: -25,
                        left: 'calc(50% - 25px)',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      {location.icon}
                    </Box>
                    
                    <CardContent sx={{ pt: 4, pb: 1 }}>
                      <Typography variant="h6" align="center" gutterBottom fontWeight="bold">
                        {location.name} District
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        align="center" 
                        paragraph
                        sx={{ mb: 2 }}
                      >
                        {location.description}
                      </Typography>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Typography variant="caption" color="text.secondary" display="block">
                        Key Crops:
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, justifyContent: 'center' }}>
                        {location.mainCrops.map((crop, index) => (
                          <Chip 
                            key={index} 
                            label={crop} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              borderColor: location.color,
                              color: location.color,
                              '& .MuiChip-label': { px: 1 }
                            }} 
                          />
                        ))}
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button 
                        variant="contained" 
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => handleViewDetails(location.id)}
                        sx={{ 
                          bgcolor: location.color,
                          '&:hover': {
                            bgcolor: location.color,
                            filter: 'brightness(0.9)'
                          },
                          borderRadius: 5,
                          px: 3,
                          py: 0.75,
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '150px' // Fixed width for better alignment
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          {locations.map((location) => (
            <Chip 
              key={location.id}
              icon={<LocationOnIcon sx={{ color: `${location.color} !important` }} />}
              label={location.name}
              variant="outlined"
              sx={{ 
                borderColor: location.color,
                color: location.color,
                '&:hover': { 
                  bgcolor: `${location.color}10`,
                  borderColor: location.color,
                },
                px: 1
              }}
              onClick={() => handleViewDetails(location.id)}
            />
          ))}
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mt: 4, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            border: '1px solid #e0e0e0'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <WorkIcon sx={{ color: theme.palette.primary.main, mt: 0.5 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Youth Employment Focus
              </Typography>
              <Typography variant="body2">
                Our agricultural hubs create sustainable livelihoods through modern farming techniques 
                and market linkages. Each district offers unique opportunities based on local crops and conditions.
                Click on district markers to explore youth employment initiatives in Tamil Nadu agriculture.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
};

export default MapPage;