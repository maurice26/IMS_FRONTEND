import { useMutation, useQuery } from "@apollo/client";
import { ADD_PAYMENT, CREATE_SALE } from "../graphql/mutations";
import { GET_PRODUCTS, GET_SALES } from "../graphql/queries";
import { downloadPDF } from "../utils/download";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { useState } from "react";

const Sales = () => {
  const { data: productsData } = useQuery(GET_PRODUCTS);
  const { data: salesData, refetch } = useQuery(GET_SALES);

  const [createSale] = useMutation(CREATE_SALE);
  const [addPayment] = useMutation(ADD_PAYMENT);

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    payment: "",
  });

  // 📌 Find selected product
  const selectedProduct = productsData?.products?.find(
    (p) => p.productId === parseInt(form.productId)
  );

  const total =
    selectedProduct && form.quantity
      ? selectedProduct.price * parseInt(form.quantity)
      : 0;

  // ================= CREATE SALE =================
  const handleSale = async () => {
    try {
      const res = await createSale({
        variables: {
          input: {
            productId: parseInt(form.productId),
            quantity: parseInt(form.quantity),
            userId: 1, // replace with logged user
          },
        },
      });

      const saleId = res.data.createSale.saleId;

      // 💳 Add Payment automatically
      if (form.payment) {
        await addPayment({
          variables: {
            saleId,
            amount: parseFloat(form.payment),
            method: "Cash",
          },
        });
      }

      refetch();
      setForm({ productId: "", quantity: "", payment: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // ================= TABLE =================
  const columns = [
    { field: "saleId", headerName: "ID", width: 80 },
    { field: "productId", headerName: "Product", width: 120 },
    { field: "quantity", headerName: "Qty", width: 100 },
    {
      field: "totalPrice",
      headerName: "Total",
      width: 130,
      renderCell: (params) => `KES ${params.value}`,
    },
    {
      field: "saleDate",
      headerName: "Date",
      width: 180,
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: () => <Chip label="Completed" color="success" size="small" />,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Sales Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* ================= CREATE SALE ================= */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Create Sale
              </Typography>

              {/* Product Dropdown */}
              <TextField
                select
                label="Select Product"
                fullWidth
                sx={{ mb: 2 }}
                value={form.productId}
                onChange={(e) =>
                  setForm({ ...form, productId: e.target.value })
                }
              >
                {productsData?.products?.map((p) => (
                  <MenuItem key={p.productId} value={p.productId}>
                    {p.name} (KES {p.price})
                  </MenuItem>
                ))}
              </TextField>

              {/* Quantity */}
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />

              {/* Total */}
              <Typography sx={{ mb: 2 }}>
                Total: <strong>KES {total}</strong>
              </Typography>

              {/* Payment */}
              <TextField
                label="Payment Amount"
                fullWidth
                sx={{ mb: 2 }}
                value={form.payment}
                onChange={(e) =>
                  setForm({ ...form, payment: e.target.value })
                }
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleSale}
                sx={{
                  py: 1.5,
                  background: "linear-gradient(45deg, #8e24aa, #6a1b9a)",
                }}
              >
                Complete Sale
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= SALES TABLE ================= */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Recent Sales
              </Typography>

              <div style={{ height: 400 }}>
                <DataGrid
                  rows={salesData?.sales || []}
                  columns={columns}
                  getRowId={(row) => row.saleId}
                  pageSizeOptions={[5]}
                  sx={{
                    border: "none",
                    [`& .${gridClasses.columnHeader}`]: {
                      backgroundColor: "#4a148c",
                      color: "#fff",
                    },
                    [`& .${gridClasses.row}`]: {
                      backgroundColor: "#121212",
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

<Button onClick={() => downloadPDF(1)}>
  Download Receipt
</Button>

export default Sales;