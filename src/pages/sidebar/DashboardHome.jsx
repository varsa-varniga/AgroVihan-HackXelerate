import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  MonetizationOn as MonetizationOnIcon,
  AccountCircle as AccountCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Nature as NatureIcon,
  Verified as VerifiedIcon,
  Link as LinkIcon,
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFarmerRecords,
  getBlockExplorerUrl,
} from "../../utils/blockchainUtils";

const DashboardHome = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "totalCredits",
    direction: "desc",
  });
  const [blockchainData, setBlockchainData] = useState({});
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [blockchainError, setBlockchainError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const DOLLAR_PER_CREDIT = 4.75;

  // Define fetchUserData outside useEffect so it can be referenced elsewhere
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userCollection = collection(db, "carbonCalculations");
      // Always get all user data regardless of who is logged in
      const querySnapshot = await getDocs(userCollection);

      // Process data to get unique users with their total credits
      const userMap = new Map();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const email = data.email;
        const username = data.username || "Anonymous";
        const totalCredits = data.totalCredits || 0;
        const lastCalculation = data.timestamp?.toDate() || new Date();
        const blockchainVerified = data.blockchainVerified || false;
        const txHash = data.txHash || null;
        const walletAddress = data.walletAddress || null;
        const blockchainTimestamp = data.blockchainTimestamp?.toDate() || null;

        if (userMap.has(email)) {
          const user = userMap.get(email);
          if (totalCredits > user.totalCredits) {
            user.totalCredits = totalCredits;
          }
          if (lastCalculation > user.lastCalculation) {
            user.lastCalculation = lastCalculation;
          }
          // Update blockchain verification if available
          if (blockchainVerified && !user.blockchainVerified) {
            user.blockchainVerified = blockchainVerified;
            user.txHash = txHash;
            user.walletAddress = walletAddress;
            user.blockchainTimestamp = blockchainTimestamp;
          }
        } else {
          userMap.set(email, {
            email,
            username,
            totalCredits,
            lastCalculation,
            carbonScore: data.carbonScore || 0,
            walletAddress,
            txHash,
            blockchainVerified,
            blockchainTimestamp,
          });
        }
      });

      // Convert map to array
      const usersArray = Array.from(userMap.values());
      setUsers(usersArray);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Always fetch all user data, regardless of auth state
      fetchUserData();
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch blockchain data for a user
  const fetchBlockchainData = async (user) => {
    if (!user.walletAddress) {
      console.warn(
        `No wallet address found for user ${user.email}. Skipping blockchain data fetch.`
      );
      return;
    }

    setBlockchainLoading(true);
    setBlockchainError(null);
    try {
      // Fetch farmer records from the blockchain
      const records = await getFarmerRecords(user.walletAddress);
      console.log(`Blockchain records fetched for ${user.email}:`, records);

      // If records exist, store them in the state
      if (records && records.length > 0) {
        setBlockchainData((prevData) => ({
          ...prevData,
          [user.email]: records,
        }));
      } else {
        console.log(`No blockchain records found for user ${user.email}.`);
        setBlockchainData((prevData) => ({ ...prevData, [user.email]: [] }));
      }
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
      setBlockchainError(error.message || "Failed to fetch blockchain data.");
    } finally {
      setBlockchainLoading(false);
    }
  };

  // New useEffect to handle blockchain data fetching for all verified users
  useEffect(() => {
    // Only run this if we have users loaded
    if (users.length > 0) {
      // Find all users that need blockchain data fetched
      users.forEach((user) => {
        if (
          user.blockchainVerified &&
          user.walletAddress &&
          !blockchainData[user.email]
        ) {
          console.log(`Fetching blockchain data for ${user.email}`);
          fetchBlockchainData(user);
        } else {
          console.log(
            `Skipping blockchain data fetch for ${user.email}. Conditions not met.`
          );
        }
      });
    }
  }, [users, blockchainData]);

  const handlePurchaseClick = (user) => {
    setSelectedUser(user);
    setPurchaseDialogOpen(true);
    setPurchaseAmount(1);
  };

  const handlePurchaseConfirm = () => {
    // In a real application, this would connect to a payment processor
    alert(
      `Purchase confirmed for ${purchaseAmount} credits from ${
        selectedUser.email
      } for $${(purchaseAmount * DOLLAR_PER_CREDIT).toFixed(2)}`
    );
    setPurchaseDialogOpen(false);
  };

  const calculateTotalValue = (credits) => {
    return (credits * DOLLAR_PER_CREDIT).toFixed(2);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // New function to render blockchain verification status
  const renderBlockchainStatus = (user) => {
    if (user.blockchainVerified && user.txHash) {
      return (
        <Box
          sx={{
            p: 2,
            bgcolor: "#f0f7f0",
            borderTop: "1px solid #c8e6c9",
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <VerifiedIcon
              sx={{
                color: theme.palette.success.main,
                mr: 0.5,
              }}
            />
            Blockchain Verified
            <Chip
              size="small"
              label="Verified"
              color="success"
              sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
            />
          </Typography>

          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <b>Transaction:</b>{" "}
            <a
              href={getBlockExplorerUrl(user.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {user.txHash.substring(0, 6)}...
              {user.txHash.substring(user.txHash.length - 4)}
              <LinkIcon sx={{ fontSize: 14, ml: 0.5 }} />
            </a>
          </Typography>

          {user.blockchainTimestamp && (
            <Typography variant="body2">
              <b>Verified on:</b> {formatDate(user.blockchainTimestamp)}
            </Typography>
          )}
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            p: 2,
            bgcolor: "#f5f5f5",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ErrorOutlineIcon
              sx={{
                color: theme.palette.warning.main,
                mr: 0.5,
              }}
            />
            Blockchain Status
            <Chip
              size="small"
              label="Pending"
              color="warning"
              sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Not yet verified in blockchain
          </Typography>
        </Box>
      );
    }
  };

  // New function to render certificate data
  const renderCertificateData = (user) => {
    if (user.blockchainVerified && user.txHash) {
      // Get farming practices from blockchain data if available
      let farmingPractices = "Sustainable Farming Practices";

      // If we have blockchain data for this user, use it to extract practices
      if (blockchainData[user.email]?.length > 0) {
        // This is a placeholder - in a real app, you'd extract the actual practices from blockchain data
        farmingPractices = "Data from blockchain";
      }

      return (
        <Box
          sx={{
            p: 2,
            bgcolor: "#fff",
            borderTop: "1px solid #e0e0e0",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <VerifiedIcon
              sx={{
                color: theme.palette.success.main,
                mr: 0.5,
              }}
            />
            Digital Carbon Credit Certificate
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              bgcolor: "#f9fbf9",
              border: "1px solid #e6f0e6",
              borderRadius: 1,
              fontSize: "0.875rem",
            }}
          >
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              🌱 <b>Farmer:</b> {user.username}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              📦 <b>Practices:</b>{" "}
              {user.rainwaterHarvesting
                ? "Rainwater Harvesting"
                : "Sustainable Farming"}
              {user.solarPumps > 0 ? ", Solar Pumps" : ""}
              {user.organicFertilizerAcres > 0 ? ", Organic Fertilizer" : ""}
              {user.noTillAcres > 0 ? ", No-Till Farming" : ""}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              🌍 <b>Carbon Credits:</b> {user.totalCredits}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              🕒 <b>Timestamp:</b>{" "}
              {formatDate(user.blockchainTimestamp || user.lastCalculation)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              ✅ <b>Status:</b> Success (Confirmed)
            </Typography>
            <Typography variant="body2">
              🔗 <b>View:</b>{" "}
              <a
                href={getBlockExplorerUrl(user.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  fontWeight: "medium",
                }}
              >
                Blockchain Explorer
              </a>
            </Typography>
          </Paper>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4f5e8 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              background: "linear-gradient(to right, #388e3c, #2e7d32)",
              color: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <NatureIcon sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Carbon Credits Marketplace
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: isMobile ? 2 : 0,
                }}
              >
                <Chip
                  icon={<MonetizationOnIcon />}
                  label={`$${DOLLAR_PER_CREDIT}/Credit`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: "bold",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
              </Box>
            </Box>
          </Paper>

          <Box
            sx={{
              mb: 3,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
            }}
          >
            <TextField
              fullWidth={isMobile}
              placeholder="Search by email or username"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                ),
              }}
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                flexGrow: 1,
              }}
            />

            <Paper
              sx={{
                p: 1,
                display: "flex",
                alignItems: "center",
                bgcolor: "white",
                borderRadius: 1,
              }}
            >
              <FilterListIcon sx={{ color: "text.secondary", mr: 1 }} />
              <Typography variant="body2" sx={{ mr: 2 }}>
                Sort by:
              </Typography>

              <Button
                size="small"
                onClick={() => handleSort("totalCredits")}
                startIcon={
                  sortConfig.key === "totalCredits" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUpwardIcon />
                    ) : (
                      <ArrowDownwardIcon />
                    )
                  ) : null
                }
                sx={{
                  color:
                    sortConfig.key === "totalCredits"
                      ? "primary.main"
                      : "text.secondary",
                  fontWeight:
                    sortConfig.key === "totalCredits" ? "bold" : "normal",
                }}
              >
                Credits
              </Button>

              <Button
                size="small"
                onClick={() => handleSort("lastCalculation")}
                startIcon={
                  sortConfig.key === "lastCalculation" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUpwardIcon />
                    ) : (
                      <ArrowDownwardIcon />
                    )
                  ) : null
                }
                sx={{
                  color:
                    sortConfig.key === "lastCalculation"
                      ? "primary.main"
                      : "text.secondary",
                  fontWeight:
                    sortConfig.key === "lastCalculation" ? "bold" : "normal",
                }}
              >
                Date
              </Button>

              <Button
                size="small"
                onClick={() => handleSort("blockchainVerified")}
                startIcon={
                  sortConfig.key === "blockchainVerified" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUpwardIcon />
                    ) : (
                      <ArrowDownwardIcon />
                    )
                  ) : null
                }
                sx={{
                  color:
                    sortConfig.key === "blockchainVerified"
                      ? "primary.main"
                      : "text.secondary",
                  fontWeight:
                    sortConfig.key === "blockchainVerified" ? "bold" : "normal",
                }}
              >
                Verified
              </Button>
            </Paper>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <CircularProgress color="success" />
              <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>
                Loading carbon credit data...
              </Typography>
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "white",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No carbon credit data found matching your search
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredUsers.map((user, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={`${user.email}-${index}`}
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        borderRadius: 2,
                        height: "100%",
                        overflow: "hidden",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: user.blockchainVerified
                            ? "#e8f5e9"
                            : "#f5f5f5",
                          p: 2,
                          borderBottom: user.blockchainVerified
                            ? "1px solid #c8e6c9"
                            : "1px solid #e0e0e0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: user.blockchainVerified
                                ? theme.palette.success.main
                                : theme.palette.grey[500],
                              color: "white",
                            }}
                          >
                            <AccountCircleIcon />
                          </Avatar>
                          <Box sx={{ ml: 1.5 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              noWrap
                            >
                              {user.username}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ wordBreak: "break-all" }}
                            >
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>

                        <Chip
                          size="small"
                          label={
                            user.carbonScore > 80
                              ? "Excellent"
                              : user.carbonScore > 60
                              ? "Good"
                              : "Basic"
                          }
                          color={
                            user.carbonScore > 80
                              ? "success"
                              : user.carbonScore > 60
                              ? "warning"
                              : "default"
                          }
                          sx={{ fontWeight: "medium" }}
                        />
                      </Box>

                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Available Credits:
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <HistoryIcon
                                fontSize="small"
                                sx={{
                                  color: theme.palette.info.main,
                                  mr: 0.5,
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Last update: {formatDate(user.lastCalculation)}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            color={
                              user.blockchainVerified
                                ? theme.palette.success.dark
                                : theme.palette.text.primary
                            }
                          >
                            {user.totalCredits}
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 0.5 }}
                            >
                              credits
                            </Typography>
                          </Typography>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Total Value:
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <MonetizationOnIcon
                                sx={{ color: "#4caf50", mr: 0.5 }}
                              />
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="primary"
                              >
                                ${calculateTotalValue(user.totalCredits)}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TrendingUpIcon
                              sx={{
                                color: theme.palette.success.main,
                                mr: 0.5,
                              }}
                            />
                            <Typography
                              variant="body2"
                              color={theme.palette.success.main}
                              fontWeight="medium"
                            >
                              ${DOLLAR_PER_CREDIT}/credit
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          color="success"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handlePurchaseClick(user)}
                          disabled={user.totalCredits <= 0}
                          sx={{
                            borderRadius: 50,
                            py: 1,
                            fontWeight: "bold",
                            background:
                              "linear-gradient(to right, #388e3c, #2e7d32)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          Buy Credits
                        </Button>
                      </CardContent>

                      {/* Blockchain Verification Status */}
                      {renderBlockchainStatus(user)}

                      {/* Certificate Data */}
                      {renderCertificateData(user)}
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>
      </Container>

      {/* Purchase Dialog */}
      <Dialog
        open={purchaseDialogOpen}
        onClose={() => setPurchaseDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Buy Carbon Credits</Typography>
            <IconButton onClick={() => setPurchaseDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Seller Information
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                    <AccountCircleIcon />
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedUser.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Show blockchain verification status in dialog */}
                {selectedUser.blockchainVerified && (
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <VerifiedIcon
                      sx={{
                        color: theme.palette.success.main,
                        mr: 0.5,
                        fontSize: "small",
                      }}
                    />
                    <Typography variant="body2" color="success.main">
                      Blockchain Verified
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                >
                  Credit Details
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Paper
                      sx={{ p: 2, textAlign: "center", bgcolor: "#f1f8e9" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Available Credits
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="success.dark"
                      >
                        {selectedUser.totalCredits}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      sx={{ p: 2, textAlign: "center", bgcolor: "#e8f5e9" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Price Per Credit
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="success.dark"
                      >
                        ${DOLLAR_PER_CREDIT}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                >
                  Purchase Amount
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Credits"
                  variant="outlined"
                  value={purchaseAmount}
                  onChange={(e) =>
                    setPurchaseAmount(
                      Math.max(
                        1,
                        Math.min(
                          selectedUser.totalCredits,
                          parseInt(e.target.value) || 1
                        )
                      )
                    )
                  }
                  inputProps={{ min: 1, max: selectedUser.totalCredits }}
                  sx={{ mb: 2 }}
                />

                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                    border: "1px dashed #bdbdbd",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">Credits:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {purchaseAmount}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">Price per Credit:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ${DOLLAR_PER_CREDIT}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Total:
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="success.main"
                    >
                      ${(purchaseAmount * DOLLAR_PER_CREDIT).toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handlePurchaseConfirm}
            startIcon={<ShoppingCartIcon />}
          >
            Complete Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardHome;
