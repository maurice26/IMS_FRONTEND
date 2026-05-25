import { Box, CircularProgress, ThemeProvider } from "@mui/material";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";

import { AuthContext } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import UserDashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Purchases from "./pages/Purchases";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import SalesDashboard from "./pages/SalesDashboard";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";

import "./styles/global.css";
import "./styles/layout.css";
import theme from "./theme";



/* ================= PROTECTED LAYOUT ================= */
const ProtectedLayout = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user === undefined) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f0f0f",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Topbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </div>
    </div>
  );
};

/* ================= DASHBOARD ROUTER ================= */
const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

if (user.role === "Admin" || user.role === "ADMIN") return <AdminDashboard />;
if (user.role === "Sales" || user.role === "SALES") return <SalesDashboard />;
if (user.role === "User" || user.role === "USER") return <UserDashboard />;

  return <div>Unauthorized Role</div>;
};

/* ================= APP ================= */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Route (role-based) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <DashboardRouter />
            </ProtectedLayout>
          }
        />

        {/* Other Protected Routes */}
        <Route
          path="/products"
          element={
            <ProtectedLayout>
              <Products />
            </ProtectedLayout>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedLayout>
              <Sales />
            </ProtectedLayout>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedLayout>
              <Users />
            </ProtectedLayout>
          }
        />

        <Route
          path="/purchases"
          element={
            <ProtectedLayout>
              <Purchases />
            </ProtectedLayout>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedLayout>
              <Suppliers />
            </ProtectedLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedLayout>
              <Reports />
            </ProtectedLayout>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedLayout>
              <Analytics />
            </ProtectedLayout>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1a1a1a",
            color: "#fff",
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;