// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4caf50',           // Green (SpaIcon, primary action)
      light: '#81c784',          // Lighter variant (UploadBox, Hover)
      dark: '#388e3c',           // Used in title text shadow
    },
    success: {
      main: '#2e7d32',           // Darker success green
      light: '#a5d6a7',          // Lighter hover/hover bg
    },
    error: {
      main: '#c62828',           // Disease high-confidence bar
    },
    warning: {
      main: '#f9a825',           // Confidence medium
    },
    background: {
      default: '#f0f8f0',        // AppContainer bg
      paper: '#ffffff',          // UploadContainer bg
    },
    text: {
      primary: '#2e7d32',
      secondary: '#5f5f5f',
    }
  },
  typography: {
    fontFamily: `'Poppins', 'Roboto', sans-serif`,
    h3: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 16, // general shape for most components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // specific override for buttons
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // make login/dashboard boxes less curved
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8, // same for cards if used
        },
      },
    },
  }
});

export default theme;
