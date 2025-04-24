import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  LinearProgress,
  Container,
  IconButton,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Cloud as CloudIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Water as WaterIcon,
  Thermostat as ThermostatIcon,
  AirOutlined as WindIcon,
  Opacity as HumidityIcon,
  Grass as CropIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function CropMonitoringDashboard() {
  const [cropType, setCropType] = useState('');
  const [cropPhase, setCropPhase] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestion, setSuggestion] = useState('');
  const [fetchingSuggestion, setFetchingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);
  
  // Firebase sensor data
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
    soil_moisture: "--"
  });
  const [loadingSensorData, setLoadingSensorData] = useState(true);
  const [sensorError, setSensorError] = useState(null);

  const cropTypes = ['Rice', 'Wheat', 'Corn', 'Tomato', 'Cotton', 'Potato', 'Sugarcane'];
  const cropPhases = ['Germination', 'Vegetative', 'Flowering', 'Harvest'];

  const API_KEY = import.meta.env?.VITE_WEATHER_API_KEY || process.env.REACT_APP_WEATHER_API_KEY;
  const lat = 11.0168;
  const lon = 76.9558;
  const BACKEND_URL = 'http://localhost:5001/suggest';

  // Green theme colors
  const themeColors = {
    primary: '#2e7d32', // Dark green
    secondary: '#81c784', // Medium green
    light: '#e8f5e9', // Light green
    accent: '#1b5e20', // Darker green for accents
    cardBg: '#f1f8e9', // Very light green for cards
    textPrimary: '#1b5e20', // Dark green for text
    textSecondary: '#33691e', // Another dark shade for secondary text
  };

  useEffect(() => {
    fetchWeatherData();
    fetchSensorData();
    
    // Set up interval to fetch sensor data every 10 seconds
    const interval = setInterval(() => {
      fetchSensorData();
    }, 10000);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Log when sensor data changes for debugging
  useEffect(() => {
    console.log("Current sensor data:", sensorData);
  }, [sensorData]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY,
        }
      });
      setWeather(res.data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError('Failed to fetch weather data');
      // Fallback mock data
      setWeather({
        main: { temp: 28, humidity: 75 },
        wind: { speed: 12 },
        rain: { '1h': 2.5 }
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSensorData = async () => {
    setLoadingSensorData(true);
    setSensorError(null);
    try {
      console.log("Fetching sensor data from:", FIREBASE_URL);
      const response = await axios.get(FIREBASE_URL);
      console.log("Sensor data response:", response.data); // For debugging
      
      if (response.data) {
        // Store the data, providing fallbacks in case properties are missing
        const data = response.data;
        setSensorData({
          temperature: data.temperature !== undefined ? data.temperature : "--",
          humidity: data.humidity !== undefined ? data.humidity : "--",
          soil_moisture: data.soil_moisture !== undefined ? data.soil_moisture : "--"
        });
        setSensorError(null);
      } else {
        throw new Error("No sensor data available");
      }
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setSensorError("Failed to fetch sensor data. Please check your connection.");
      // Don't update sensor data state to keep previous values
    } finally {
      setLoadingSensorData(false);
    }
  };

  const fetchSuggestion = async () => {
    if (!cropType || !cropPhase || !weather) {
      setSuggestionError('Please select crop type, crop phase, and wait for weather data.');
      return;
    }

    setFetchingSuggestion(true);
    setSuggestionError(null);

    try {
      // Create request data with field names matching backend expectations
      const requestData = {
        crop_type: cropType,
        phase: cropPhase,
        temp: weather.main.temp,
        humidity: weather.main.humidity,
        rain: weather.rain ? (weather.rain['1h'] || 0) : 0,
        wind_speed: weather.wind.speed
      };

      console.log("Sending data to backend:", requestData);
      
      const response = await axios.post(BACKEND_URL, requestData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data && response.data.suggestion) {
        setSuggestion(response.data.suggestion);
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error);
      } else {
        throw new Error('No suggestion found');
      }
    } catch (err) {
      console.error("Suggestion fetch error:", err);
      setSuggestionError('Failed to fetch suggestion. Showing mock suggestion.');
      setSuggestion('Based on current weather, reduce irrigation and monitor for diseases due to humidity.');
    } finally {
      setFetchingSuggestion(false);
    }
  };

  const renderWeatherSummary = () => {
    if (loading) return <LinearProgress sx={{ my: 4, backgroundColor: themeColors.secondary }} color="success" />;
    if (error) return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
    if (!weather) return null;

    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Card elevation={3} sx={{ minWidth: 140, bgcolor: themeColors.cardBg, borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <ThermostatIcon sx={{ color: themeColors.primary, fontSize: 32, mb: 1 }} />
            <Typography variant="subtitle1" color={themeColors.textSecondary}>Temperature</Typography>
            <Typography variant="h5" color={themeColors.textPrimary} fontWeight="bold">{Math.round(weather.main.temp)}°C</Typography>
          </CardContent>
        </Card>
        <Card elevation={3} sx={{ minWidth: 140, bgcolor: themeColors.cardBg, borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <HumidityIcon sx={{ color: themeColors.primary, fontSize: 32, mb: 1 }} />
            <Typography variant="subtitle1" color={themeColors.textSecondary}>Humidity</Typography>
            <Typography variant="h5" color={themeColors.textPrimary} fontWeight="bold">{weather.main.humidity}%</Typography>
          </CardContent>
        </Card>
        <Card elevation={3} sx={{ minWidth: 140, bgcolor: themeColors.cardBg, borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <WindIcon sx={{ color: themeColors.primary, fontSize: 32, mb: 1 }} />
            <Typography variant="subtitle1" color={themeColors.textSecondary}>Wind</Typography>
            <Typography variant="h5" color={themeColors.textPrimary} fontWeight="bold">{weather.wind.speed} km/h</Typography>
          </CardContent>
        </Card>
        <Card elevation={3} sx={{ minWidth: 140, bgcolor: themeColors.cardBg, borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <WaterIcon sx={{ color: themeColors.primary, fontSize: 32, mb: 1 }} />
            <Typography variant="subtitle1" color={themeColors.textSecondary}>Rainfall</Typography>
            <Typography variant="h5" color={themeColors.textPrimary} fontWeight="bold">{weather.rain ? (weather.rain['1h'] || 0).toFixed(1) : '0'} mm</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderSensorData = () => {
    if (loadingSensorData) {
      return <LinearProgress sx={{ my: 2, backgroundColor: themeColors.secondary }} color="success" />;
    }
    
    if (sensorError) {
      return <Alert severity="error" sx={{ my: 2 }}>{sensorError}</Alert>;
    }
    
    return (
      <Grid container spacing={3}>
        {/* Temperature Container */}
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: `linear-gradient(to bottom, #ffffff, ${themeColors.light})`,
              borderLeft: `5px solid #e57373`,
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#d32f2f',
                fontWeight: 500,
                mb: 1
              }}
            >
              Temperature
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#d32f2f',
                fontWeight: 600
              }}
            >
              {sensorData.temperature}°C
            </Typography>
          </Paper>
        </Grid>
        
        {/* Humidity Container */}
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: `linear-gradient(to bottom, #ffffff, ${themeColors.light})`,
              borderLeft: `5px solid #64b5f6`,
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#1976d2',
                fontWeight: 500,
                mb: 1
              }}
            >
              Humidity
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#1976d2',
                fontWeight: 600
              }}
            >
              {sensorData.humidity}%
            </Typography>
          </Paper>
        </Grid>
        
        {/* Soil Moisture Container */}
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: `linear-gradient(to bottom, #ffffff, ${themeColors.light})`,
              borderLeft: `5px solid #8d6e63`,
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#5d4037',
                fontWeight: 500,
                mb: 1
              }}
            >
              Soil Moisture
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#5d4037',
                fontWeight: 600
              }}
            >
              {sensorData.soil_moisture}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${themeColors.light} 0%, #ffffff 100%)`,
      py: 4 
    }}>
      <Container maxWidth="md">
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            mb: 3, 
            borderRadius: 3,
            background: `linear-gradient(to bottom, #ffffff, ${themeColors.light})`,
            borderTop: `5px solid ${themeColors.primary}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <CropIcon sx={{ color: themeColors.primary, fontSize: 36, mr: 1 }} />
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              sx={{ 
                color: themeColors.textPrimary,
                letterSpacing: '0.5px'
              }}
            >
              AgroVihan
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            textAlign="center" 
            gutterBottom 
            sx={{ 
              color: themeColors.textSecondary,
              mb: 3,
              fontWeight: 500
            }}
          >
            Smart Crop Monitoring Dashboard
          </Typography>
          
          <Divider sx={{ mb: 3, borderColor: themeColors.secondary }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CloudIcon sx={{ color: themeColors.primary }} />
              <Typography variant="h6" sx={{ color: themeColors.textPrimary, fontWeight: 600 }}>
                Current Weather Conditions
              </Typography>
            </Stack>
            <Tooltip title="Refresh Weather">
              <IconButton 
                onClick={fetchWeatherData} 
                disabled={loading}
                sx={{ 
                  color: themeColors.primary,
                  '&:hover': { backgroundColor: themeColors.light }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          {renderWeatherSummary()}
        </Paper>

        {/* Live Sensor Readings from Firebase - Moved up for more prominence */}
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            mb: 3, 
            borderRadius: 3,
            background: `linear-gradient(to bottom, #ffffff, ${themeColors.light})`,
            borderTop: `5px solid ${themeColors.primary}`
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: themeColors.textPrimary,
                fontWeight: 600
              }}
            >
              Live Sensor Readings
            </Typography>
            <Tooltip title="Refresh Sensor Data">
              <IconButton 
                onClick={fetchSensorData} 
                disabled={loadingSensorData}
                sx={{ 
                  color: themeColors.primary,
                  '&:hover': { backgroundColor: themeColors.light }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          
          {renderSensorData()}
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: themeColors.textSecondary,
              mt: 2,
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            Data refreshes automatically every 10 seconds
          </Typography>
        </Paper>

        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            mb: 3, 
            borderRadius: 3,
            background: `linear-gradient(to bottom, #ffffff, ${themeColors.light})`,
            borderTop: `5px solid ${themeColors.primary}`
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: themeColors.textPrimary,
              fontWeight: 600,
              mb: 3
            }}
          >
            Crop Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Crop Type"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& label': { color: themeColors.textSecondary },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: themeColors.secondary },
                    '&:hover fieldset': { borderColor: themeColors.primary },
                    '&.Mui-focused fieldset': { borderColor: themeColors.primary }
                  }
                }}
              >
                {cropTypes.map((crop) => (
                  <MenuItem key={crop} value={crop}>{crop}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Crop Phase"
                value={cropPhase}
                onChange={(e) => setCropPhase(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& label': { color: themeColors.textSecondary },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: themeColors.secondary },
                    '&:hover fieldset': { borderColor: themeColors.primary },
                    '&.Mui-focused fieldset': { borderColor: themeColors.primary }
                  }
                }}
              >
                {cropPhases.map((phase) => (
                  <MenuItem key={phase} value={phase}>{phase}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              onClick={fetchSuggestion}
              disabled={fetchingSuggestion}
              sx={{ 
                backgroundColor: themeColors.primary,
                '&:hover': { backgroundColor: themeColors.accent },
                px: 4,
                py: 1,
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              {fetchingSuggestion ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Get Recommendation'
              )}
            </Button>
          </Box>

          {suggestionError && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3,
                borderRadius: 2
              }}
            >
              {suggestionError}
            </Alert>
          )}
          
          {suggestion && (
            <Alert 
              icon={<InfoIcon />}
              severity="success" 
              sx={{ 
                mt: 3,
                backgroundColor: `${themeColors.light}`,
                color: themeColors.textPrimary,
                borderLeft: `4px solid ${themeColors.primary}`,
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle1" fontWeight={500}>{suggestion}</Typography>
            </Alert>
          )}
        </Paper>
        
        <Box sx={{ textAlign: 'center', mt: 2, color: themeColors.textSecondary, fontSize: 14 }}>
          AgroVihan © 2025 - Smart Solutions for Modern Agriculture
        </Box>
      </Container>
    </Box>
  );
}