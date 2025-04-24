import {
    Routes,
    Route,
    Link,
    useLocation,
    useNavigate,
  } from "react-router-dom";
  import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    IconButton,
    Divider,
    Tooltip,
    Avatar,
    Badge,
    styled,
  } from "@mui/material";
  import {
    Menu as MenuIcon,
    Logout,
    Dashboard as DashboardIcon,
    Cloud,
    LocalFlorist,
    Public,
    MonetizationOn,
    ChevronLeft,
    ChevronRight,
  } from "@mui/icons-material";
  import { useState } from "react";
  
  // Components
  import ClimateAIForecast from "./sidebar/ClimateAIForecast";
  import PlantDoctor from "./sidebar/PlantDoctor";
  import RegionalResourceHubs from "./sidebar/RegionalResourceHubs";
  import CarbonCreditMonetization from "./sidebar/CarbonCreditMonetization";
  
  import MapPage from "../regionalhub/MapPage";
  import Details from "../regionalhub/Details";
  
  // Theme colors
  const primaryGreen = "#2e7d32";
  const darkGreen = "#1b5e20";
  const background = "#f5f5f5";
  const cardBackground = "#ffffff";
  const textPrimary = "#333333";
  
  const expandedWidth = 260;
  const collapsedWidth = 80;
  
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));
  
  function Sidebar({ onLogout, userEmail }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
  
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
    const handleLogout = () => {
      onLogout();
      navigate("/login");
    };
  
    const menuItems = [
      {
        text: "Climate AI Forecast",
        path: "/dashboard/climate-forecast",
        icon: <Cloud />,
      },
      {
        text: "Plant Doctor",
        path: "/dashboard/plant-doctor",
        icon: <LocalFlorist />,
      },
      {
        text: "Regional Resource Hubs",
        path: "/dashboard/resource-hubs",
        icon: <Public />,
      },
      {
        text: "Carbon Credit Monetization",
        path: "/dashboard/carbon-credit",
        icon: <MonetizationOn />,
      },
    ];
  
    const drawer = (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            minHeight: "80px",
          }}
        >
          {!isSidebarCollapsed ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src="/agrovihan-logo.png"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: primaryGreen,
                }}
              >
                🌿
              </Avatar>
              <Typography
                variant="h6"
                noWrap
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(45deg, ${darkGreen}, ${primaryGreen})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: 1.2,
                }}
              >
                AgroVihan
              </Typography>
            </Box>
          ) : (
            <Avatar
              src="/agrovihan-logo.png"
              sx={{
                width: 40,
                height: 40,
                bgcolor: primaryGreen,
                mx: "auto",
              }}
            >
              🌿
            </Avatar>
          )}
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              color: primaryGreen,
              border: `1px solid ${primaryGreen}`,
              "&:hover": {
                backgroundColor: "rgba(46, 125, 50, 0.1)",
              },
            }}
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Toolbar>
        <Divider sx={{ borderColor: "rgba(46, 125, 50, 0.2)" }} />
        <List sx={{ flex: 1 }}>
          {menuItems.map((item) => (
            <Tooltip
              key={item.text}
              title={isSidebarCollapsed ? item.text : ""}
              placement="right"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: darkGreen,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 500,
                  },
                },
              }}
            >
              <ListItem
                button
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#A5D6A7",
                    "&:hover": { backgroundColor: "#81C784" },
                    borderLeft: `4px solid ${darkGreen}`,
                  },
                  "&:hover": {
                    backgroundColor: "#C8E6C9",
                  },
                  justifyContent: isSidebarCollapsed ? "center" : "flex-start",
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  px: 2,
                  py: 1,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isSidebarCollapsed ? 0 : 2,
                    color:
                      location.pathname === item.path ? darkGreen : primaryGreen,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isSidebarCollapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      color:
                        location.pathname === item.path ? darkGreen : textPrimary,
                      fontSize: "0.9rem",
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
        <Divider sx={{ borderColor: "rgba(46, 125, 50, 0.2)" }} />
        {!isSidebarCollapsed && userEmail && (
          <Box sx={{ p: 2, mb: 1 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: "0.75rem" }}
            >
              Logged in as:
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: "0.75rem",
                    bgcolor: primaryGreen,
                  }}
                >
                  {userEmail.charAt(0).toUpperCase()}
                </Avatar>
              </StyledBadge>
              {userEmail}
            </Typography>
          </Box>
        )}
        <List>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              justifyContent: isSidebarCollapsed ? "center" : "flex-start",
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              px: 2,
              py: 1,
              "&:hover": {
                backgroundColor: "#FFCDD2",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isSidebarCollapsed ? 0 : 2,
                color: "#d32f2f",
                justifyContent: "center",
              }}
            >
              <Logout />
            </ListItemIcon>
            {!isSidebarCollapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: "#d32f2f",
                  fontSize: "0.9rem",
                }}
              />
            )}
          </ListItem>
        </List>
      </Box>
    );
  
    const drawerWidth = isSidebarCollapsed ? collapsedWidth : expandedWidth;
  
    return (
      <Box sx={{ display: "flex" }}>
        {/* Navigation Drawers */}
        <Box
          component="nav"
          sx={{
            width: drawerWidth,
            flexShrink: { sm: 0 },
            ".MuiDrawer-paper": {
              borderRight: "none",
              boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
  
          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
  
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: background,
            minHeight: "100vh",
            transition: "all 0.3s ease",
          }}
        >
          <Toolbar />
          <Box
            sx={{
              backgroundColor: cardBackground,
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              p: 3,
              minHeight: "calc(100vh - 64px)",
            }}
          >
            <Routes>
              <Route path="climate-forecast" element={<ClimateAIForecast />} />
              <Route path="plant-doctor" element={<PlantDoctor />} />
              <Route path="resource-hubs" element={<MapPage />} />
              <Route path="resource-hubs/details/:id" element={<Details />} />
              
              <Route
                path="carbon-credit"
                element={<CarbonCreditMonetization />}
              />
            </Routes>
          </Box>
        </Box>
      </Box>
    );
  }
  
  export default Sidebar;
  