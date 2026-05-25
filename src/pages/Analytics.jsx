import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";

import { GET_PRODUCTS, GET_PURCHASES, GET_SALES, GET_USERS } from "../graphql/queries";

import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    MenuItem,
    Select,
    Skeleton,
    Typography
} from "@mui/material";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import InventoryIcon from "@mui/icons-material/Inventory";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// ── Palette (matches your existing theme) ──────────────────────────────────
const P = {
  purple:  "#8e24aa",
  violet:  "#6a1b9a",
  lavender:"#ab47bc",
  pink:    "#e91e63",
  green:   "#4caf50",
  amber:   "#ff9800",
  blue:    "#2196f3",
  teal:    "#009688",
  bg:      "rgba(26,26,26,0.95)",
  border:  "rgba(255,255,255,0.06)",
  muted:   "#b3b3b3",
};

const ROLE_COLORS = { Admin: P.purple, ADMIN: P.purple, Sales: P.pink, SALES: P.pink, User: P.blue, USER: P.blue };

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n ?? 0));

const groupBy = (arr, keyFn) =>
  arr.reduce((acc, item) => {
    const k = keyFn(item);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

const sumBy = (arr, keyFn, valFn) =>
  arr.reduce((acc, item) => {
    const k = keyFn(item);
    acc[k] = (acc[k] || 0) + (valFn(item) || 0);
    return acc;
  }, {});

// Parse date string into a Date object safely
const parseDate = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt) ? null : dt;
};

// ── KPI Card ───────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, sub, color, trend, trendVal }) => (
  <Card sx={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 3, height: "100%" }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ bgcolor: `${color}18`, p: 1.5, borderRadius: 2 }}>
          <Icon sx={{ color, fontSize: 28 }} />
        </Box>
        {trendVal !== undefined && (
          <Chip
            icon={trend === "up" ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={trendVal}
            size="small"
            sx={{
              bgcolor: trend === "up" ? "#4caf5018" : "#f4433618",
              color: trend === "up" ? P.green : "#f44336",
              fontWeight: 700,
              fontSize: 11,
            }}
          />
        )}
      </Box>
      <Typography variant="h4" fontWeight={800} sx={{ mt: 2, letterSpacing: -1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
        {label}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.disabled">
          {sub}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// ── Section heading ────────────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
  <Typography
    variant="overline"
    sx={{ color: P.lavender, fontWeight: 800, letterSpacing: 3, display: "block", mb: 2, mt: 1 }}
  >
    {children}
  </Typography>
);

// ── Custom Tooltip ─────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: "#1a1a2e",
        border: `1px solid ${P.border}`,
        borderRadius: 2,
        p: 1.5,
        fontSize: 13,
      }}
    >
      <Typography variant="caption" color={P.muted} display="block" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      {payload.map((p) => (
        <Box key={p.name} display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p.color }} />
          <Typography variant="caption" color="#fff">
            {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const Analytics = () => {
  const [period, setPeriod] = useState("monthly");

  const { data: usersData, loading: uL } = useQuery(GET_USERS);
  const { data: productsData, loading: pL } = useQuery(GET_PRODUCTS);
  const { data: salesData, loading: sL } = useQuery(GET_SALES);
  const { data: purchasesData, loading: puL } = useQuery(GET_PURCHASES);

  const loading = uL || pL || sL || puL;

  const users     = usersData?.users || [];
  const products  = productsData?.products || [];
  const sales     = salesData?.sales || [];
  const purchases = purchasesData?.purchases || [];

  // ── Computed metrics ─────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalRevenue       = sales.reduce((a, s) => a + (s.totalPrice || 0), 0);
    const totalPurchasesCost = purchases.reduce((a, p) => a + (p.totalPrice || 0), 0);
    const profit             = totalRevenue - totalPurchasesCost;
    const profitMargin       = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

    const admins = users.filter((u) => ["ADMIN","Admin"].includes(u.role)).length;
    const salesU = users.filter((u) => ["SALES","Sales"].includes(u.role)).length;
    const regular= users.filter((u) => ["USER","User"].includes(u.role)).length;

    const lowStock   = products.filter((p) => (p.stockQuantity || 0) < 10).length;
    const outOfStock = products.filter((p) => (p.stockQuantity || 0) === 0).length;
    const avgStock   = products.length
      ? Math.round(products.reduce((a, p) => a + (p.stockQuantity || 0), 0) / products.length)
      : 0;

    return { totalRevenue, totalPurchasesCost, profit, profitMargin, admins, salesU, regular, lowStock, outOfStock, avgStock };
  }, [users, products, sales, purchases]);

  // ── Role distribution for pie ────────────────────────────────────────────
  const roleData = [
    { name: "Admins", value: metrics.admins,  fill: P.purple },
    { name: "Sales",  value: metrics.salesU,  fill: P.pink   },
    { name: "Users",  value: metrics.regular, fill: P.blue   },
  ].filter((d) => d.value > 0);

  const totalRoleUsers = roleData.reduce((a, d) => a + d.value, 0);

  // ── Sales over time ──────────────────────────────────────────────────────
  const salesOverTime = useMemo(() => {
    const getBucket = (dateStr) => {
      const d = parseDate(dateStr);
      if (!d) return "Unknown";
      if (period === "daily")   return d.toLocaleDateString("en-KE", { month: "short", day: "numeric" });
      if (period === "weekly")  return `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleDateString("en-KE", { month: "short" })}`;
      return d.toLocaleDateString("en-KE", { month: "short", year: "2-digit" });
    };

    const buckets = {};
    sales.forEach((s) => {
      const k = getBucket(s.saleDate || s.createdAt || s.date);
      if (!buckets[k]) buckets[k] = { name: k, revenue: 0, count: 0 };
      buckets[k].revenue += s.totalPrice || 0;
      buckets[k].count   += 1;
    });
    purchases.forEach((p) => {
      const k = getBucket(p.purchaseDate || p.createdAt || p.date);
      if (!buckets[k]) buckets[k] = { name: k, revenue: 0, count: 0 };
      if (!buckets[k].purchases) buckets[k].purchases = 0;
      buckets[k].purchases += p.totalPrice || 0;
    });

    const sorted = Object.values(buckets).sort((a, b) => a.name.localeCompare(b.name));

    // Fallback: show synthetic weekly data if we have no dated records
    if (sorted.length === 0) {
      return [
        { name: "W1", revenue: 0, purchases: 0, count: 0 },
        { name: "W2", revenue: 0, purchases: 0, count: 0 },
        { name: "W3", revenue: 0, purchases: 0, count: 0 },
        { name: "W4", revenue: 0, purchases: 0, count: 0 },
      ];
    }
    return sorted;
  }, [sales, purchases, period]);

  // ── User role radial data ────────────────────────────────────────────────
  const radialData = [
    { name: "Users",  value: totalRoleUsers > 0 ? Math.round((metrics.regular / totalRoleUsers) * 100) : 0, fill: P.blue   },
    { name: "Sales",  value: totalRoleUsers > 0 ? Math.round((metrics.salesU  / totalRoleUsers) * 100) : 0, fill: P.pink   },
    { name: "Admins", value: totalRoleUsers > 0 ? Math.round((metrics.admins  / totalRoleUsers) * 100) : 0, fill: P.purple },
  ];

  // ── Top products by name appearance in sales ─────────────────────────────
  const topProducts = useMemo(() => {
    const map = {};
    sales.forEach((s) => {
      const name = s.productName || s.product?.name || "Unknown";
      if (!map[name]) map[name] = { name, revenue: 0, units: 0 };
      map[name].revenue += s.totalPrice || 0;
      map[name].units   += s.quantity   || 1;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  }, [sales]);

  // ── Stock health ─────────────────────────────────────────────────────────
  const stockHealth = [
    { name: "Healthy",    value: products.filter((p) => (p.stockQuantity || 0) >= 10).length, fill: P.green },
    { name: "Low Stock",  value: metrics.lowStock - metrics.outOfStock,                        fill: P.amber },
    { name: "Out of Stock", value: metrics.outOfStock,                                         fill: "#f44336" },
  ].filter((d) => d.value > 0);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={260} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={340} height={24} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[...Array(5)].map((_, i) => (
            <Grid item xs={12} sm={6} md={2.4} key={i}>
              <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* ── Header ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
        <Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                bgcolor: `${P.purple}22`,
                p: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <BarChartIcon sx={{ color: P.purple, fontSize: 28 }} />
            </Box>
            <Typography variant="h4" fontWeight={800} letterSpacing={-0.5}>
              Analytics Overview
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 0.5 }}>
            System-wide insights — sales, users, inventory & more
          </Typography>
        </Box>

        <Select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{
            color: "#fff",
            bgcolor: `${P.purple}18`,
            border: `1px solid ${P.purple}44`,
            borderRadius: 2,
            "& .MuiSvgIcon-root": { color: P.lavender },
          }}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={3}>
        {/* ── KPI Row ── */}
        <Grid item xs={12}>
          <SectionHeading>Key Metrics</SectionHeading>
          <Grid container spacing={2}>
            {[
              {
                icon: PointOfSaleIcon,
                label: "Total Revenue",
                value: `KES ${fmt(metrics.totalRevenue)}`,
                sub: `${sales.length} transactions`,
                color: P.purple,
                trend: "up",
                trendVal: "+Sales",
              },
              {
                icon: ShoppingCartIcon,
                label: "Total Purchases",
                value: `KES ${fmt(metrics.totalPurchasesCost)}`,
                sub: `${purchases.length} purchase orders`,
                color: P.green,
              },
              {
                icon: TrendingUpIcon,
                label: "Net Profit",
                value: `KES ${fmt(metrics.profit)}`,
                sub: `${metrics.profitMargin}% margin`,
                color: metrics.profit >= 0 ? P.green : "#f44336",
                trend: metrics.profit >= 0 ? "up" : "down",
                trendVal: `${metrics.profitMargin}%`,
              },
              {
                icon: GroupIcon,
                label: "Total Users",
                value: users.length,
                sub: `${metrics.admins} admin · ${metrics.salesU} sales · ${metrics.regular} users`,
                color: P.blue,
              },
              {
                icon: InventoryIcon,
                label: "Products",
                value: products.length,
                sub: `${metrics.lowStock} low · ${metrics.outOfStock} out`,
                color: P.amber,
                trend: metrics.outOfStock > 0 ? "down" : "up",
                trendVal: metrics.outOfStock > 0 ? `${metrics.outOfStock} OOS` : "Stocked",
              },
            ].map((kpi, i) => (
              <Grid item xs={12} sm={6} md={2.4} key={i}>
                <KpiCard {...kpi} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* ── Sales Trend Area Chart ── */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Revenue vs Purchases
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Trend over time
                  </Typography>
                </Box>
                <Chip label={`${sales.length} sales`} size="small" sx={{ bgcolor: `${P.purple}22`, color: P.lavender }} />
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesOverTime} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={P.purple} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={P.purple} stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="purGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={P.green} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={P.green} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke={P.muted} tick={{ fontSize: 12 }} />
                  <YAxis stroke={P.muted} tick={{ fontSize: 12 }} tickFormatter={fmt} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Area type="monotone" dataKey="revenue"   stroke={P.purple} fill="url(#revGrad)" strokeWidth={2} name="Revenue (KES)"   />
                  <Area type="monotone" dataKey="purchases" stroke={P.green}  fill="url(#purGrad)" strokeWidth={2} name="Purchases (KES)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── User Role Pie ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                User Distribution
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                By role across the system
              </Typography>

              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {roleData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Role breakdown rows */}
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { icon: AdminPanelSettingsIcon, label: "Admins", count: metrics.admins,  color: P.purple },
                  { icon: SupportAgentIcon,       label: "Sales",  count: metrics.salesU,  color: P.pink   },
                  { icon: AccountCircleIcon,       label: "Users",  count: metrics.regular, color: P.blue   },
                ].map(({ icon: Icon, label, count, color }) => (
                  <Box key={label} display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ color, fontSize: 18 }} />
                      <Typography variant="body2">{label}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 80, height: 4, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <Box
                          sx={{
                            width: `${totalRoleUsers > 0 ? (count / totalRoleUsers) * 100 : 0}%`,
                            height: "100%",
                            bgcolor: color,
                            borderRadius: 2,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" fontWeight={700} minWidth={20} textAlign="right">
                        {count}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Top Products Bar Chart ── */}
        <Grid item xs={12} md={7}>
          <Card sx={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Top Products by Revenue
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Best performing products
                  </Typography>
                </Box>
                <Chip label={`${products.length} products`} size="small" sx={{ bgcolor: `${P.amber}22`, color: P.amber }} />
              </Box>
              {topProducts.length === 0 ? (
                <Box display="flex" alignItems="center" justifyContent="center" height={240}>
                  <Typography color="text.secondary">No sales data available</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" stroke={P.muted} tick={{ fontSize: 11 }} tickFormatter={fmt} />
                    <YAxis type="category" dataKey="name" stroke={P.muted} tick={{ fontSize: 11 }} width={100} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="revenue" name="Revenue (KES)" radius={[0, 4, 4, 0]}>
                      {topProducts.map((_, i) => (
                        <Cell key={i} fill={[P.purple, P.pink, P.lavender, P.blue, P.teal, P.amber][i % 6]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Inventory Health Pie ── */}
        <Grid item xs={12} md={5}>
          <Card sx={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Inventory Health
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Stock status breakdown
              </Typography>

              {products.length === 0 ? (
                <Box display="flex" alignItems="center" justifyContent="center" height={220}>
                  <Typography color="text.secondary">No product data</Typography>
                </Box>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={stockHealth}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        paddingAngle={2}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {stockHealth.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<DarkTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box display="flex" justifyContent="space-around" mt={2}>
                    {stockHealth.map((s) => (
                      <Box key={s.name} textAlign="center">
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: s.fill, mx: "auto", mb: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">{s.name}</Typography>
                        <Typography variant="body2" fontWeight={700}>{s.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Sales count line chart ── */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Sales Volume Trend
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Number of transactions over time
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={salesOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke={P.muted} tick={{ fontSize: 12 }} />
                  <YAxis stroke={P.muted} tick={{ fontSize: 12 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={P.pink}
                    strokeWidth={2.5}
                    dot={{ fill: P.pink, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Transactions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── User Role Radial Chart ── */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Role Activity (%)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Percentage of users per role
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={90}
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={5}
                    dataKey="value"
                    cornerRadius={6}
                    label={{ position: "insideStart", fill: "#fff", fontSize: 11, formatter: (v) => `${v}%` }}
                  />
                  <Tooltip
                    content={<DarkTooltip />}
                    formatter={(v) => [`${v}%`, "Share"]}
                  />
                  <Legend
                    iconSize={10}
                    wrapperStyle={{ fontSize: 12 }}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>{value}</span>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Summary Stats Row ── */}
        <Grid item xs={12}>
          <SectionHeading>System Summary</SectionHeading>
          <Grid container spacing={2}>
            {[
              { label: "Avg Stock Level",   value: metrics.avgStock,          color: P.teal   },
              { label: "Low Stock Items",   value: metrics.lowStock,           color: P.amber  },
              { label: "Out of Stock",      value: metrics.outOfStock,         color: "#f44336"},
              { label: "Total Sales",       value: sales.length,               color: P.purple },
              { label: "Total Purchases",   value: purchases.length,           color: P.green  },
              { label: "Profit Margin",     value: `${metrics.profitMargin}%`, color: metrics.profit >= 0 ? P.green : "#f44336" },
            ].map((stat, i) => (
              <Grid item xs={6} sm={4} md={2} key={i}>
                <Card sx={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 2 }}>
                  <CardContent sx={{ py: 2, px: 2, "&:last-child": { pb: 2 } }}>
                    <Typography variant="h5" fontWeight={800} sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;