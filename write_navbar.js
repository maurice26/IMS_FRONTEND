const fs = require('fs');

const content = `import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar, Avatar, Badge, Box, Divider, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const handleProfileOpen = (e) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const notifications = [
    { id: 1, text: "Low stock alert: Product XYZ", time: "2 min ago" },
    { id: 2, text: "New sale recorded #1245", time: "15 min ago" },
    { id: 3, text: "System backup completed", time: "1 hr ago" },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "rgba(12, 12, 20, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 3 }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: -0.3,
            background: "linear-gradient(135deg, #fff 0%, #ab47bc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Inventory Management System
        </Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotifOpen}
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": { color: "#ab47bc", bgcolor: "rgba(142,36,170,0.1)" },
                }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notifAnchor}
              open={Boolean(notifAnchor)}
              onClose={handleNotifClose}
              PaperProps={{
                sx: {
                  width: 320,
                  mt: 1.5,
                  background: "rgba(20, 20, 30, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 3,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
              {notifications.map((n) => (
                <MenuItem key={n.id} onClick={handleNotifClose} sx={{ py: 1.5 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>{n.text}</Typography>
                    <Typography variant="caption" color="text.disabled">{n.time}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Box
                onClick={handleProfileOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  ml: 2,
                  cursor: "pointer",
                  p: 0.5,
                  pr: 1.5,
                  borderRadius: 3,
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "rgba(142,36,170,0.1)" },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "linear-gradient(135deg, #8e24aa, #6a1b9a)",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                    {user?.name || user?.email || "User"}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" lineHeight={1.2}>
                    {user?.role || "User"}
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  background: "rgba(20, 20, 30, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 3,
                  minWidth: 200,
                },
              }}
            >
              <MenuItem onClick={() => { handleProfileClose(); navigate("/dashboard"); }}>
                <PersonIcon fontSize="small" sx={{ mr: 1.5, color: "#ab47bc" }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleProfileClose}>
                <SettingsIcon fontSize="small" sx={{ mr: 1.5, color: "#ab47bc" }} />
                Settings
              </MenuItem>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", my: 1 }} />
              <MenuItem onClick={() => { handleProfileClose(); logout(); }} sx={{ color: "#f44336" }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
`;

fs.writeFileSync('src/components/Navbar.jsx', content);
console.log('Navbar.jsx written successfully');