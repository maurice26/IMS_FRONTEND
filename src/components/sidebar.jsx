import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard", roles: ["Admin", "Sales", "User"] },
    { text: "Analytics", icon: <BarChartIcon />, path: "/analytics", roles: ["Admin"] },
    { text: "Products", icon: <InventoryIcon />, path: "/products", roles: ["Admin", "Sales", "User"] },
    { text: "Sales", icon: <ShoppingCartIcon />, path: "/sales", roles: ["Sales", "Admin"] },
    { text: "Users", icon: <PeopleIcon />, path: "/users", roles: ["Admin"] },
    { text: "Suppliers", icon: <InventoryIcon />, path: "/suppliers", roles: ["Admin", "Sales"] },
    { text: "Purchases", icon: <Inventory2Icon />, path: "/purchases", roles: ["Admin", "Sales"] },
    { text: "Reports", icon: <AssessmentIcon />, path: "/reports", roles: ["Admin"] },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 72 : 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? 72 : 260,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          background: "rgba(12, 12, 20, 0.95)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo Area */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: "linear-gradient(135deg, #8e24aa, #e91e63)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: -0.5,
              }}
            >
              IMS
            </Typography>
          </motion.div>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: "rgba(255,255,255,0.6)",
            "&:hover": { color: "#8e24aa", bgcolor: "rgba(142,36,170,0.1)" },
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {filteredItems.map((item, index) => {
          const active = isActive(item.path);
          return (
            <Tooltip
              key={item.text}
              title={collapsed ? item.text : ""}
              placement="right"
              arrow
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    minHeight: 48,
                    px: 2,
                    position: "relative",
                    overflow: "hidden",
                    bgcolor: active ? "rgba(142, 36, 170, 0.15)" : "transparent",
                    "&::before": active
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "20%",
                          bottom: "20%",
                          width: "3px",
                          borderRadius: "0 4px 4px 0",
                          background: "linear-gradient(180deg, #8e24aa, #e91e63)",
                        }
                      : {},
                    "&:hover": {
                      bgcolor: "rgba(142, 36, 170, 0.1)",
                      "& .MuiListItemIcon-root": {
                        color: "#ab47bc",
                        transform: "scale(1.15)",
                      },
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? "#ab47bc" : "rgba(255,255,255,0.6)",
                      minWidth: 40,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: active ? 700 : 500,
                            fontSize: "0.9rem",
                            color: active ? "#fff" : "rgba(255,255,255,0.7)",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {active && !collapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: "absolute",
                        right: 8,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#8e24aa",
                      }}
                    />
                  )}
                </ListItemButton>
              </motion.div>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2 }} />

      {/* User Profile Mini Card */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "rgba(142, 36, 170, 0.08)",
            border: "1px solid rgba(142, 36, 170, 0.12)",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(142, 36, 170, 0.12)",
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "linear-gradient(135deg, #8e24aa, #6a1b9a)",
              width: 36,
              height: 36,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ flex: 1, minWidth: 0 }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={{ color: "#fff" }}
              >
                {user?.name || user?.email || "User"}
              </Typography>
              <Chip
                label={user?.role || "User"}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: "rgba(142, 36, 170, 0.2)",
                  color: "#ab47bc",
                  mt: 0.5,
                }}
              />
            </motion.div>
          )}
        </Box>

        {/* Logout */}
        <Tooltip title={collapsed ? "Logout" : ""} placement="right">
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 2,
              mt: 1,
              color: "rgba(255,255,255,0.5)",
              "&:hover": {
                color: "#f44336",
                bgcolor: "rgba(244, 67, 54, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 500 }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
