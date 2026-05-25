import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8e24aa",
      light: "#ab47bc",
      dark: "#6a1b9a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e91e63",
      light: "#f48fb1",
      dark: "#c2185b",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    background: {
      default: "#0a0a0f",
      paper: "rgba(20, 20, 30, 0.8)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a0a0b0",
      disabled: "#606070",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    h1: { fontWeight: 800, letterSpacing: -1.5 },
    h2: { fontWeight: 700, letterSpacing: -1 },
    h3: { fontWeight: 700, letterSpacing: -0.5 },
    h4: { fontWeight: 600, letterSpacing: -0.3 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(20, 20, 30, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(142, 36, 170, 0.15)",
            borderColor: "rgba(142, 36, 170, 0.2)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 16px rgba(142, 36, 170, 0.3)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #8e24aa 0%, #6a1b9a 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "all 0.2s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(142, 36, 170, 0.4)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8e24aa",
              borderWidth: 2,
              boxShadow: "0 0 12px rgba(142, 36, 170, 0.2)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "rgba(20, 20, 30, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        },
        head: {
          fontWeight: 700,
          background: "rgba(142, 36, 170, 0.1)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "rgba(15, 15, 25, 0.95)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(15, 15, 25, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
  },
});

export default theme;
