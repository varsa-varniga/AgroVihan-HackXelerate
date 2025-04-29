// src/regionalhub/Details.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BookIcon from '@mui/icons-material/Book';
import EventIcon from '@mui/icons-material/Event'; // Import for Scheduled Appointments tab

// Import Firebase modules
import { db } from '../firebaseConfig'; // Import the initialized Firebase app
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const Details = () => {
  const theme = useTheme();
  const { id } = useParams(); // Get district ID from URL
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBookDialog, setOpenBookDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false); // New dialog for scheduling appointments

  // New state variables for registration functionality
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    experience: "",
    village: "",
    interest: ""
  });

  // State to hold the fetched employees
  const [firebaseEmployees, setFirebaseEmployees] = useState([]);
  
  // State to hold fetched books/appointments
  const [firebaseBooks, setFirebaseBooks] = useState([]);

  // District data based on ID
  const districtData = {
    "1": {
      name: "Erode",
      description: "Turmeric capital with rich agricultural heritage",
      color: "#FF9800", // Orange
      mainCrops: ["Turmeric", "Sugar Cane", "Paddy"],
      icon: <EmojiNatureIcon sx={{ color: "#FF9800" }} />,
      employees: [], // Remove static employees
      trainings: [
        {
          id: 201,
          title: "Turmeric Cultivation Techniques",
          date: "2025-05-15",
          time: "10:00 AM - 1:00 PM",
          location: "Erode Agricultural Center",
          trainer: "Rajesh Kumar",
          cropType: "Turmeric",
          attendees: 24,
          description: "Learn advanced techniques for organic turmeric cultivation with higher yield potential."
        },
        {
          id: 202,
          title: "Modern Irrigation Systems",
          date: "2025-05-22",
          time: "9:00 AM - 1:00 PM",
          location: "Bhavani Farming Institute",
          trainer: "Priya Sundaram",
          cropType: "Multiple Crops",
          attendees: 18,
          description: "Introduction to water-efficient irrigation systems for sustainable farming."
        }
      ]
    },
    "2": {
      name: "Salem",
      description: "Diverse cultivation zone with mangoes and cotton",
      color: "#4CAF50", // Green
      mainCrops: ["Mango", "Tapioca", "Cotton"],
      icon: <EmojiNatureIcon sx={{ color: "#4CAF50" }} />,
      employees: [], // Remove static employees
      trainings: [
        {
          id: 203,
          title: "Mango Cultivation & Export",
          date: "2025-05-18",
          time: "11:00 AM - 2:00 PM",
          location: "Salem Agricultural College",
          trainer: "Sundar Raman",
          cropType: "Mango",
          attendees: 32,
          description: "Complete guide to mango cultivation and preparation for export markets."
        }
      ]
    },
    "3": {
      name: "Coimbatore",
      description: "Industrial agriculture hub with focus on coconut",
      color: "#2196F3", // Blue
      mainCrops: ["Coconut", "Vegetables", "Millets"],
      icon: <EmojiNatureIcon sx={{ color: "#2196F3" }} />,
      employees: [], // Remove static employees
      trainings: [
        {
          id: 204,
          title: "Coconut Value Addition",
          date: "2025-05-20",
          time: "10:00 AM - 1:00 PM",
          location: "Coimbatore Agricultural Institute",
          trainer: "Anand Krishnan",
          cropType: "Coconut",
          attendees: 28,
          description: "Training on coconut product development and market opportunities."
        }
      ]
    },
    "4": {
      name: "Villupuram",
      description: "Fertile plains with traditional grain cultivation",
      color: "#9C27B0", // Purple
      mainCrops: ["Paddy", "Sugarcane", "Groundnut"],
      icon: <EmojiNatureIcon sx={{ color: "#9C27B0" }} />,
      employees: [], // Remove static employees
      trainings: [
        {
          id: 205,
          title: "Advanced Paddy Cultivation",
          date: "2025-05-25",
          time: "9:00 AM - 12:00 PM",
          location: "Villupuram Farmers Center",
          trainer: "Lakshmi Narayan",
          cropType: "Paddy",
          attendees: 35,
          description: "Modern techniques to improve rice yield and quality."
        }
      ]
    }
  };

  // Get district data based on ID
  const district = districtData[id] || {
    name: "Unknown District",
    description: "No information available",
    color: "#757575",
    mainCrops: [],
    employees: [],
    trainings: []
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modified dialog handlers
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to add employee data to Firebase
  const addEmployeeToFirebase = async (employeeData) => {
    try {
      const employeesCollectionRef = collection(db, 'employees'); // 'employees' is the name of your collection
      await addDoc(employeesCollectionRef, employeeData);
      console.log('Employee added to Firebase!');
    } catch (error) {
      console.error('Error adding employee to Firebase:', error);
      throw error; // Re-throw to be caught by the caller
    }
  };

  // Function to add training session registration to Firebase
  const addTrainingSessionToFirebase = async (trainingSessionData) => {
    try {
      const trainingSessionsCollectionRef = collection(db, 'trainingSessions'); // 'trainingSessions' is the name of your collection
      await addDoc(trainingSessionsCollectionRef, trainingSessionData);
      console.log('Training session registration added to Firebase!');
    } catch (error) {
      console.error('Error adding training session registration to Firebase:', error);
      throw error; // Re-throw to be caught by the caller
    }
  };

  const handleCloseDialog = async (submit = false) => {
    if (submit && formData.name && formData.phone) {
      // Create a new employee object
      const newEmployee = {
        name: formData.name,
        role: formData.interest ? `${formData.interest} Specialist` : "Agricultural Trainee",
        phone: formData.phone,
        email: formData.email || "Not provided",
        experience: formData.experience || "Not provided",
        village: formData.village || "Not provided",
        interest: formData.interest || "Not provided",
        districtId: id, // Add the district ID
        image: "/api/placeholder/40/40"
      };

      try {
        await addEmployeeToFirebase(newEmployee);

        // Show success message
        setOpenSnackbar(true);

        // Reset form data
        setFormData({
          name: "",
          phone: "",
          email: "",
          experience: "",
          village: "",
          interest: ""
        });

        // Re-fetch employees to update the list
        fetchEmployees();

      } catch (error) {
        // Handle Firebase error (e.g., show an error snackbar)
        console.error("Firebase error:", error);
        alert("Failed to register. Please try again."); // Replace with a better error display
      }
    }

    setOpenDialog(false);
  };

  // State and handlers for the "Book" dialog
  const [bookFormData, setBookFormData] = useState({
    title: "",
    author: "",
    notes: "",
    appointmentDate: "", // New field for appointment date
    appointmentTime: "" // New field for appointment time
  });

  const handleBookFormChange = (e) => {
    const { name, value } = e.target;
    setBookFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenBookDialog = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setOpenBookDialog(true);
  };

  const handleCloseBookDialog = (submit = false) => {
    if (submit && bookFormData.title && bookFormData.author) {
      // Create a new book object with appointment details
      const newBook = {
        title: bookFormData.title,
        author: bookFormData.author,
        notes: bookFormData.notes || "",
        employeeId: selectedEmployeeId, // Associate the book with the employee
        districtId: id,
        appointmentDate: bookFormData.appointmentDate || new Date().toISOString().split('T')[0], // Default to today
        appointmentTime: bookFormData.appointmentTime || "12:00 PM", // Default time
        timestamp: new Date().toISOString()
      };

      // Function to add book data to Firebase
      const addBookToFirebase = async (bookData) => {
        try {
          const booksCollectionRef = collection(db, 'books'); // 'books' is the name of your collection
          await addDoc(booksCollectionRef, bookData);
          console.log('Book added to Firebase!');
          setOpenSnackbar(true); // Show success snackbar
          
          // Re-fetch books to update the list
          fetchBooks();
        } catch (error) {
          console.error('Error adding book to Firebase:', error);
          alert("Failed to add book. Please try again."); // Replace with a better error display
        }
      };

      addBookToFirebase(newBook);

      // Reset form data
      setBookFormData({
        title: "",
        author: "",
        notes: "",
        appointmentDate: "",
        appointmentTime: ""
      });
    }

    setOpenBookDialog(false);
  };

  // Function to handle training registration
  const handleTrainingRegistration = async (training) => {
    // Create a new training session registration object
    const newTrainingSession = {
      trainingTitle: training.title,
      trainingDate: training.date,
      trainingTime: training.time,
      trainingLocation: training.location,
      districtId: id,
      userId: "anonymous", // Replace with actual user ID if available
      registrationDate: new Date().toISOString()
    };

    try {
      await addTrainingSessionToFirebase(newTrainingSession);
      // Show success message
      setOpenSnackbar(true);

    } catch (error) {
      // Handle Firebase error (e.g., show an error snackbar)
      console.error("Firebase error:", error);
      alert("Failed to register for training. Please try again."); // Replace with a better error display
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Function to fetch employees from Firebase
  const fetchEmployees = async () => {
    try {
      const employeesCollectionRef = collection(db, 'employees');
      const q = query(employeesCollectionRef, where("districtId", "==", id)); // Query for employees in the current district
      const querySnapshot = await getDocs(q);

      const employeesData = querySnapshot.docs.map(doc => ({
        id: doc.id, // Include the document ID
        ...doc.data()
      }));

      setFirebaseEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to load employees."); // Replace with a better error display
    }
  };
  
  // Function to fetch books/appointments from Firebase
  const fetchBooks = async () => {
    try {
      const booksCollectionRef = collection(db, 'books');
      const q = query(booksCollectionRef, where("districtId", "==", id)); // Query for books in the current district
      const querySnapshot = await getDocs(q);

      const booksData = querySnapshot.docs.map(doc => ({
        id: doc.id, // Include the document ID
        ...doc.data()
      }));

      setFirebaseBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to load appointments."); // Replace with a better error display
    }
  };

  // Fetch employees and books when the component mounts or the district ID changes
  useEffect(() => {
    fetchEmployees();
    fetchBooks();
  }, [id]);

  // Helper function to get employee name by ID
  const getEmployeeName = (employeeId) => {
    const employee = firebaseEmployees.find(emp => emp.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ mr: 1, bgcolor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                {district.icon}
                <Box component="span" sx={{ ml: 1 }}>{district.name} District Hub</Box>
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {district.description}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<HowToRegIcon />}
            onClick={handleOpenDialog}
            sx={{
              bgcolor: district.color,
              '&:hover': {
                bgcolor: district.color,
                filter: 'brightness(0.9)'
              },
              borderRadius: 2,
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              px: 3,
              py: 1
            }}
          >
            Register Now
          </Button>
        </Box>

        <Box sx={{ width: '100%', mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textTransform: 'none',
                  minHeight: 48,
                }
              }}
            >
              <Tab
                icon={<PeopleIcon />}
                iconPosition="start"
                label="Employees"
                id="tab-0"
                sx={{ color: tabValue === 0 ? district.color : 'inherit' }}
              />
              <Tab
                icon={<SchoolIcon />}
                iconPosition="start"
                label="Training Sessions"
                id="tab-1"
                sx={{ color: tabValue === 1 ? district.color : 'inherit' }}
              />
              <Tab
                icon={<EventIcon />}
                iconPosition="start"
                label="Scheduled Appointments"
                id="tab-2"
                sx={{ color: tabValue === 2 ? district.color : 'inherit' }}
              />
            </Tabs>
          </Box>

          {/* Employees Tab - Updated to include locally added employees */}
          <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" sx={{ py: 3 }}>
            {tabValue === 0 && (
              <Grid container spacing={3}>
                {/* Display Firebase Employees */}
                {firebaseEmployees.map((employee) => (
                  <Grid item xs={12} sm={6} md={4} key={employee.id}>
                    <Card
                      elevation={2}
                      sx={{
                        borderRadius: 2,
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Avatar
                            src={employee.image}
                            sx={{
                              bgcolor: district.color,
                              width: 56,
                              height: 56,
                              border: `2px solid ${district.color}`
                            }}
                          >
                            {employee.name.charAt(0)}
                          </Avatar>
                        }
                        title={
                          <Typography variant="h6" fontWeight="bold">
                            {employee.name}
                          </Typography>
                        }
                        subheader={
                          <Chip
                            icon={<WorkIcon />}
                            label={employee.role}
                            size="small"
                            sx={{
                              bgcolor: `${district.color}20`,
                              color: district.color,
                              fontWeight: 'medium',
                              mt: 0.5
                            }}
                          />
                        }
                      />
                      <CardContent>
                        <List dense disablePadding>
                          <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <PhoneIcon fontSize="small" sx={{ color: district.color }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={employee.phone}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <EmailIcon fontSize="small" sx={{ color: district.color }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={employee.email}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<BookIcon />}
                          onClick={() => handleOpenBookDialog(employee.id)} // Pass the employee ID
                          sx={{ ml: 1 }}
                        >
                          Book
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Training Sessions Tab */}
          <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" sx={{ py: 3 }}>
            {tabValue === 1 && (
              <Grid container spacing={3}>
                {district.trainings.map((training) => (
                  <Grid item xs={12} key={training.id}>
                    <Card
                      elevation={2}
                      sx={{
                        borderRadius: 2,
                        borderLeft: `5px solid ${district.color}`,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={8}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {training.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {training.description}
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <DateRangeIcon fontSize="small" sx={{ color: district.color, mr: 1 }} />
                                  <Typography variant="body2">
                                    {training.date}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <AccessTimeIcon fontSize="small" sx={{ color: district.color, mr: 1 }} />
                                  <Typography variant="body2">
                                    {training.time}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <LocationOnIcon fontSize="small" sx={{ color: district.color, mr: 1 }} />
                                  <Typography variant="body2">
                                    {training.location}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <PersonIcon fontSize="small" sx={{ color: district.color, mr: 1 }} />
                                  <Typography variant="body2">
                                    Trainer: {training.trainer}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', md: 'flex-end' }
                              }}
                            >
                              <Box sx={{ mb: { xs: 2, md: 0 } }}>
                                <Chip
                                  icon={<EmojiNatureIcon />}
                                  label={`Crop: ${training.cropType}`}
                                  sx={{
                                    bgcolor: `${district.color}15`,
                                    color: district.color,
                                    mb: 1
                                  }}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                  <PeopleIcon fontSize="small" sx={{ color: district.color, mr: 0.5 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {training.attendees} attendees registered
                                  </Typography>
                                </Box>
                              </Box>

                              <Button
                                variant="outlined"
                                onClick={() => handleTrainingRegistration(training)} // Call the registration function
                                sx={{
                                  borderColor: district.color,
                                  color: district.color,
                                  '&:hover': {
                                    borderColor: district.color,
                                    bgcolor: `${district.color}10`,
                                  },
                                  mt: { xs: 2, md: 0 }
                                }}
                              >
                                Register for Training
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Scheduled Appointments Tab */}
          <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" sx={{ py: 3 }}>
            {tabValue === 2 && (
              <Grid container spacing={3}>
                {firebaseBooks.length > 0 ? (
                  firebaseBooks.map((book) => (
                    <Grid item xs={12} key={book.id}>
                      <Card
                        elevation={2}
                        sx={{
                          borderRadius: 2,
                          borderLeft: `5px solid ${district.color}`,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {book.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {book.notes || "No additional notes provided for this book."}
                              </Typography>

                              <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <DateRangeIcon fontSize="small" sx={{ color: district.color, mr: 1 }} />
                                    <Typography variant="body2">
                                      {book.appointmentDate || "Date not specified"}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AccessTimeIcon fontSize="small" sx={{ color: district.color, mr: 1 }} />
                                    <Typography variant="body2">
                                      {book.appointmentTime || "Time not specified"}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PersonIcon fontSize="small" sx={{ color: district.color, mr: 1 }} />
                                    <Typography variant="body2">
                                      Assigned To: {getEmployeeName(book.employeeId)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <BookIcon fontSize="small" sx={{ color: district.color, mr: 1 }} />
                                    <Typography variant="body2">
                                      Name: {book.author}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  height: '100%',
                                  justifyContent: 'space-between',
                                  alignItems: { xs: 'flex-start', md: 'flex-end' }
                                }}
                              >
                                <Box sx={{ mb: { xs: 2, md: 0 } }}>
                                  <Chip
                                    icon={<CalendarMonthIcon />}
                                    label="Scheduled Appointment"
                                    sx={{
                                      bgcolor: `${district.color}15`,
                                      color: district.color,
                                      mb: 1
                                    }}
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    Created: {new Date(book.timestamp).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </Typography>
                                </Box>

                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    // You could implement a reschedule function here
                                    setOpenSnackbar(true);
                                  }}
                                  sx={{
                                    borderColor: district.color,
                                    color: district.color,
                                    '&:hover': {
                                      borderColor: district.color,
                                      bgcolor: `${district.color}10`,
                                    },
                                    mt: { xs: 2, md: 0 }
                                  }}
                                >
                                  Reschedule
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: '#f5f5f5',
                        border: '1px dashed #ccc'
                      }}
                    >
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Appointments Scheduled
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Book an appointment with any employee from the Employees tab.
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          mt: 2,
                          bgcolor: district.color,
                          '&:hover': {
                            bgcolor: district.color,
                            filter: 'brightness(0.9)'
                          }
                        }}
                        onClick={() => setTabValue(0)}
                      >
                        Go to Employees
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: '#fff'
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <VerifiedUserIcon sx={{ mr: 1, color: district.color }} />
              Features of Our {district.name} Agricultural Hub
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${district.color}20`, color: district.color }}>1</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="Expert Agricultural Guidance"
                      secondary="Connect with specialists in local crop cultivation"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${district.color}20`, color: district.color }}>2</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="Modern Farming Techniques"
                      secondary="Learn innovative methods to increase yield and quality"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${district.color}20`, color: district.color }}>3</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="Youth Employment Programs"
                      secondary="Opportunities for young people in agricultural sectors"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${district.color}20`, color: district.color }}>4</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="Market Linkages"
                      secondary="Connect with buyers and export opportunities"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Paper>

      {/* Registration Dialog - Updated with form fields and handlers */}
      <Dialog open={openDialog} onClose={() => handleCloseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: district.color, color: '#fff', display: 'flex', alignItems: 'center' }}>
          <HowToRegIcon sx={{ mr: 1 }} />
          Register for {district.name} Agricultural Programs
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Join our agricultural initiative to gain access to training, resources, and employment opportunities in {district.name} district.
          </Typography>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Experience/Fresher"
                name="experience"
                value={formData.experience}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="village"
                value={formData.village}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Agricultural Interest"
                name="interest"
                value={formData.interest}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
              >
                <MenuItem value="">Select your interest</MenuItem>
                {district.mainCrops.map((crop) => (
                  <MenuItem key={crop} value={crop}>{crop} Cultivation</MenuItem>
                ))}
                <MenuItem value="General">General Farming</MenuItem>
                <MenuItem value="Processing">Agricultural Processing</MenuItem>
                <MenuItem value="Marketing">Marketing & Distribution</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => handleCloseDialog(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={() => handleCloseDialog(true)}
            variant="contained"
            sx={{
              bgcolor: district.color,
              '&:hover': {
                bgcolor: district.color,
                filter: 'brightness(0.9)'
              }
            }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Book Dialog - Updated with appointment date/time fields */}
      <Dialog open={openBookDialog} onClose={() => handleCloseBookDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: district.color, color: '#fff', display: 'flex', alignItems: 'center' }}>
          <BookIcon sx={{ mr: 1 }} />
          Book Details & Schedule Appointment
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enter book details and schedule an appointment with the selected expert.
          </Typography>
          <Grid container spacing={2}  direction="column">
            <Grid item xs={12}>
              <TextField
                label="Purpose"
                name="title"
                value={bookFormData.title}
                onChange={handleBookFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="author"
                value={bookFormData.author}
                onChange={handleBookFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Appointment Date"
                name="appointmentDate"
                type="date"
                value={bookFormData.appointmentDate}
                onChange={handleBookFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0] // Set min date to today
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Appointment Time"
                name="appointmentTime"
                type="time"
                value={bookFormData.appointmentTime}
                onChange={handleBookFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                value={bookFormData.notes}
                onChange={handleBookFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                placeholder="Include any specific details about the book or questions you want to discuss during the appointment"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => handleCloseBookDialog(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={() => handleCloseBookDialog(true)}
            variant="contained"
            sx={{
              bgcolor: district.color,
              '&:hover': {
                bgcolor: district.color,
                filter: 'brightness(0.9)'
              }
            }}
            disabled={!bookFormData.title || !bookFormData.author}
          >
            Schedule Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Thank you! Your request was processed successfully.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Details;