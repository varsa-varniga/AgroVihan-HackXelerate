import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Collapse,
} from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null); // Which answer is open

  const faqItems = [
    {
      question: "How are carbon credits calculated?",
      answer:
        "Credits are based on verified reductions in greenhouse gas emissions from your farming practices compared to conventional methods.",
    },
    {
      question: "Can I combine different sustainable practices?",
      answer:
        "Yes! The calculator accounts for multiple sustainable practices and their combined impact.",
    },
    {
      question: "How do I redeem my credits?",
      answer:
        "Credits can be redeemed through our partner network for discounts or sold on our marketplace.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Box sx={{ mt: 6 }}>
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
        <InfoIcon fontSize="large" /> Frequently Asked Questions
      </Typography>

      <List>
        {faqItems.map((item, index) => (
          <Paper key={index} elevation={0} sx={{ mb: 2, borderRadius: 2 }}>
            <ListItem
              button
              onClick={() => handleToggle(index)}
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#eeeeee",
                },
              }}
            >
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={item.question}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>

            <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, backgroundColor: "#fafafa", borderRadius: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {item.answer}
                </Typography>
              </Box>
            </Collapse>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default FAQSection;
