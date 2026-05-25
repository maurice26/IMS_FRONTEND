import { useQuery } from "@apollo/client";
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SearchIcon from '@mui/icons-material/Search';
import StoreIcon from '@mui/icons-material/Store';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import SkeletonLoader from "../components/SkeletonLoader";
import { GET_PRODUCTS, GET_SUPPLIERS } from "../graphql/queries";

const COLORS = ["#8e24aa", "#ab47bc", "#e91e63", "#ff9800"];

const UserDashboard = () => {
  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS);
  const { data: suppliersData, loading: suppliersLoading } = useQuery(GET_SUPPLIERS);

  const featuredProducts = productsData?.products?.slice(0, 8) || [];
  const topSuppliers = suppliersData?.suppliers?.slice(0, 6) || [];
  const categoryStats = [
    { name: "Electronics", value: 28 },
    { name: "Clothing", value: 22 },
    { name: "Home & Garden", value: 18 },
    { name: "Books", value: 15 },
    { name: "Sports", value: 12 },
  ];

  if (productsLoading || suppliersLoading) return <SkeletonLoader cards={6} charts={true} />;

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      {/* Hero Search */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>Inventory Catalog</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
          Browse available products, discover suppliers and explore the full inventory system
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search products, suppliers, categories..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="large"
            />
          </CardContent>
        </Card>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #8e24aa15 0%, #6a1b9a15 100%)' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <StoreIcon sx={{ fontSize: 56, color: '#8e24aa', mb: 2 }} />
              <Typography variant="h3">{productsData?.products?.length || 0}</Typography>
              <Typography color="text.secondary">Products Available</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #ab47bc15 0%, #e91e6315 100%)' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <LocalShippingIcon sx={{ fontSize: 56, color: '#ab47bc', mb: 2 }} />
              <Typography variant="h3">{suppliersData?.suppliers?.length || 0}</Typography>
              <Typography color="text.secondary">Active Suppliers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff980015 0%, #ffc10715 100%)' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CategoryIcon sx={{ fontSize: 56, color: '#ff9800', mb: 2 }} />
              <Typography variant="h3">95</Typography>
              <Typography color="text.secondary">Categories</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Distribution */}
      <Grid item xs={12} sx={{ mb: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>Product Categories</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={categoryStats} dataKey="value" cx="55%" cy="50%" outerRadius={100}>
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cat-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Featured Products Grid */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6">Featured Products</Typography>
            <Chip label="In Stock" color="success" />
          </Box>
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.productId}>
                <Card sx={{ height: 280, cursor: 'pointer', '&:hover': { boxShadow: 12 } }}>
                  <Box sx={{ height: 160, background: 'linear-gradient(45deg, #8e24aa20 0%, #6a1b9a20 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h4" color="primary">📦</Typography>
                  </Box>
                  <CardContent sx={{ p: 3, pt: 0 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Supplier: {product.supplier?.name || 'Direct'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h5">KES {product.price}</Typography>
                      <Badge badgeContent={product.stock} color={product.stock < 5 ? 'warning' : 'success'}>
                        <Chip label="Stock" size="small" />
                      </Badge>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Suppliers Directory */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 4 }}>Top Suppliers Directory</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topSuppliers.map((supplier) => (
                  <TableRow key={supplier.supplierId} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.200', mr: 2 }}>S</Avatar>
                        <Box>
                          <Typography variant="body1">{supplier.name}</Typography>
                          <Typography variant="caption">{supplier.location}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.products?.length || 0} items</TableCell>
                    <TableCell>
                      <Chip label="4.8 ★" color="success" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button variant="outlined" size="large">View All Suppliers</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDashboard;
