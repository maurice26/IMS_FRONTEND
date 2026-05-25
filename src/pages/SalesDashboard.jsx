import { useMutation, useQuery } from "@apollo/client";
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography
} from "@mui/material";
import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SkeletonLoader from "../components/SkeletonLoader";
import { CREATE_SALE, CREATE_SUPPLIER } from "../graphql/mutations";
import { GET_PRODUCTS, GET_SALES, GET_SUPPLIERS } from "../graphql/queries";

const SalesDashboard = () => {
  const [newSaleOpen, setNewSaleOpen] = useState(false);
  const [newSupplierOpen, setNewSupplierOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [formData, setFormData] = useState({ productId: '', quantity: '', customerName: '', amount: '' });
  const [supplierData, setSupplierData] = useState({ name: '', contact: '', products: '' });

  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS);
  const { data: salesData, loading: salesLoading } = useQuery(GET_SALES);
  const { data: suppliersData } = useQuery(GET_SUPPLIERS);
  const [addSupplier] = useMutation(CREATE_SUPPLIER);
  const [createSale] = useMutation(CREATE_SALE);

  const todaysSales = salesData?.sales?.filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString()) || [];
  const totalToday = todaysSales.reduce((acc, s) => acc + s.totalPrice, 0);
  const target = 50000;
  const progress = (totalToday / target) * 100;

  const chartData = todaysSales.map((s, i) => ({
    name: `Sale ${i+1}`,
    value: s.totalPrice,
  }));

  const quickRecordSale = async () => {
    try {
      await createSale({ variables: { input: formData } });
      setNewSaleOpen(false);
      setFormData({ productId: '', quantity: '', customerName: '', amount: '' });
    } catch (error) {
      console.error('Sale creation failed', error);
    }
  };

  const addNewSupplier = async () => {
    try {
      await addSupplier({ variables: { input: supplierData } });
      setNewSupplierOpen(false);
      setSupplierData({ name: '', contact: '', products: '' });
    } catch (error) {
      console.error('Supplier add failed', error);
    }
  };

  if (productsLoading || salesLoading) return <SkeletonLoader />;

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      {/* Hero & Target */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>Sales Operations</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Record sales, manage payments, add suppliers and track daily performance
        </Typography>
        <Card sx={{ background: 'linear-gradient(135deg, #8e24aa20 0%, #6a1b9a20 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Today's Sales</Typography>
                <Typography variant="h4">KES {totalToday.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Target Progress</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress variant="determinate" value={Math.min(progress, 100)} size={40} sx={{ mr: 2 }} />
                  <Typography variant="h6">{Math.round(progress)}%</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 160, cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              <ShoppingCartIcon sx={{ fontSize: 48, color: '#8e24aa', mb: 2 }} />
              <Typography variant="h6">Quick Sale</Typography>
              <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => setNewSaleOpen(true)} sx={{ mt: 2 }}>
                Record Sale
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 160, cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              <PaymentIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6">Record Payment</Typography>
              <Button fullWidth variant="contained" color="success" onClick={() => setPaymentOpen(true)} sx={{ mt: 2 }}>
                New Payment
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 160, cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              <LocalShippingIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h6">Add Supplier</Typography>
              <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={() => setNewSupplierOpen(true)} sx={{ mt: 2 }}>
                Add Vendor
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Sales Chart */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>Today's Sales Performance</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#b3b3b3" />
              <YAxis stroke="#b3b3b3" />
              <Tooltip />
              <Bar dataKey="value" fill="#8e24aa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Sales & Products Quick Add */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Recent Sales</Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sale ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todaysSales.slice(0, 8).map((sale) => (
                      <TableRow key={sale.saleId} hover>
                        <TableCell>SALE-{sale.saleId}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.200', mr: 1 }}>C</Avatar>
                            {sale.customerName || 'Customer'}
                          </Box>
                        </TableCell>
                        <TableCell>{sale.productName}</TableCell>
                        <TableCell>KES {sale.totalPrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Quick Product Add</Typography>
              <Select
                fullWidth
                displayEmpty
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                sx={{ mb: 2 }}
              >
                <MenuItem disabled> Select Product Template</MenuItem>
                {productsData?.products?.slice(0,10).map(p => (
                  <MenuItem key={p.productId} value={p.productId}>{p.name}</MenuItem>
                ))}
              </Select>
              <Button fullWidth variant="outlined" sx={{ mb: 2 }}>Scan Barcode</Button>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                sx={{ mb: 2 }}
              />
              <Button fullWidth variant="contained" size="large" onClick={() => setNewSaleOpen(true)}>
                Record Sale Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modals */}
      {/* New Sale Dialog */}
      <Dialog open={newSaleOpen} onClose={() => setNewSaleOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record New Sale</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Customer Name" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} sx={{ mt: 2 }} />
          <TextField fullWidth label="Product" value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} sx={{ mt: 2 }} />
          <TextField fullWidth label="Amount (KES)" type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewSaleOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={quickRecordSale}>Record Sale</Button>
        </DialogActions>
      </Dialog>

      {/* New Supplier Dialog */}
      <Dialog open={newSupplierOpen} onClose={() => setNewSupplierOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Supplier</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Supplier Name" value={supplierData.name} onChange={(e) => setSupplierData({...supplierData, name: e.target.value})} sx={{ mt: 2 }} />
          <TextField fullWidth label="Contact" value={supplierData.contact} onChange={(e) => setSupplierData({...supplierData, contact: e.target.value})} sx={{ mt: 2 }} />
          <TextField fullWidth multiline label="Products/Services" value={supplierData.products} onChange={(e) => setSupplierData({...supplierData, products: e.target.value})} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewSupplierOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addNewSupplier}>Add Supplier</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog (simple) */}
      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)}>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          <Typography>Payment recording feature coming soon...</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SalesDashboard;
