import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Divider,
  Grid,
  Chip,
  Paper,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Badge,
  Fade,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Calculate as CalculateIcon,
  Agriculture as AgricultureIcon,
  WaterDrop as WaterDropIcon,
  Build as BuildIcon,
  Nature as NatureIcon,
  Link as LinkIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  LocalFlorist as LocalFloristIcon,
  EmojiEvents as EmojiEventsIcon,
  MonetizationOn as MonetizationOnIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Share as ShareIcon,
  AutoGraph as AutoGraphIcon,
  Verified as VerifiedIcon,
  Science as ScienceIcon,
  Park as ParkIcon,
  Grass as GrassIcon,
  ElectricBolt as ElectricBoltIcon,
  EnergySavingsLeaf as EnergySavingsLeafIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import HowItWorks from "../../Components/carboncreditworks";
import FAQ from "../../Components/carboncreditfaq";
import { useState, useEffect } from "react";

import {
  initDB,
  saveCalculationOffline,
  getOfflineCalculations,
  markAsSynced,
  removeCalculation,
} from "../../utils/indexedDBService";
import NetworkStatus from "../../Components/NetworkStatus";

import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import CarbonCreditDashboard from "./carboncreditdashboard";

import {
  connectWallet,
  saveCarbonCreditsToBlockchain,
  getBlockExplorerUrl,
} from "../../utils/blockchainUtils";

const FarmerCarbonCreditCalculator = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    initDB().catch((err) =>
      console.error("Failed to initialize IndexedDB:", err)
    );

    checkOfflineCalculations();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const userEmail = user?.email;
  const username = user?.displayName || "Anonymous";
  const [formData, setFormData] = useState({
    treesPlanted: 0,
    organicFertilizerAcres: 0,
    solarPumps: 0,
    noTillAcres: 0,
    coverCropAcres: 0,
    cowsReduced: 0,
    rainwaterHarvesting: false,
    electricPumps: 0,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedToBlockchain, setSavedToBlockchain] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showDashboard, setShowDashboard] = useState(false);

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingUploads, setPendingUploads] = useState(0);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      const address = await connectWallet();
      setWalletAddress(address);
      setWalletConnected(true);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    }
  };

  const CARBON_CREDIT_RATE = 1000; 
  const CALCULATION_VALUES = {
    treesPlanted: 21,
    organicFertilizer: 110, 
    solarPump: 1500, 
    noTillFarming: 300, 
    coverCropping: 250, 
    cowReduction: 1200, 
    rainwaterHarvesting: 200, 
    electricPump: 1000, 
  };

  const saveCarbonData = async (email, username, carbonCredits, co2Saved) => {
    try {
      console.log("🚀 Saving data for:", email);

      const userCollection = collection(db, "carbonCalculations");


      const q = query(userCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      let totalCredits = carbonCredits;
      let totalCO2 = co2Saved;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.carbonCredits) {
          totalCredits += data.carbonCredits;
        }
        if (data.co2Saved) {
          totalCO2 += data.co2Saved;
        }
      });

      console.log("🧮 Total credits after addition:", totalCredits);

      const calculateScore = (co2Saved) => {
       
        if (co2Saved > 5000) return 90;
        if (co2Saved > 2000) return 75;
        if (co2Saved > 1000) return 60;
        return 50;
      };


      const docRef = await addDoc(userCollection, {
        email,
        username,
        carbonCredits,
        co2Saved,
        creditsEarned: carbonCredits,
        timestamp: Timestamp.now(),
        carbonScore: calculateScore(co2Saved),
        totalCredits,
        totalCO2,
        details: formData,
      });

      console.log("✅ Data saved successfully to Firestore!");
      console.log("📄 Document ID:", docRef.id);
    } catch (error) {
      console.error("❌ Error saving carbon data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const showInfo = (info) => {
    setSelectedInfo(info);
    setOpenInfo(true);
  };

  const calculateCredits = async () => {
    setLoading(true);
    setTimeout(async () => {
      const treesCO2 = formData.treesPlanted * CALCULATION_VALUES.treesPlanted;
      const organicFertCO2 =
        formData.organicFertilizerAcres * CALCULATION_VALUES.organicFertilizer;
      const solarPumpCO2 = formData.solarPumps * CALCULATION_VALUES.solarPump;
      const noTillCO2 = formData.noTillAcres * CALCULATION_VALUES.noTillFarming;
      const coverCropCO2 =
        formData.coverCropAcres * CALCULATION_VALUES.coverCropping;
      const cowReductionCO2 =
        formData.cowsReduced * CALCULATION_VALUES.cowReduction;
      const rainwaterCO2 = formData.rainwaterHarvesting
        ? CALCULATION_VALUES.rainwaterHarvesting
        : 0;
      const electricPumpCO2 =
        formData.electricPumps * CALCULATION_VALUES.electricPump;

      const totalCO2 =
        treesCO2 +
        organicFertCO2 +
        solarPumpCO2 +
        noTillCO2 +
        coverCropCO2 +
        cowReductionCO2 +
        rainwaterCO2 +
        electricPumpCO2;

      const credits = totalCO2 / CARBON_CREDIT_RATE;

      const resultData = {
        totalCO2,
        credits,
        timestamp: new Date().toLocaleString(),
        details: {
          treesCO2,
          organicFertCO2,
          solarPumpCO2,
          noTillCO2,
          coverCropCO2,
          cowReductionCO2,
          rainwaterCO2,
          electricPumpCO2,
        },
      };

      setResults(resultData);

      if (navigator.onLine) {
        try {

          await saveCarbonData(userEmail, username, credits, totalCO2);
        } catch (error) {
          console.error("Failed to save to Firebase, storing offline:", error);

          await saveCalculationOffline({
            email: userEmail,
            username,
            carbonCredits: credits,
            co2Saved: totalCO2,
            details: formData,
          });
          setPendingUploads((prev) => prev + 1);
        }
      } else {

        await saveCalculationOffline({
          email: userEmail,
          username,
          carbonCredits: credits,
          co2Saved: totalCO2,
          details: formData,
        });
        setPendingUploads((prev) => prev + 1);
      }

      setLoading(false);
    }, 1500);
  };

  const saveToBlockchain = async () => {
    if (!walletConnected) {
      try {
        await handleConnectWallet();
      } catch (err) {
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const practiceDetails = {
        treesPlanted: formData.treesPlanted,
        organicFertilizer: formData.organicFertilizerAcres,
        solarPumps: formData.solarPumps,
        noTillAcres: formData.noTillAcres,
        coverCropAcres: formData.coverCropAcres,
        cowsReduced: formData.cowsReduced,
        rainwaterHarvesting: formData.rainwaterHarvesting ? 1 : 0,
        electricPumps: formData.electricPumps,
      };


      const result = await saveCarbonCreditsToBlockchain(
        username || "Anonymous",
        results.credits,
        results.totalCO2,
        practiceDetails
      );


      setTxHash(result.txHash);
      setSavedToBlockchain(true);

      await updateBlockchainStatus(
        userEmail,
        username,
        result.txHash,
        results.credits,
        results.totalCO2
      );


      console.log("Successfully saved to blockchain!", result);
    } catch (err) {
      console.error("Error saving to blockchain:", err);
      setError(err.message || "Failed to save to blockchain");
    } finally {
      setLoading(false);
    }
  };


  const updateBlockchainStatus = async (
    email,
    username,
    txHash,
    carbonCredits,
    co2Saved
  ) => {
    try {
      console.log("🔗 Updating blockchain status for:", email);

      const userCollection = collection(db, "carbonCalculations");

      const q = query(userCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      let mostRecentDoc = null;
      let mostRecentTimestamp = null;

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            !mostRecentTimestamp ||
            (data.timestamp && data.timestamp.toDate() > mostRecentTimestamp)
          ) {
            mostRecentDoc = doc;
            mostRecentTimestamp = data.timestamp
              ? data.timestamp.toDate()
              : null;
          }
        });

        if (mostRecentDoc) {
          const docRef = doc(db, "carbonCalculations", mostRecentDoc.id);

          await updateDoc(docRef, {
            blockchainVerified: true,
            txHash: txHash,
            blockchainTimestamp: Timestamp.now(),
            walletAddress: walletAddress,
          });

          console.log(
            "✅ Existing document updated with blockchain verification!"
          );
        }
      }

      const verificationRecord = await addDoc(userCollection, {
        email,
        username,
        carbonCredits,
        co2Saved,
        blockchainVerified: true,
        txHash: txHash,
        blockchainTimestamp: Timestamp.now(),
        walletAddress: walletAddress,
        details: formData, 
        timestamp: Timestamp.now(),
        verificationRecord: true, 
      });

      console.log("✅ Blockchain verification record saved to Firestore!");
      console.log("📄 Verification Document ID:", verificationRecord.id);
    } catch (error) {
      console.error("❌ Error saving blockchain data:", error);

    }
  };

  const viewOnExplorer = () => {
    if (txHash) {
      window.open(getBlockExplorerUrl(txHash), "_blank");
    } else {
      alert("No transaction has been made yet.");
    }
  };

  const shareResults = () => {
    alert("Share functionality would be implemented here");
  };


  const getImpactStatements = (co2) => {
    const statements = [];
    const treesEquivalent = Math.round(co2 / CALCULATION_VALUES.treesPlanted);
    const carsEquivalent = (co2 / 2000).toFixed(1);

    if (treesEquivalent > 0) {
      statements.push(`Equivalent to ${treesEquivalent} trees planted`);
    }
    if (carsEquivalent > 0.1) {
      statements.push(
        `Like removing ${carsEquivalent} cars from the road for a year`
      );
    }

    return statements;
  };

  const checkOfflineCalculations = async () => {
    try {
      const offlineData = await getOfflineCalculations();
      const unsyncedData = offlineData.filter((item) => !item.synced);
      setPendingUploads(unsyncedData.length);
    } catch (error) {
      console.error("Failed to check offline calculations:", error);
    }
  };

  const syncOfflineData = async () => {
    if (!navigator.onLine) return;

    try {
      const offlineData = await getOfflineCalculations();
      const unsyncedData = offlineData.filter((item) => !item.synced);

      if (unsyncedData.length === 0) return;

      setLoading(true);

      for (const item of unsyncedData) {
  
        await saveCarbonData(
          item.email,
          item.username,
          item.carbonCredits,
          item.co2Saved
        );


        await markAsSynced(item.id);
      }

    
      setPendingUploads(0);
      setLoading(false);
    } catch (error) {
      console.error("Failed to sync offline data:", error);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        pt: 2,
        pb: 6,
      }}
    >
      <NetworkStatus pendingUploads={pendingUploads} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            elevation={isMobile ? 0 : 6}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: isMobile ? "none" : "0 15px 30px rgba(0,0,0,0.1)",
              border: isMobile ? "none" : "1px solid rgba(46, 125, 50, 0.1)",
            }}
          >
            <Box
              sx={{
                py: 4,
                px: isMobile ? 2 : 4,
                background: "linear-gradient(to right, #388e3c, #2e7d32)",
                textAlign: "center",
                color: "white",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  fontSize: isMobile ? "2rem" : "2.5rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                Carbon Credit Calculator
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ opacity: 0.9, fontSize: isMobile ? "0.9rem" : "1rem" }}
              >
                Estimate your environmental impact and earn rewards for
                sustainable farming
              </Typography>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: 20,
                  backgroundImage:
                    "url('data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'><path d='M0,20 Q25,10 50,20 T100,5 L100,20 Z' fill='%23f5f7fa'/></svg>')",
                  backgroundSize: "100% 100%",
                }}
              />
            </Box>

            <CardContent sx={{ p: isMobile ? 2 : 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Trees Planted"
                    name="treesPlanted"
                    type="number"
                    value={formData.treesPlanted}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <ParkIcon sx={{ color: "#388e3c", mr: 1 }} />
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            showInfo(
                              "Each tree planted absorbs approximately 21 kg of CO₂ per year"
                            )
                          }
                        >
                          <InfoIcon color="action" />
                        </IconButton>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#81c784",
                        },
                        "&:hover fieldset": {
                          borderColor: "#66bb6a",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Acres Using Organic Fertilizers"
                    name="organicFertilizerAcres"
                    type="number"
                    value={formData.organicFertilizerAcres}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <NatureIcon sx={{ color: "#388e3c", mr: 1 }} />
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            showInfo(
                              "Organic fertilizers reduce nitrous oxide emissions, saving ~110 kg CO₂ per acre per year"
                            )
                          }
                        >
                          <InfoIcon color="action" />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Solar Pumps"
                    name="solarPumps"
                    type="number"
                    value={formData.solarPumps}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <ElectricBoltIcon sx={{ color: "#388e3c", mr: 1 }} />
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            showInfo(
                              "Each solar pump replaces a diesel pump, saving ~1,500 kg CO₂ per year"
                            )
                          }
                        >
                          <InfoIcon color="action" />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Acres of No-Till Farming"
                    name="noTillAcres"
                    type="number"
                    value={formData.noTillAcres}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <GrassIcon sx={{ color: "#388e3c", mr: 1 }} />
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            showInfo(
                              "No-till farming reduces soil carbon loss, saving ~300 kg CO₂ per acre per year"
                            )
                          }
                        >
                          <InfoIcon color="action" />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Acres of Cover Cropping"
                    name="coverCropAcres"
                    type="number"
                    value={formData.coverCropAcres}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <LocalFloristIcon sx={{ color: "#388e3c", mr: 1 }} />
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            showInfo(
                              "Cover cropping adds organic matter to soil, saving ~250 kg CO₂ per acre per year"
                            )
                          }
                        >
                          <InfoIcon color="action" />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cows Reduced (Methane Management)"
                    name="cowsReduced"
                    type="number"
                    value={formData.cowsReduced}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <AgricultureIcon sx={{ color: "#388e3c", mr: 1 }} />
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            showInfo(
                              "Each cow reduced saves ~1,200 kg CO₂ equivalent per year from methane emissions"
                            )
                          }
                        >
                          <InfoIcon color="action" />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                {/* Rainwater Harvesting */}
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid rgba(0, 0, 0, 0.23)",
                      borderRadius: "4px",
                      padding: "16.5px 14px",
                      backgroundColor: formData.rainwaterHarvesting
                        ? "#e8f5e9"
                        : "inherit",
                    }}
                  >
                    <WaterDropIcon sx={{ color: "#388e3c", mr: 1 }} />
                    <Typography sx={{ flexGrow: 1 }}>
                      Rainwater Harvesting
                    </Typography>
                    <IconButton
                      onClick={() =>
                        showInfo(
                          "Rainwater harvesting reduces energy for water pumping, saving ~200 kg CO₂ per year"
                        )
                      }
                      sx={{ mr: 1 }}
                    >
                      <InfoIcon color="action" />
                    </IconButton>
                    <Button
                      variant={
                        formData.rainwaterHarvesting ? "contained" : "outlined"
                      }
                      color="success"
                      size="small"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          rainwaterHarvesting: !prev.rainwaterHarvesting,
                        }))
                      }
                    >
                      {formData.rainwaterHarvesting ? "Yes" : "No"}
                    </Button>
                  </Box>
                </Grid>

                {/* Electric Pumps */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Electric Pumps (replacing diesel)"
                    name="electricPumps"
                    type="number"
                    value={formData.electricPumps}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <EnergySavingsLeafIcon
                          sx={{ color: "#388e3c", mr: 1 }}
                        />
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            showInfo(
                              "Each electric pump replacing diesel saves ~1,000 kg CO₂ per year"
                            )
                          }
                        >
                          <InfoIcon color="action" />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Calculate Button */}
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CalculateIcon />}
                    onClick={calculateCredits}
                    disabled={loading}
                    sx={{
                      py: 2,
                      px: 6,
                      borderRadius: 50,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: "0 4px 8px rgba(46, 125, 50, 0.3)",
                      "&:hover": {
                        boxShadow: "0 6px 12px rgba(46, 125, 50, 0.4)",
                      },
                      background: "linear-gradient(to right, #388e3c, #43a047)",
                      minWidth: isMobile ? "100%" : "auto",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Calculate Carbon Credits"
                    )}
                  </Button>
                </motion.div>
              </Box>

              {/* Results Section */}
              {results && (
                <Fade in={true} timeout={500}>
                  <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 3 }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        mb: 3,
                        color: "#2e7d32",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <EmojiEventsIcon fontSize="large" /> Calculation Results
                    </Typography>

                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        background:
                          "linear-gradient(to bottom right, #e8f5e9, #f1f8e9)",
                        border: "1px solid rgba(46, 125, 50, 0.2)",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 100,
                          height: 100,
                          background: "rgba(46, 125, 50, 0.05)",
                          borderRadius: "50%",
                          transform: "translate(30%, -30%)",
                        },
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <MonetizationOnIcon
                              sx={{ color: "#388e3c", mr: 1, fontSize: "2rem" }}
                            />
                            <Box>
                              <Typography variant="body1">
                                <span style={{ fontWeight: "bold" }}>
                                  Carbon Credits Earned:
                                </span>
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ fontWeight: "bold", mt: 0.5 }}
                              >
                                {results.credits.toFixed(2)} CC
                              </Typography>
                              <Typography variant="caption">
                                (1 CC = 1,000 kg CO₂ saved)
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AutoGraphIcon
                              sx={{ color: "#388e3c", mr: 1, fontSize: "2rem" }}
                            />
                            <Box>
                              <Typography variant="body1">
                                <span style={{ fontWeight: "bold" }}>
                                  Total CO₂ Saved:
                                </span>
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ fontWeight: "bold", mt: 0.5 }}
                              >
                                {results.totalCO2.toFixed(0)} kg
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <AccessTimeIcon sx={{ color: "#388e3c", mr: 1 }} />
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              Calculated on: {results.timestamp}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Environmental Impact Statements */}
                        {getImpactStatements(results.totalCO2).map(
                          (statement, index) => (
                            <Grid item xs={12} key={index}>
                              <Chip
                                label={statement}
                                color="success"
                                variant="outlined"
                                sx={{ mr: 1, mb: 1 }}
                                icon={<CheckCircleIcon />}
                              />
                            </Grid>
                          )
                        )}
                      </Grid>

                      {/* Detailed Breakdown */}
                      <Box
                        sx={{ mt: 3, pt: 2, borderTop: "1px dashed #c8e6c9" }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "text.secondary", mb: 1 }}
                        >
                          DETAILED BREAKDOWN
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              sx={{
                                p: 1,
                                backgroundColor: alpha(
                                  theme.palette.success.light,
                                  0.2
                                ),
                              }}
                            >
                              <Box display="flex" alignItems="center">
                                <ParkIcon sx={{ color: "#388e3c", mr: 1 }} />
                                <Box>
                                  <Typography variant="caption" display="block">
                                    Trees Planted
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {formData.treesPlanted} trees ={" "}
                                    {results.details.treesCO2} kg CO₂
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              sx={{
                                p: 1,
                                backgroundColor: alpha(
                                  theme.palette.success.light,
                                  0.2
                                ),
                              }}
                            >
                              <Box display="flex" alignItems="center">
                                <NatureIcon sx={{ color: "#388e3c", mr: 1 }} />
                                <Box>
                                  <Typography variant="caption" display="block">
                                    Organic Fertilizer
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {formData.organicFertilizerAcres} acres ={" "}
                                    {results.details.organicFertCO2} kg CO₂
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              sx={{
                                p: 1,
                                backgroundColor: alpha(
                                  theme.palette.success.light,
                                  0.2
                                ),
                              }}
                            >
                              <Box display="flex" alignItems="center">
                                <ElectricBoltIcon
                                  sx={{ color: "#388e3c", mr: 1 }}
                                />
                                <Box>
                                  <Typography variant="caption" display="block">
                                    Solar Pumps
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {formData.solarPumps} pumps ={" "}
                                    {results.details.solarPumpCO2} kg CO₂
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              sx={{
                                p: 1,
                                backgroundColor: alpha(
                                  theme.palette.success.light,
                                  0.2
                                ),
                              }}
                            >
                              <Box display="flex" alignItems="center">
                                <GrassIcon sx={{ color: "#388e3c", mr: 1 }} />
                                <Box>
                                  <Typography variant="caption" display="block">
                                    No-Till Farming
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {formData.noTillAcres} acres ={" "}
                                    {results.details.noTillCO2} kg CO₂
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              sx={{
                                p: 1,
                                backgroundColor: alpha(
                                  theme.palette.success.light,
                                  0.2
                                ),
                              }}
                            >
                              <Box display="flex" alignItems="center">
                                <LocalFloristIcon
                                  sx={{ color: "#388e3c", mr: 1 }}
                                />
                                <Box>
                                  <Typography variant="caption" display="block">
                                    Cover Cropping
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {formData.coverCropAcres} acres ={" "}
                                    {results.details.coverCropCO2} kg CO₂
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                          {formData.cowsReduced > 0 && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Paper
                                sx={{
                                  p: 1,
                                  backgroundColor: alpha(
                                    theme.palette.success.light,
                                    0.2
                                  ),
                                }}
                              >
                                <Box display="flex" alignItems="center">
                                  <AgricultureIcon
                                    sx={{ color: "#388e3c", mr: 1 }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      Cows Reduced
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="bold"
                                    >
                                      {formData.cowsReduced} cows ={" "}
                                      {results.details.cowReductionCO2} kg CO₂
                                    </Typography>
                                  </Box>
                                </Box>
                              </Paper>
                            </Grid>
                          )}
                          {formData.rainwaterHarvesting && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Paper
                                sx={{
                                  p: 1,
                                  backgroundColor: alpha(
                                    theme.palette.success.light,
                                    0.2
                                  ),
                                }}
                              >
                                <Box display="flex" alignItems="center">
                                  <WaterDropIcon
                                    sx={{ color: "#388e3c", mr: 1 }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      Rainwater Harvesting
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="bold"
                                    >
                                      = {results.details.rainwaterCO2} kg CO₂
                                    </Typography>
                                  </Box>
                                </Box>
                              </Paper>
                            </Grid>
                          )}
                          {formData.electricPumps > 0 && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Paper
                                sx={{
                                  p: 1,
                                  backgroundColor: alpha(
                                    theme.palette.success.light,
                                    0.2
                                  ),
                                }}
                              >
                                <Box display="flex" alignItems="center">
                                  <EnergySavingsLeafIcon
                                    sx={{ color: "#388e3c", mr: 1 }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      Electric Pumps
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="bold"
                                    >
                                      {formData.electricPumps} pumps ={" "}
                                      {results.details.electricPumpCO2} kg CO₂
                                    </Typography>
                                  </Box>
                                </Box>
                              </Paper>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Paper>

                    {/* Blockchain Actions */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "text.secondary",
                        mb: 2,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <LinkIcon /> Blockchain Actions
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <motion.div whileHover={{ y: -2 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={
                              savedToBlockchain ? (
                                <VerifiedIcon />
                              ) : (
                                <LinkIcon />
                              )
                            }
                            onClick={saveToBlockchain}
                            disabled={loading || savedToBlockchain}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: "bold",
                              background: savedToBlockchain
                                ? "linear-gradient(to right, #4caf50, #388e3c)"
                                : "linear-gradient(to right, #1976d2, #1565c0)",
                            }}
                          >
                            {loading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : savedToBlockchain ? (
                              "Saved to Blockchain"
                            ) : (
                              "Save to Blockchain"
                            )}
                          </Button>
                        </motion.div>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <motion.div whileHover={{ y: -2 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            startIcon={<VisibilityIcon />}
                            onClick={viewOnExplorer}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: "bold",
                              borderColor: "#7b1fa2",
                              color: "#7b1fa2",
                              "&:hover": {
                                borderColor: "#6a1b9a",
                                backgroundColor: "rgba(123, 31, 162, 0.04)",
                              },
                            }}
                          >
                            View on Explorer
                          </Button>
                        </motion.div>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <motion.div whileHover={{ y: -2 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="inherit"
                            startIcon={<ShareIcon />}
                            onClick={shareResults}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: "bold",
                              borderColor: "#757575",
                              color: "#424242",
                              "&:hover": {
                                borderColor: "#616161",
                                backgroundColor: "rgba(117, 117, 117, 0.04)",
                              },
                            }}
                          >
                            Share Results
                          </Button>
                        </motion.div>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <motion.div whileHover={{ y: -2 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="info"
                            startIcon={<AutoGraphIcon />}
                            onClick={() => {
                              setShowDashboard(true);
                              // Optionally refresh data when opening dashboard
                              if (user?.email) fetchUserCarbonData(user.email);
                            }}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: "bold",
                              background:
                                "linear-gradient(to right, #00acc1, #00838f)",
                            }}
                          >
                            View Dashboard
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>

                    {/* Transaction Info */}
                    {savedToBlockchain && (
                      <Zoom in={savedToBlockchain}>
                        <Box
                          sx={{
                            mt: 3,
                            p: 3,
                            backgroundColor: "#e3f2fd",
                            borderRadius: 2,
                            borderLeft: "4px solid #1976d2",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              opacity: 0.1,
                              "& svg": {
                                fontSize: 100,
                                color: theme.palette.primary.main,
                              },
                            }}
                          >
                            <VerifiedIcon />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ color: "#0d47a1", fontWeight: "medium" }}
                          >
                            <VerifiedIcon
                              sx={{ verticalAlign: "middle", mr: 1 }}
                            />
                            Your carbon credits have been securely recorded on
                            the Polygon blockchain.
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#0d47a1",
                              mt: 1,
                              fontFamily: "monospace",
                            }}
                          >
                            Transaction ID:{" "}
                            {txHash
                              ? txHash.substring(0, 6) +
                                "..." +
                                txHash.substring(txHash.length - 4)
                              : "0x7d3...4f2a"}
                          </Typography>
                          {error && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "error.main",
                                mt: 1,
                              }}
                            >
                              Error: {error}
                            </Typography>
                          )}
                        </Box>
                      </Zoom>
                    )}
                  </Box>
                </Fade>
              )}

              {/* Sync Notification */}
              {pendingUploads > 0 && !isOnline && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "#fff3e0",
                    borderRadius: 2,
                    borderLeft: "4px solid #ff9800",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <WifiOffIcon sx={{ mr: 1, color: "#ff9800" }} />
                    {pendingUploads} calculation{pendingUploads > 1 ? "s" : ""}{" "}
                    saved offline. Data will sync automatically when connected
                    to the internet.
                  </Typography>
                </Box>
              )}

              {/* Sync Success Notification */}
              {isOnline && pendingUploads === 0 && (
                <Fade in timeout={300}>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: "#e8f5e9",
                      borderRadius: 2,
                      borderLeft: "4px solid #4caf50",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleIcon sx={{ mr: 1, color: "#4caf50" }} />
                    <Typography variant="body2">
                      All data synced with the server.
                    </Typography>
                  </Box>
                </Fade>
              )}

              {/* How It Works Section */}
              <HowItWorks isMobile={isMobile} theme={theme} />

              {/* FAQ Section */}
              <FAQ />
            </CardContent>
          </Card>
        </motion.div>
      </Container>
      {showDashboard && (
        <CarbonCreditDashboard onClose={() => setShowDashboard(false)} />
      )}

      {/* Info Dialog */}
      <Dialog
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>
          <Box display="flex" alignItems="center">
            <InfoIcon sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Information
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography>{selectedInfo}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenInfo(false)}
            color="success"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmerCarbonCreditCalculator;
