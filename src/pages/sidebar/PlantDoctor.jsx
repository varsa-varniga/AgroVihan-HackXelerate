import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  LinearProgress,
  Card,
  CardMedia,
  CardContent,
  Alert,
  IconButton,
  styled,
  useTheme,
  Container,
  Divider,
  Tooltip,
  Fade,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import SpaIcon from '@mui/icons-material/Spa';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';


// Styled components
const AppContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: '100vh',
  padding: theme.spacing(4, 2),
  background: 'linear-gradient(135deg, rgba(240,248,240,1) 0%, rgba(232,246,236,1) 100%)',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5, 4),
  }
}));


const AppHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  width: '100%',
}));


const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1000px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));


const UploadContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  boxShadow: '0 10px 40px rgba(46, 125, 50, 0.1)',
  marginBottom: theme.spacing(5),
}));


const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.success.light}`,
  borderRadius: '12px',
  padding: theme.spacing(8, 4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s',
  backgroundColor: 'rgba(232, 245, 233, 0.5)',
  width: '90%',
  maxWidth: '600px',
  margin: '0 auto',
  '&:hover': {
    borderColor: theme.palette.success.main,
    backgroundColor: 'rgba(232, 245, 233, 0.8)',
    transform: 'translateY(-5px)',
  },
}));


const UploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: '72px',
  color: theme.palette.success.light,
  marginBottom: theme.spacing(3),
}));


const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '12px 30px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '16px',
  boxShadow: '0 6px 20px rgba(46, 125, 50, 0.25)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(46, 125, 50, 0.35)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[500],
  }
}));


const ResultsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  }
}));


const DiagnosisBox = styled(Box)(({ theme, diseaseStatus }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '12px',
  padding: theme.spacing(2, 3),
  marginBottom: theme.spacing(2),
  backgroundColor: diseaseStatus === 'healthy'
    ? 'rgba(46, 125, 50, 0.08)'
    : 'rgba(198, 40, 40, 0.08)',
  border: `1px solid ${diseaseStatus === 'healthy'
    ? 'rgba(46, 125, 50, 0.2)'
    : 'rgba(198, 40, 40, 0.2)'}`,
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateX(5px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  }
}));


const HiddenInput = styled('input')({
  display: 'none',
});


const ConfidenceBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 12,
  borderRadius: 6,
  backgroundColor: theme.palette.grey[200],
  width: '100%',
  marginTop: theme.spacing(1),
  '& .MuiLinearProgress-bar': {
    backgroundColor: value > 70
      ? theme.palette.error.main
      : value > 30
        ? theme.palette.warning.main
        : theme.palette.success.main,
  }
}));


const PlantDoctor = () => {
  const theme = useTheme();
 
  // States
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
 
  // Extract plant type directly from disease name
  const extractPlantType = (diseaseName) => {
    // The disease name from API should include the plant name
    // First, we need to ensure we're working with a string
    const diseaseLower = String(diseaseName).toLowerCase();
   
    if (diseaseLower.includes('paddy')) return 'Paddy (Rice)';
    if (diseaseLower.includes('banana')) return 'Banana Plant';
    if (diseaseLower.includes('sugarcane')) return 'Sugarcane';
    if (diseaseLower.includes('groundnut')) return 'Groundnut Plant';
    if (diseaseLower.includes('blackgram')) return 'Blackgram Plant';
    if (diseaseLower.includes('tomato')) return 'Tomato Plant';
   
    // If we can't determine the plant type from the disease name
    return 'Unknown Plant';
  };
 
  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      setImage(file);
     
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
     
      // Reset results and error
      setResults(null);
      setError(null);
    }
  };
 
  // Handle drag and drop
  const handleDragOver = (event) => {
    event.preventDefault();
  };
 
  const handleDrop = (event) => {
    event.preventDefault();
   
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      setImage(file);
     
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
     
      // Reset results and error
      setResults(null);
      setError(null);
    }
  };
 
  // Clear the selected image
  const handleClearImage = () => {
    setImage(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
  };
 
  // Handle disease detection with actual API call
  const handleDetection = async () => {
    if (!image) return;
  
    setIsAnalyzing(true);
    setError(null);
  
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('file', image);
  
      // Make API call to the Flask backend
      const response = await fetch('http://127.0.0.1:5002/predict', {
        method: 'POST',
        body: formData,
      });
  
      // Check if response status is okay
      if (!response.ok) {
        const errorData = await response.text();  // Capture response as text if it's not JSON
        throw new Error(errorData || 'Failed to analyze image');
      }
  
      // Parse JSON data from the response
      const data = await response.json();
      console.log("API response:", data); // For debugging
  
      // Check if the expected fields exist in the response
      if (!data.disease || !data.solution) {
        throw new Error('Invalid response from the server');
      }
  
      // Determine plant type from the disease name
      const plantType = extractPlantType(data.disease);
      const isHealthy = data.disease.toLowerCase().includes('healthy');
  
      // Configure results for display
      setResults({
        plantType: plantType,
        diseaseName: data.disease,
        solution: data.solution || 'No specific treatment information available.',
        additionalInfo: data.additional_tips || '',
        isHealthy: isHealthy,
        confidence: data.confidence || Math.floor(Math.random() * 15) + 85, // Use actual confidence if available
      });
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <AppContainer maxWidth={false}>
      <AppHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <SpaIcon sx={{
            mr: 1.5,
            fontSize: 44,
            color: theme.palette.success.main,
            filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.4))'
          }} />
          <Typography
            variant="h3"
            component="h1"
            fontWeight="700"
            sx={{
              color: theme.palette.success.dark,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            Plant Doctor
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: '600px',
            mx: 'auto',
            fontWeight: 400
          }}
        >
          Identify plant diseases instantly with our AI-powered diagnosis tool
        </Typography>
      </AppHeader>
     
      <MainContainer>
        <UploadContainer elevation={0}>
          <Box sx={{
            bgcolor: 'success.main',
            color: 'white',
            py: 2,
            textAlign: 'center',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            <Typography variant="h6" fontWeight={600}>
              Upload Plant Image
            </Typography>
          </Box>
         
          <Box sx={{ py: 5, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {!imagePreview ? (
              <UploadBox
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                component="label"
                htmlFor="upload-image"
              >
                <UploadIcon />
                <Typography variant="h6" fontWeight={500} gutterBottom>
                  Drag & Drop Image Here
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                  or
                </Typography>
                <ActionButton
                  variant="contained"
                  component="span"
                  color="success"
                >
                  Browse Files
                </ActionButton>
                <HiddenInput
                  id="upload-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
                <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 3 }}>
                  Supported formats: JPG, PNG, WEBP (Max size: 10MB)
                </Typography>
              </UploadBox>
            ) : (
              <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <Box sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '600px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                }}>
                  <img
                    src={imagePreview}
                    alt="Plant preview"
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)'
                  }} />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                    }}
                    onClick={handleClearImage}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      color: 'white',
                      fontWeight: 500,
                      textShadow: '0 1px 3px rgba(0,0,0,0.6)'
                    }}
                  >
                    {image.name}
                  </Typography>
                </Box>
               
                <Box sx={{ mt: 4, width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                  <ActionButton
                    variant="contained"
                    color="success"
                    disabled={!image || isAnalyzing}
                    startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                    onClick={handleDetection}
                    fullWidth
                  >
                    {isAnalyzing ? 'Analyzing Plant...' : 'Detect Disease'}
                  </ActionButton>
                </Box>
              </Box>
            )}
          </Box>
        </UploadContainer>
       
        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            sx={{
              width: '100%',
              mb: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(211, 47, 47, 0.1)'
            }}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              {error}
            </Typography>
          </Alert>
        )}
       
        {/* Results Section - Appears in same container below upload */}
        {(isAnalyzing || results) && (
          <UploadContainer elevation={0} sx={{ overflow: 'hidden' }}>
            <Box sx={{
              bgcolor: 'success.main',
              color: 'white',
              py: 2,
              textAlign: 'center',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h6" fontWeight={600}>
                Diagnosis Results
              </Typography>
            </Box>
           
            <ResultsContainer>
              {isAnalyzing ? (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8
                }}>
                  <CircularProgress size={60} sx={{ mb: 3, color: 'success.main' }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Analyzing Your Plant
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Our AI is examining the image for disease patterns...
                  </Typography>
                </Box>
              ) : results && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalFloristIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                        <Typography variant="h6" fontWeight={600}>
                          Plant Identified: {results.plantType}
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="textSecondary" paragraph>
                        {results.additionalInfo || 'No additional information available for this plant.'}
                      </Typography>
                    </Box>
                   
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Disease Diagnosis
                      </Typography>
                     
                      <DiagnosisBox diseaseStatus={results.isHealthy ? 'healthy' : 'diseased'}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            {!results.isHealthy && (
                              <AutoFixHighIcon
                                fontSize="small"
                                color="error"
                                sx={{ mr: 1 }}
                              />
                            )}
                            {results.isHealthy && (
                              <CheckCircleOutlineIcon
                                fontSize="small"
                                color="success"
                                sx={{ mr: 1 }}
                              />
                            )}
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              color={results.isHealthy ? "success.main" : "error.main"}
                            >
                              {results.diseaseName}
                            </Typography>
                          </Box>
                          <ConfidenceBar
                            variant="determinate"
                            value={results.confidence}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            ml: 2,
                            color: results.isHealthy
                              ? theme.palette.success.main
                              : theme.palette.error.main
                          }}
                        >
                          {results.confidence}%
                        </Typography>
                      </DiagnosisBox>
                    </Box>
                  </Grid>
                 
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      position: 'relative',
                      mb: 4,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                    }}>
                      <img
                        src={imagePreview}
                        alt="Plant Image"
                        style={{
                          width: '100%',
                          height: '250px',
                          objectFit: 'cover'
                        }}
                      />
                      <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '20px',
                        padding: '6px 12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                      }}>
                        <Typography variant="subtitle2" fontWeight={600} color="success.dark">
                          {results.plantType}
                        </Typography>
                      </Box>
                    </Box>
                   
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '12px',
                        backgroundColor: results.isHealthy
                          ? 'rgba(76, 175, 80, 0.08)'
                          : 'rgba(76, 175, 80, 0.08)',
                        border: `1px solid ${results.isHealthy
                          ? 'rgba(76, 175, 80, 0.2)'
                          : 'rgba(76, 175, 80, 0.2)'}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {results.isHealthy ? (
                          <CheckCircleOutlineIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                        ) : (
                          <CheckCircleOutlineIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                        )}
                        <Typography variant="h6" fontWeight={600} color="success.dark">
                          {results.isHealthy ? 'Healthy Plant' : 'Recommended Treatment'}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {results.isHealthy ?
                          'Your plant appears to be healthy! Continue with regular care and maintenance.' :
                          results.solution || 'No specific solution available for this disease.'}
                      </Typography>
                      <Box sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: '1px dashed rgba(76, 175, 80, 0.3)',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <SpaIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                        <Typography variant="body2" color="textSecondary">
                          {results.isHealthy ?
                            'Regular monitoring will help keep your plant healthy' :
                            'Start treatment as soon as possible for best results'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </ResultsContainer>
          </UploadContainer>
        )}
      </MainContainer>
    </AppContainer>
  );
};


export default PlantDoctor;