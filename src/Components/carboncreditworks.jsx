import React from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import {
  Nature as NatureIcon,
  Link as LinkIcon,
  MonetizationOn as MonetizationOnIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

const HowItWorks = ({ isMobile }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 6, pt: 4, borderTop: "1px solid #e0e0e0" }}>
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
        <NatureIcon fontSize="large" /> How It Works
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 4,
          lineHeight: 1.8,
          fontSize: "1.1rem",
        }}
      >
        Our calculator estimates your carbon footprint based on farming
        practices. Sustainable methods earn you FarmCarbon Credits (FC) that can
        be traded or used for rewards in our ecosystem. Each credit represents 1
        ton of CO₂ equivalent reduced or sequestered through your sustainable
        practices.
      </Typography>

      <Stepper
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}
        connector={
          isMobile ? null : (
            <Divider
              sx={{
                height: 2,
                backgroundColor: theme.palette.success.light,
                mx: -2,
              }}
            />
          )
        }
      >
        {[
          "Select Farming Practices",
          "Calculate Carbon Score",
          "Earn Carbon Credits",
          "Save to Blockchain",
          "Redeem or Trade",
        ].map((label, index) => (
          <Step key={label} active>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    boxShadow: theme.shadows[2],
                  }}
                >
                  {index + 1}
                </Box>
              )}
              sx={{
                "& .MuiStepLabel-label": {
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ y: -5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                backgroundColor: "#f1f8e9",
                border: "1px solid #c8e6c9",
                transition: "all 0.3s ease",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#2e7d32",
                }}
              >
                <NatureIcon sx={{ mr: 1, fontSize: "2rem" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Sustainable Practices
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Organic fertilizers, efficient irrigation, and eco-friendly
                equipment earn more credits and help protect the environment
                while improving soil health and biodiversity.
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ y: -5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                backgroundColor: "#e8f5e9",
                border: "1px solid #a5d6a7",
                transition: "all 0.3s ease",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#2e7d32",
                }}
              >
                <LinkIcon sx={{ mr: 1, fontSize: "2rem" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Blockchain Secured
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                All credits are immutably recorded on Polygon blockchain,
                ensuring transparency and security for all transactions with
                minimal gas fees and fast confirmation times.
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ y: -5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                backgroundColor: "#e0f7fa",
                border: "1px solid #b2ebf2",
                transition: "all 0.3s ease",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#00838f",
                }}
              >
                <MonetizationOnIcon sx={{ mr: 1, fontSize: "2rem" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Economic Benefits
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Earn rewards for sustainable farming practices. Credits can be
                traded for cash, farming equipment discounts, or other benefits
                in our partner network, creating additional revenue streams.
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HowItWorks;
