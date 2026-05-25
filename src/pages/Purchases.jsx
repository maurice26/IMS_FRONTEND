import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PURCHASE } from "../graphql/mutations";
import { GET_PRODUCTS, GET_PURCHASES } from "../graphql/queries";

import AddIcon from "@mui/icons-material/Add";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import {
  Box,
  Button,
  Card, CardContent,
  Chip, Dialog, DialogActions, DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem, Select,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SkeletonLoader from "../components/SkeletonLoader";

const Purchases = () => {
  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS);
  const { data: purchasesData, loading: purchasesLoading, refetch } = useQuery(GET_PURCHASES);
  const [createPurchase] = useMutation(CREATE_PURCHASE, { onCompleted: () => refetch() });

  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const products = productsData?.products || [];
  const purchases = purchasesData?.purchases || [];

  const handleCreatePurchase = async () => {
    setErrorMsg("");
    if (!productId || !quantity || !totalPrice) {
      setErrorMsg("All fields are required.");
      return;
    }
    try {
      await createPurchase({
        variables: {
          input: {
            productId: parseInt(productId),
            quantity: parseInt(quantity),
            totalPrice: parseFloat(totalPrice),
          },
        },
      });
      setOpen(false);
      setProductId("");
      setQuantity("");
      setTotalPrice("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to create purchase. Please try again.");
    }
  };

  if (productsLoading || purchasesLoading) return <SkeletonLoader />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Purchases Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track inventory purchases and supplier orders
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ background: "linear-gradient(45deg, #4caf50, #45a049)" }}
        >
          New Purchase
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "rgba(76, 175, 80, 0.1)" }}>
            <CardContent>
              <Inventory2Icon sx={{ fontSize: 48, color: "#4caf50", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Purchases
              </Typography>
              <Typography variant="h3" color="success.main">
                {purchases.length} orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Purchases Table */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Recent Purchases
              </Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Purchase ID</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchases.slice(-10).map((purchase) => (
                      <TableRow key={purchase.purchaseId}>
                        <TableCell>
                          <Chip label={`#${purchase.purchaseId}`} color="success" size="small" />
                        </TableCell>
                        <TableCell>
                          {purchase.purchaseDate
                            ? new Date(purchase.purchaseDate).toLocaleDateString()
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {purchases.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          <Typography color="text.secondary">No purchases found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Purchase Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); setErrorMsg(""); }} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Purchase</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {errorMsg && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errorMsg}
              </Typography>
            )}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Product</InputLabel>
              <Select value={productId} onChange={(e) => setProductId(e.target.value)} label="Product">
                {products.map((p) => (
                  <MenuItem key={p.productId} value={p.productId}>
                    {p.name} (KES {p.price})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              inputProps={{ min: 1 }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Total Price (KES)"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setErrorMsg(""); }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreatePurchase}
            disabled={!productId || !quantity || !totalPrice}
            startIcon={<AddIcon />}
          >
            Add Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Purchases;