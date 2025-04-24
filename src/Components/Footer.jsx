import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Stack,
  IconButton,
  Container,
  GlobalStyles,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Pinterest,
} from "@mui/icons-material";
import footerBg from "../assets/FooterBg.png";

const Footer = () => {
  return (
    <>
      <GlobalStyles styles={{ body: { overflowX: "hidden" } }} />

      <Box
        sx={{
          backgroundImage: `url(${footerBg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          color: "black", // default text color
          mt: 8,
          py: 6,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ color: "black" }}>
            <Grid container spacing={24}>
              {/* Contact Us */}
              <Grid item xs={12} sm={10} md={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Contact us
                </Typography>
                <Typography variant="body2">
                  <strong>Call us:</strong> Mon - Fri, 9:30 AM - 5:50 PM
                </Typography>
                <Typography variant="body2" fontWeight="bold" mt={1}>
                  Contact No: <br />
                  9876543210, 8765432109,
                  <br />
                  7654321098, 6543210987
                </Typography>
                <Typography variant="body2" mt={1}>
                  Address: <br />
                  E-Commerce Division, MAIDC, <br />
                  Krushi Udyog Bhavan, Dinkarrao Desai Marg,
                  <br />
                  Aarey Milk Colony, Goregaon (E), Mumbai - 400065
                </Typography>
                <Typography variant="body2" mt={1}>
                  Email us at: <br />
                  <Link href="mailto:support@mahaagromart.com" underline="hover" sx={{ color: "black" }}>
                    support@mahaagromart.com
                  </Link>
                  <br />
                  <Link href="mailto:info@mahaagromart.com" underline="hover" sx={{ color: "black" }}>
                    info@mahaagromart.com
                  </Link>
                </Typography>
                <Stack direction="row" spacing={1} mt={22}>
                  {[Facebook, LinkedIn, Twitter, Instagram, Pinterest].map(
                    (Icon, idx) => (
                      <IconButton key={idx} sx={{ color: "white" }}>
                        <Icon fontSize="small" />
                      </IconButton>
                    )
                  )}
                </Stack>
              </Grid>

              {/* Seller Links */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  SELLER LINKS
                </Typography>
                <Stack spacing={1}>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Seller List</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Seller Login</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Become A Seller</Link>
                </Stack>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  QUICK LINKS
                </Typography>
                <Stack spacing={1}>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>About us</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Contact</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>FAQ</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Terms & Conditions</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Privacy Policy</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Download our app</Link>
                </Stack>
              </Grid>

              {/* Account & Shipping Info */}
              <Grid item xs={10} sm={6} md={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  ACCOUNT & SHIPPING INFO
                </Typography>
                <Stack spacing={1}>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Profile Info</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Wish List</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Track Order</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Refund Policy</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Return Policy</Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>Cancellation Policy</Link>
                </Stack>
              </Grid>
            </Grid>

            {/* Footer Bottom Bar */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              mt={5}
              px={2}
              py={2}
              sx={{
                borderTop: "1px solid #ccc",
                backgroundColor: "transparent",
              }}
            >
              <Typography variant="body2" sx={{ color: "white" }}>
                Designed and Developed by Visionary Minds
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                Over 1,43,143 visits to our website!
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
