import { Box, Button, Card, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate("/login");

  const handleDemoLogin = () => {
    const demoUser = { email: "demo@ims.com", role: "Admin" };
    localStorage.setItem("user", JSON.stringify(demoUser));
    window.location.href = "/dashboard";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d1b69 100%)",
        color: "white",
      }}
    >
      {/* ================= HERO SECTION ================= */}
      <Box sx={{ textAlign: "center", py: 12, px: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(45deg, #8e24aa, #b39ddb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
          }}
        >
          Smart Inventory Management
        </Typography>

        <Typography
          variant="h6"
          sx={{ maxWidth: 600, mx: "auto", mb: 5, color: "#ccc" }}
        >
          Manage products, orders, and users with a powerful, modern SaaS
          platform designed for efficiency and growth.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              px: 4,
              background: "linear-gradient(45deg, #8e24aa, #6a1b9a)",
            }}
          >
            Get Started
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleDemoLogin}
            sx={{
              px: 4,
              borderColor: "#8e24aa",
              color: "#8e24aa",
              "&:hover": {
                backgroundColor: "#8e24aa",
                color: "#fff",
              },
            }}
          >
            Live Demo
          </Button>
        </Box>
      </Box>

      {/* ================= FEATURES ================= */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, mb: 12 }}>
        <Typography variant="h4" align="center" sx={{ mb: 8 }}>
          Powerful Features
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "Real-time Tracking",
              desc: "Monitor inventory instantly with live updates and alerts.",
            },
            {
              title: "Smart Analytics",
              desc: "Gain insights with dashboards, reports, and forecasts.",
            },
            {
              title: "User Management",
              desc: "Control access with roles and permissions.",
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                  },
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: "#8e24aa" }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: "#ccc" }}>{item.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================= CTA SECTION ================= */}
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          px: 2,
          background: "rgba(138,36,170,0.1)",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Ready to get started?
        </Typography>

        <Typography sx={{ mb: 4, color: "#ccc" }}>
          Experience the system instantly with our demo.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleDemoLogin}
          sx={{
            px: 5,
            background: "linear-gradient(45deg, #8e24aa, #6a1b9a)",
          }}
        >
          Try Demo
        </Button>
      </Box>

      {/* ================= TRUSTED BY ================= */}
      <Box sx={{ maxWidth: 1000, mx: "auto", py: 10 }}>
        <Typography variant="h5" align="center" sx={{ mb: 6 }}>
          Trusted by Teams Worldwide
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {["TechCorp", "RetailPro", "SupplyChain", "NextGen Stores"].map(
            (brand) => (
              <Grid item key={brand}>
                <Paper
                  sx={{
                    px: 4,
                    py: 2,
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <Typography>{brand}</Typography>
                </Paper>
              </Grid>
            )
          )}
        </Grid>
      </Box>

      {/* ================= FOOTER ================= */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography variant="body2" sx={{ color: "#aaa" }}>
          © 2026 Inventory Management System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;