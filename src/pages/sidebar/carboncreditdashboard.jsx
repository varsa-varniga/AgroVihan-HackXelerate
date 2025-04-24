import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
} from "@mui/material";
import {
  Close as CloseIcon,
  MonetizationOn as MonetizationOnIcon,
  AutoGraph as AutoGraphIcon,
  Receipt as ReceiptIcon,
  BarChart as BarChartIcon,
  Verified as VerifiedIcon,
  AttachMoney as AttachMoneyIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  Nature as NatureIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";

import { db, auth } from "../../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const Dashboard = ({ onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carbonData, setCarbonData] = useState({
    totalCredits: 0,
    transactions: [],
    creditSources: [],
    creditHistory: [],
  });
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserCarbonData(currentUser.email);
      } else {
        setLoading(false);
        setError("Please login to view your dashboard");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserCarbonData = async (userEmail) => {
    try {
      setLoading(true);
      setError(null);

      const userCollection = collection(db, "carbonCalculations");
      const q = query(userCollection, where("email", "==", userEmail));

      const querySnapshot = await getDocs(q);

      let transactions = [];
      let creditSources = {
        Irrigation: 0,
        Fertilizer: 0,
        Equipment: 0,
        Crop: 0,
      };
      let totalCredits = 0;
      const creditHistory = generateEmptyCreditHistory();

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const credits = data.carbonCredits || 0;
          totalCredits += credits;

          const date = data.timestamp?.toDate();
          const month = date?.toLocaleString("default", { month: "short" });

          // Update credit sources if details exist
          if (data.details) {
            creditSources.Irrigation += Math.abs(
              data.details.irrigationImpact || 0
            );
            creditSources.Fertilizer += Math.abs(
              data.details.fertilizerImpact || 0
            );
            creditSources.Equipment += Math.abs(
              data.details.equipmentImpact || 0
            );
            creditSources.Crop += Math.abs(data.details.cropImpact || 0);
          }

          // Add to transactions
          transactions.push({
            id: doc.id,
            date: date?.toLocaleDateString() || "N/A",
            credits: credits,
            type: "Earned",
            score: data.carbonScore || 0,
            method: getEarningMethod(data.carbonScore || 0),
            details: data.details || {},
          });

          // Update credit history
          if (month) {
            const monthData = creditHistory.find((m) => m.month === month);
            if (monthData) {
              monthData.credits += credits;
            }
          }
        });

        // Sort transactions by date (newest first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      setCarbonData({
        totalCredits,
        transactions,
        creditSources: Object.entries(creditSources)
          .map(([name, value]) => ({ name, value }))
          .filter((item) => item.value > 0),
        creditHistory,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching carbon data:", error);
      setError("Failed to load your carbon credit data. " + error.message);
      setLoading(false);
    }
  };

  const generateEmptyCreditHistory = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleString("default", { month: "short" }),
        credits: 0,
      });
    }
    return months;
  };

  const getEarningMethod = (score) => {
    if (score >= 80) return "Excellent Sustainability";
    if (score >= 60) return "Good Practices";
    return "Standard Farming";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  if (loading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "background.paper",
          zIndex: 1300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress color="success" size={60} thickness={4} />
        </motion.div>
        <Typography variant="h6" sx={{ mt: 3, color: "text.secondary" }}>
          Harvesting your carbon credit data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "background.paper",
          zIndex: 1300,
          p: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={onClose}
              size="large"
              sx={{ color: "text.primary" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Alert
            severity="error"
            sx={{
              mt: 3,
              borderLeft: "4px solid",
              borderColor: "error.main",
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Data Harvest Failed
            </Typography>
            <Typography>{error}</Typography>
          </Alert>
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
              sx={{
                px: 6,
                borderRadius: 5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: theme.shadows[4],
              }}
            >
              Back to Calculator
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "background.paper",
        zIndex: 1300,
        overflowY: "auto",
        p: isMobile ? 1 : 3,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            pt: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              color: "primary.main",
            }}
          >
            <AutoGraphIcon sx={{ mr: 2, fontSize: "2.5rem" }} />
            Carbon Credits Dashboard
          </Typography>
          <IconButton
            onClick={onClose}
            size="large"
            sx={{
              color: "text.primary",
              backgroundColor: alpha(theme.palette.text.primary, 0.1),
              "&:hover": {
                backgroundColor: alpha(theme.palette.text.primary, 0.2),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 4,
              p: 2,
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
              borderRadius: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                mr: 2,
                fontSize: "1.5rem",
              }}
            >
              {user.displayName?.charAt(0) || user.email?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {user.displayName || user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sustainable Farmer since{" "}
                {new Date(user.metadata.creationTime).getFullYear()}
              </Typography>
            </Box>
            <Chip
              icon={<VerifiedIcon fontSize="small" />}
              label="Verified"
              color="success"
              sx={{ ml: "auto", fontWeight: "bold" }}
            />
          </Box>
        )}

        <Grid container spacing={3}>
          {/* Total Credits Card */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div whileHover={{ y: -5 }}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.success.light,
                    0.2
                  )} 0%, ${alpha(theme.palette.success.light, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    background: alpha(theme.palette.success.main, 0.05),
                    borderRadius: "50%",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "success.dark",
                  }}
                >
                  <MonetizationOnIcon sx={{ mr: 1 }} />
                  Current Carbon Credits
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-end", mt: 2 }}>
                  <Typography
                    variant="h2"
                    sx={{ fontWeight: "bold", lineHeight: 1 }}
                  >
                    {carbonData.totalCredits.toFixed(1)}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ ml: 1, mb: 0.5, color: "success.dark" }}
                  >
                    FC
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    mt: 1,
                    color: "success.dark",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AttachMoneyIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  {(carbonData.totalCredits * 4.75).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}{" "}
                  estimated value
                </Typography>
                <Divider sx={{ my: 2, borderColor: "success.light" }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Transactions
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {carbonData.transactions.length}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Credit Value
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      $4.75/FC
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div whileHover={{ y: -5 }}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.info.light,
                    0.2
                  )} 0%, ${alpha(theme.palette.info.light, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "info.dark",
                    }}
                  >
                    <ReceiptIcon sx={{ mr: 1 }} />
                    Recent Transactions
                  </Typography>
                  <Badge
                    badgeContent={carbonData.transactions.length}
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                </Box>

                {carbonData.transactions.length > 0 ? (
                  <List
                    sx={{
                      flex: 1,
                      maxHeight: 400,
                      overflow: "auto",
                      pr: 1,
                      "&::-webkit-scrollbar": {
                        width: 6,
                      },
                      "&::-webkit-scrollbar-track": {
                        background: alpha(theme.palette.divider, 0.1),
                        borderRadius: 3,
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: alpha(theme.palette.primary.main, 0.4),
                        borderRadius: 3,
                      },
                    }}
                  >
                    {carbonData.transactions.map((tx) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ListItem
                          sx={{
                            px: 0,
                            "&:not(:last-child)": {
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              pb: 1,
                              mb: 1,
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.2),
                                color: "success.dark",
                              }}
                            >
                              <MonetizationOnIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  {tx.credits} FC {tx.type}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {tx.date}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 0.5,
                                }}
                              >
                                <Chip
                                  label={tx.method}
                                  size="small"
                                  color={getScoreColor(tx.score)}
                                  sx={{ mr: 1 }}
                                />
                                <Typography variant="caption">
                                  Score: {tx.score}/100
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      p: 4,
                    }}
                  >
                    <ReceiptIcon
                      sx={{
                        fontSize: 48,
                        color: "text.disabled",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography color="text.secondary">
                      No transactions yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Calculate your first carbon credits to see data here
                    </Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Credit Sources */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div whileHover={{ y: -5 }}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.warning.light,
                    0.2
                  )} 0%, ${alpha(theme.palette.warning.light, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "warning.dark",
                  }}
                >
                  <PieChartIcon sx={{ mr: 1 }} />
                  Credit Sources
                </Typography>
                {carbonData.creditSources.length > 0 ? (
                  <>
                    <Box sx={{ height: 250, mt: 2 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={carbonData.creditSources}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {carbonData.creditSources.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  [
                                    theme.palette.primary.main,
                                    theme.palette.success.main,
                                    theme.palette.warning.main,
                                    theme.palette.error.main,
                                  ][index % 4]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value} FC`, "Credits"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 2,
                        justifyContent: "center",
                      }}
                    >
                      {carbonData.creditSources.map((source, index) => (
                        <Chip
                          key={source.name}
                          label={`${source.name}: ${source.value} FC`}
                          size="small"
                          sx={{
                            backgroundColor: alpha(
                              [
                                theme.palette.primary.main,
                                theme.palette.success.main,
                                theme.palette.warning.main,
                                theme.palette.error.main,
                              ][index % 4],
                              0.2
                            ),
                            color: [
                              theme.palette.primary.dark,
                              theme.palette.success.dark,
                              theme.palette.warning.dark,
                              theme.palette.error.dark,
                            ][index % 4],
                            fontWeight: "bold",
                          }}
                        />
                      ))}
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      p: 4,
                    }}
                  >
                    <PieChartIcon
                      sx={{
                        fontSize: 48,
                        color: "text.disabled",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography color="text.secondary">
                      No credit sources data
                    </Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Credit History Chart */}
          <Grid item xs={12}>
            <motion.div whileHover={{ y: -5 }}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.light,
                    0.2
                  )} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "primary.dark",
                  }}
                >
                  <TimelineIcon sx={{ mr: 1 }} />
                  Credit History (Last 6 Months)
                </Typography>
                {carbonData.creditHistory.some((m) => m.credits > 0) ? (
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={carbonData.creditHistory}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={alpha(theme.palette.divider, 0.3)}
                        />
                        <XAxis
                          dataKey="month"
                          stroke={theme.palette.text.secondary}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          label={{
                            value: "Credits (FC)",
                            angle: -90,
                            position: "insideLeft",
                            fill: theme.palette.text.secondary,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: theme.shape.borderRadius,
                            boxShadow: theme.shadows[3],
                          }}
                          formatter={(value) => [`${value} FC`, "Credits"]}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="credits"
                          stroke={theme.palette.success.main}
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                          name="Credits Earned"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <TimelineIcon
                      sx={{
                        fontSize: 48,
                        color: "text.disabled",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography color="text.secondary">
                      No credit history available
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Your credit history will appear here after calculations
                    </Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mt: 4,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<MonetizationOnIcon />}
            sx={{
              px: 6,
              borderRadius: 5,
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
              boxShadow: theme.shadows[4],
            }}
            disabled={carbonData.totalCredits === 0}
          >
            Redeem Credits
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<BarChartIcon />}
            sx={{
              px: 6,
              borderRadius: 5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: theme.shadows[4],
            }}
          >
            View Marketplace
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            startIcon={<CloseIcon />}
            onClick={onClose}
            sx={{ px: 6, borderRadius: 5 }}
          >
            Back to Calculator
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
