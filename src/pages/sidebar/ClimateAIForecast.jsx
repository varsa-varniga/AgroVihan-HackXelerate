import {
    Box,
    Typography,
    Avatar,
    Card,
    Button,
    Grid,
    Container
  } from "@mui/material";
  import WbCloudyIcon from "@mui/icons-material/WbCloudy";
  import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
  } from "recharts";
  import farmBg from "../../assets/farm.png";
  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  // Import Firebase
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  import { useNavigate } from "react-router-dom";
  
  
  // Theme colors
  const primaryGreen = '#4CAF50';
  const darkGreen = '#388E3C';
  const background = '#f1f8e9';
  const cardBackground = '#ffffff';
  const textPrimary = '#333333';
  const textSecondary = '#666666';
  
  // UV Gauge component
  const UVGauge = ({ value }) => {
    const maxUV = 12;
    const data = [
      { name: "uv", value: value || 0 },
      { name: "rest", value: Math.max(0, maxUV - (value || 0)) },
    ];
  
    const getUVColor = (value) => {
      if (value > 8) return "#d32f2f"; // High risk (Red)
      if (value > 5) return "#ff9800"; // Moderate risk (Orange)
      return "#2e7d32";               // Low risk (Green)
    };
  
    return (
      <Box sx={{ width: 100, height: 100, position: "relative" }}>
        <PieChart width={100} height={100}>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={30}
            outerRadius={40}
            dataKey="value"
          >
            <Cell fill={getUVColor(value || 0)} />
            <Cell fill="#e0e0e0" />
          </Pie>
        </PieChart>
  
        {/* Value label */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: getUVColor(value || 0),
          }}
        >
          {value || 0} UV
        </Box>
      </Box>
    );
  };
  
  const ClimateAIForecast = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [forecast, setForecast] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [uvIndex, setUvIndex] = useState(5); // Default UV value in case API fails
    // Add state for user data
    const [userData, setUserData] = useState({
      name: "Loading...",
      location: "Loading..."
    });
    const [userAvatar, setUserAvatar] = useState(null);
  
  
    const navigate = useNavigate();  // hook to navigate to different routes
  
    const handleNavigate = () => {
      navigate("/suggestions");  // navigate to the Suggestions page
    };
  
  
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const lat = 11.0168;
    const lon = 76.9558;
  
    function getWeatherIcon(main) {
      switch (main) {
        case "Clear": return "☀";
        case "Clouds": return "⛅";
        case "Rain": return "🌧";
        case "Thunderstorm": return "⚡";
        case "Drizzle": return "🌦";
        case "Snow": return "❄";
        default: return "🌈";
      }
    }
    
    // Add useEffect for Firebase authentication and user data
    useEffect(() => {
      const auth = getAuth();
      const db = getFirestore();
      
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in
          try {
            // Try to get user data from Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              // User data exists in Firestore
              const userData = userDoc.data();
              setUserData({
                name: userData.name || user.displayName || user.email.split('@')[0],
                location: userData.location || "Unknown Location"
              });
              setUserAvatar(userData.photoURL || user.photoURL);
            } else {
              // No user document but user is authenticated
              setUserData({
                name: user.displayName || user.email.split('@')[0],
                location: "Unknown Location"
              });
              setUserAvatar(user.photoURL);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Fallback to auth user data
            setUserData({
              name: user.displayName || user.email.split('@')[0],
              location: "Unknown Location"
            });
            setUserAvatar(user.photoURL);
          }
        } else {
          // User is signed out, set default data
          setUserData({
            name: "Guest User",
            location: "Unknown Location"
          });
          setUserAvatar(null);
        }
      });
      
      // Cleanup subscription
      return () => unsubscribe();
    }, []);
   
    useEffect(() => {
      const fetchWeatherAndForecast = async () => {
        try {
          // First fetch the basic weather data
          const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              lat,
              lon,
              units: 'metric',
              appid: API_KEY,
            },
          });
          
          setWeather(weatherRes.data);
          
          try {
            // Then try to fetch the forecast data
            const forecastRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
              params: {
                lat,
                lon,
                units: 'metric',
                appid: API_KEY,
              },
            });
            
            // 7-Day Forecast
            const dailyForecast = forecastRes.data.list
              .filter((_, index) => index % 8 === 0)
              .slice(0, 7)
              .map(item => ({
                day: new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "short" }),
                icon: getWeatherIcon(item.weather[0].main),
                temp: `${Math.round(item.main.temp)}°`,
              }));
            setForecast(dailyForecast);
            
            // Time-slot Temperature (Morning, Afternoon, etc.)
            const list = forecastRes.data.list;
            const getClosestTemp = (hour) => {
              return list.find(item => new Date(item.dt_txt).getHours() === hour);
            };
            
            const slots = {
              Morning: getClosestTemp(9) || list[0],
              Afternoon: getClosestTemp(15) || list[1],
              Evening: getClosestTemp(18) || list[2],
              Night: getClosestTemp(21) || list[3],
            };
            
            const liveTempData = Object.entries(slots).map(([label, item]) => ({
              label,
              temp: item ? Math.round(item.main.temp) : Math.round(weatherRes.data.main.temp),
            }));
            
            setTempData(liveTempData);
          } catch (forecastError) {
            console.error('Error fetching forecast data:', forecastError);
            // Set default forecast data
            setForecast([
              { day: "Sun", icon: "☀", temp: "16°" },
              { day: "Mon", icon: "⛅", temp: "15°" },
              { day: "Tue", icon: "🌤", temp: "14°" },
              { day: "Wed", icon: "🌦", temp: "12°" },
              { day: "Thu", icon: "⚡", temp: "15°" },
            ]);
            
            // Set default temp data
            setTempData([
              { label: "Morning", temp: Math.round(weatherRes.data.main.temp) - 1 },
              { label: "Afternoon", temp: Math.round(weatherRes.data.main.temp) + 1 },
              { label: "Evening", temp: Math.round(weatherRes.data.main.temp) },
              { label: "Night", temp: Math.round(weatherRes.data.main.temp) - 2 },
            ]);
          }
          
          try {
            // Finally try to fetch the UV index data
            const oneCallRes = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
              params: {
                lat,
                lon,
                exclude: 'minutely,hourly,daily,alerts',
                units: 'metric',
                appid: API_KEY,
              },
            });
            
            // UV Index
            const uv = oneCallRes.data.current.uvi;
            setUvIndex(uv);
          } catch (uvError) {
            console.error('Error fetching UV index:', uvError);
            // Keep the default UV index
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchWeatherAndForecast();
    }, [lat, lon, API_KEY]);
    
    const formatTime = (timestamp) =>
      new Date(timestamp * 1000).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });
  
    // Default data or loading state
    if (loading || !weather) {
      return (
        <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Typography variant="h5">Loading weather data...</Typography>
        </Container>
      );
    }
  
    const rainVolume = weather.rain?.["1h"] || 0;
  
    const overviewData = [
      {
        title: "Wind status",
        value: `${weather.wind.speed} m/s`,
        subtitle: "Current wind speed",
        icon: "💨"
      },
      {
        title: "UV Index",
        component: <UVGauge value={uvIndex} />,
        icon: "☀️"
      },
      {
        title: "Sunrise & Sunset",
        value: formatTime(weather.sys.sunrise),
        subtitle: `Sunset: ${formatTime(weather.sys.sunset)}`,
        icon: "🌅",
      },
      {
        title: "Humidity",
        value: `${weather.main.humidity}%`,
        subtitle: "Current humidity level",
        icon: "💧"
      },
      {
        title: "Rain",
        value: `${rainVolume} mm`,
        subtitle: rainVolume > 0 ? "It's raining" : "No rain currently",
        icon: "🌧️"
      },
      {
        title: "Feels like",
        value: `${Math.round(weather.main.feels_like)}°`,
        subtitle: `Actual: ${Math.round(weather.main.temp)}°`,
        icon: "🌡️"
      },
    ];
  
    const temperatureDomain = () => {
      const temps = tempData.map(item => item.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      const padding = (maxTemp - minTemp) * 0.2; // 20% padding
      return [minTemp - padding, maxTemp + padding];
    };
    
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: '#f1f8f4',
          color: textPrimary,
          fontFamily: "'Roboto', sans-serif",
          p: { xs: 1, md: 3 },
          gap: 3,
          flexDirection: { xs: "column", lg: "row" }
        }}
      >
        {/* Left Sidebar */}
        <Box sx={{ 
          width: { xs: "100%", lg: 400, xl: 500 },
          p: 3,
          display: "flex",
          flexDirection: "column"
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: "bold", 
              fontSize: "1.8rem",
              color: darkGreen,
              mb: 1
            }}>
              {userData.name}
            </Typography>
  
            <Typography variant="body1" sx={{ 
              mb: 3, 
              fontSize: "1.1rem",
              color: textSecondary
            }}>
              {userData.location}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                backgroundColor: cardBackground,
            
                p: 3,
                boxShadow: 1,
              }}
            >
              <WbCloudyIcon
                fontSize="large"
                sx={{
                  mr: 2,
                  fontSize: 50,
                  color: primaryGreen,
                }}
              />
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 300,
                    lineHeight: 1,
                    color: textPrimary,
                  }}
                >
                  {Math.round(weather.main.temp)}°C
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    color: textSecondary,
                  }}
                >
                  {weather.weather[0].description}
                </Typography>
              </Box>
            </Box>
          </Box>
  
          <Card
            sx={{ 
              mt: 3,
              p: 0, // Remove padding from the card
              backgroundColor: cardBackground,
              boxShadow: 1,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden' // Prevent content overflow
            }}
          >
            <Typography sx={{ 
              p: 3, // Add padding to the title
              fontSize: "1.1rem",
              fontWeight: 500,
              color: darkGreen
            }}>
              Temperature (24h)
            </Typography>
            <Box sx={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
              <ResponsiveContainer width="95%" height="100%">
                <LineChart data={tempData}>
                  <XAxis dataKey="label" />
                  <YAxis domain={temperatureDomain()} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="temp" 
                    stroke={primaryGreen} 
                    strokeWidth={3} 
                    dot={{ fill: darkGreen, strokeWidth: 2 }}
                    activeDot={{ fill: darkGreen, strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
  
          <Card
            sx={{
              mt: 3,
              p: 3,
              width: "100%",
              height: 500,
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${farmBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
             
              
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "left",
              boxShadow: 3
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "2rem",
                  lineHeight: 1.3,
                  mb: 1,
                }}
              >
                Empower Global Farming
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "1.3rem",
                  opacity: 0.9,
                }}
              >
                with AI-powered agricultural insights
              </Typography>
            </Box>
  
            <Button
              variant="contained"
              size="medium"
              sx={{
                backgroundColor: primaryGreen,
                textTransform: "none",
                fontWeight: 600,
                width: "fit-content",
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                alignSelf: "flex-start",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: darkGreen,
                  boxShadow: "none",
                },
              }}
              onClick={handleNavigate}  // onClick event to navigate
            >
              Get Smart Advice
            </Button>
          </Card>
        </Box>
  
        {/* Right Panel */}
        <Box sx={{ 
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Date + Avatar */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mb: 3,
            alignItems: "center",
            backgroundColor: cardBackground,
            p: 3,
            boxShadow: 1
          }}>
            <Box>
              <Typography sx={{ 
                color: textSecondary,
                mb: 0.5
              }}>
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Typography>
              <Typography sx={{ 
                fontSize: { xs: 24, md: 30 }, 
                fontWeight: 600,
                color: darkGreen
              }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>
            <Avatar 
              src={userAvatar || "https://i.pravatar.cc/150?img=3"} 
              sx={{ 
                width: 56, 
                height: 56,
                border: `2px solid ${primaryGreen}`
              }} 
            />
          </Box>
  
          {/* Forecast Cards */}
          <Box sx={{ 
            mb: 3,
            backgroundColor: cardBackground,
            p: 2,
            boxShadow: 1
          }}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              color: darkGreen,
              fontWeight: 600,
              pl: 1
            }}>
              {forecast.length}-Day Forecast
            </Typography>
  
            <Box sx={{ 
              display: "flex", 
              gap: 4, 
              overflowX: "auto",
              pb: 1,
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: primaryGreen,
              }
            }}>
              {forecast.map((d, idx) => (
                <Card
                  key={idx}
                  sx={{
                    minWidth: 100,
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                    p: 2,
                    boxShadow: 1,
                    flex: "0 0 auto",
                  }}
                >
                  <Typography variant="body2" sx={{ color: textSecondary, mb: 1 }}>
                    {d.day}
                  </Typography>
                  <Typography sx={{ fontSize: "2rem" }}>{d.icon}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
                    {d.temp}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
  
          {/* Overview Grid */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: cardBackground,
              p: 4,
              boxShadow: 1
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: darkGreen
              }}
            >
              Today's Overview
            </Typography>
  
            <Grid container spacing={3}>
              {overviewData.map((item, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'stretch'
                  }}
                >
                  <Card
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between', // Distribute space evenly
                      alignItems: 'center',
                      backgroundColor: cardBackground,
                      p: 3,
                      boxShadow: 2,
                      width: '250px',
                      height: '150px',
                      borderLeft: `4px solid ${primaryGreen}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: darkGreen,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        textAlign: 'center'
                      }}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      {item.title}
                    </Typography>
  
                    {item.component ? (
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {item.component}
                      </Box>
                    ) : (
                      <>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 600,
                            fontSize: '1.8rem',
                            color: textPrimary,
                            my: 1,
                            textAlign: 'center' // Center the value
                          }}
                        >
                          {item.value}
                        </Typography>
                        {item.subtitle && (
                          <Typography
                            sx={{
                              fontSize: 18,
                              textAlign: 'center',
                              color: textSecondary
                            }}
                          >
                            {item.subtitle}
                          </Typography>
                        )}
                      </>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
  
        </Box>
      </Container>
    );
  };
  
  export default ClimateAIForecast;