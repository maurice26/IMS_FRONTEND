import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

import { REGISTER_USER } from "../graphql/mutations";
import { GET_PRODUCTS, GET_PURCHASES, GET_SALES, GET_USERS } from "../graphql/queries";
import {
  downloadCSV,
  generateSalesPDF,
  generateSystemPDF,
  generateSystemReport,
} from "../utils/download";

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import TableChartIcon from "@mui/icons-material/TableChart";

import SkeletonLoader from "../components/SkeletonLoader";

const COLORS = ["#8e24aa", "#6a1b9a", "#ab47bc", "#e91e63", "#ff9800"];

const REVENUE_TREND = [
  { name: "W1", revenue: 4000, purchases: 2100 },
  { name: "W2", revenue: 4500, purchases: 2800 },
  { name: "W3", revenue: 3800, purchases: 1900 },
  { name: "W4", revenue: 6200, purchases: 3400 },
];

const AdminDashboard = () => {
  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS);
  const { data: salesData, loading: salesLoading } = useQuery(GET_SALES);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: purchasesData, loading: purchasesLoading } = useQuery(GET_PURCHASES);

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: () => refetchUsers?.(),
  });

  // ── Add User state ──
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "User" });
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // ── Report feedback ──
  const [reportMsg, setReportMsg] = useState("");
  const [reportError, setReportError] = useState("");

  // ── Period filter (UI only for now) ──
  const [period, setPeriod] = useState("monthly");

  const users = usersData?.users || [];
  const products = productsData?.products || [];
  const sales = salesData?.sales || [];
  const purchases = purchasesData?.purchases || [];

  const totalRevenue = sales.reduce((acc, s) => acc + (s.totalPrice || 0), 0);
  const totalPurchasesAmt = purchases.reduce((acc, p) => acc + (p.totalPrice || 0), 0);
  const totalProducts = products.length;
  const totalUsers = users.length;
  const lowStockItems = products.filter((p) => (p.stockQuantity || 0) < 10);
  const activeSuppliers = 12; // mock until supplier query is available

  const roleStats = [
    { name: "Admins", value: users.filter((u) => u.role === "ADMIN" || u.role === "Admin").length },
    { name: "Sales", value: users.filter((u) => u.role === "SALES" || u.role === "Sales").length },
    { name: "Users", value: users.filter((u) => u.role === "USER" || u.role === "User").length },
  ];

  // ── Report handlers ──
  const runReport = (label, fn) => {
    setReportMsg("");
    setReportError("");
    try {
      fn();
      setReportMsg(`${label} downloaded successfully.`);
    } catch (err) {
      console.error(err);
      setReportError(`Failed to generate ${label}.`);
    }
  };

  const handleSystemCSV = () =>
    runReport("System CSV", () => generateSystemReport(users, products, sales, purchases));

  const handleSystemPDF = () =>
    runReport("System PDF", () => generateSystemPDF(users, products, sales, purchases));

  const handleSalesPDF = () =>
    runReport("Sales PDF", () => {
      if (sales.length === 0) throw new Error("No sales data");
      generateSalesPDF(sales);
    });

  const handleUsersCSV = () =>
    runReport("Users CSV", () => {
      const headers = "ID,Name,Email,Role";
      const rows = users.map((u) => `${u.userId},"${u.name}","${u.email}",${u.role}`).join("\n");
      downloadCSV(`${headers}\n${rows}`, "users_report.csv");
    });

  // ── Add User handlers ──
  const handleAddUser = async () => {
    setAddError("");
    setAddSuccess("");
    const { name, email, password, role } = addForm;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setAddError("Name, email, and password are all required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAddError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setAddError("Password must be at least 6 characters.");
      return;
    }

    setAddLoading(true);
    try {
      await registerUser({ variables: { input: { name, email, password, role } } });
      setAddSuccess("User created successfully!");
      setAddForm({ name: "", email: "", password: "", role: "User" });
      setTimeout(() => { setAddOpen(false); setAddSuccess(""); }, 1200);
    } catch (err) {
      const msg = err?.graphQLErrors?.[0]?.message;
      setAddError(msg || "Failed to create user. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
    setAddForm({ name: "", email: "", password: "", role: "User" });
    setAddError("");
    setAddSuccess("");
  };

  if (productsLoading || salesLoading || usersLoading || purchasesLoading)
    return <SkeletonLoader />;

  return (
    <Box sx={{ minHeight: "100vh", p: 2 }}>
      {/* ── Top Bar ── */}
      <AppBar
        position="static"
        sx={{ mb: 3, background: "linear-gradient(90deg, #8e24aa 0%, #6a1b9a 100%)", borderRadius: 2 }}
      >
        <Toolbar sx={{ flexWrap: "wrap", gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Control Panel
          </Typography>

          <FormControl size="small" sx={{ minWidth: 120, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1 }}>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              sx={{ color: "#fff", "& .MuiSvgIcon-root": { color: "#fff" } }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          <Button color="inherit" startIcon={<PersonAddIcon />} onClick={() => setAddOpen(true)}>
            Add User
          </Button>
          <Button color="inherit" startIcon={<PictureAsPdfIcon />} onClick={handleSystemPDF}>
            System PDF
          </Button>
          <Button color="inherit" startIcon={<TableChartIcon />} onClick={handleSystemCSV}>
            System CSV
          </Button>
          <Button color="inherit" startIcon={<AssessmentIcon />} onClick={handleSalesPDF}>
            Sales PDF
          </Button>
          <Button color="inherit" startIcon={<DownloadIcon />} onClick={handleUsersCSV}>
            Users CSV
          </Button>
        </Toolbar>
      </AppBar>

      {/* ── Report feedback ── */}
      {reportMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setReportMsg("")}>
          {reportMsg}
        </Alert>
      )}
      {reportError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setReportError("")}>
          {reportError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* ── KPI Cards ── */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {[
              { icon: PeopleIcon, title: "Total Users", value: totalUsers, color: "#8e24aa" },
              { icon: Inventory2Icon, title: "Products", value: totalProducts, color: "#6a1b9a" },
              { icon: LocalShippingIcon, title: "Suppliers", value: activeSuppliers, color: "#ab47bc" },
              { icon: AssessmentIcon, title: "Revenue (KES)", value: totalRevenue.toLocaleString(), color: "#e91e63" },
              { icon: ShoppingBasketIcon, title: "Purchases (KES)", value: totalPurchasesAmt.toLocaleString(), color: "#4caf50" },
            ].map((kpi, i) => (
              <Grid item xs={12} sm={6} md={2.4} key={i}>
                <Card sx={{ background: "rgba(26,26,26,0.95)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ bgcolor: `${kpi.color}20`, p: 2, borderRadius: 2, mr: 2 }}>
                        <kpi.icon sx={{ color: kpi.color, fontSize: 32 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {kpi.title}
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {kpi.value}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* ── Revenue Area Chart ── */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: "rgba(26,26,26,0.95)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Revenue Analytics
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={REVENUE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#b3b3b3" />
                  <YAxis stroke="#b3b3b3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8e24aa" fill="#8e24aa20" name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Purchases Bar Chart ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "rgba(26,26,26,0.95)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Revenue vs Purchases
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={REVENUE_TREND}>
                  <XAxis dataKey="name" stroke="#b3b3b3" />
                  <YAxis stroke="#b3b3b3" />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8e24aa" name="Revenue" />
                  <Bar dataKey="purchases" fill="#4caf50" name="Purchases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Pie Chart ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "rgba(26,26,26,0.95)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                User Roles
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={roleStats} dataKey="value" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                    {roleStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Low Stock Table ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "rgba(26,26,26,0.95)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Low Stock</Typography>
                <Chip label={lowStockItems.length} color="warning" size="small" />
              </Box>
              <TableContainer sx={{ maxHeight: 280 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          <Typography variant="body2" color="text.secondary">
                            All products well stocked
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      lowStockItems.slice(0, 5).map((p) => (
                        <TableRow key={p.productId}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell sx={{ color: "warning.main" }}>
                            {p.stockQuantity}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Recent Users Table ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "rgba(26,26,26,0.95)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Users
              </Typography>
              <TableContainer sx={{ maxHeight: 280 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.slice(-5).map((u) => (
                      <TableRow key={u.userId}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ bgcolor: "#8e24aa", width: 28, height: 28, fontSize: 13 }}>
                              {(u.name || u.email)?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Typography variant="body2">{u.name || u.email}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.role}
                            size="small"
                            color={u.role === "Admin" || u.role === "ADMIN" ? "secondary" : "default"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, background: "linear-gradient(45deg, #8e24aa, #6a1b9a)" }}
                onClick={() => setAddOpen(true)}
                startIcon={<PersonAddIcon />}
              >
                Add New User
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Quick Actions ── */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {[
            { label: "Add User", icon: PeopleIcon, color: "#8e24aa", action: () => setAddOpen(true) },
            { label: "System PDF", icon: PictureAsPdfIcon, color: "#6a1b9a", action: handleSystemPDF },
            { label: "Sales PDF", icon: AssessmentIcon, color: "#e91e63", action: handleSalesPDF },
            { label: "Users CSV", icon: DownloadIcon, color: "#4caf50", action: handleUsersCSV },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                onClick={item.action}
                sx={{
                  background: "rgba(26,26,26,0.95)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Box
                    sx={{
                      bgcolor: `${item.color}15`,
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      mx: "auto",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <item.icon sx={{ color: item.color, fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6">{item.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Add User Dialog ── */}
      <Dialog open={addOpen} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ background: "linear-gradient(45deg, #8e24aa, #6a1b9a)", color: "#fff" }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <PersonAddIcon />
            Create New User
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {addError && (
              <Alert severity="error" onClose={() => setAddError("")}>
                {addError}
              </Alert>
            )}
            {addSuccess && <Alert severity="success">{addSuccess}</Alert>}

            <TextField
              label="Full Name"
              fullWidth
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              autoFocus
            />
            <TextField
              label="Email Address"
              fullWidth
              type="email"
              value={addForm.email}
              onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
            />
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={addForm.password}
              onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
              helperText="Minimum 6 characters"
            />
            <TextField
              select
              label="Role"
              fullWidth
              value={addForm.role}
              onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAdd} disabled={addLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddUser}
            disabled={addLoading}
            startIcon={<PersonAddIcon />}
            sx={{ background: "linear-gradient(45deg, #8e24aa, #6a1b9a)" }}
          >
            {addLoading ? "Creating..." : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;