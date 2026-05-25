import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "../graphql/mutations";

import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";

import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { useState } from "react";

/* ================= COMPONENT ================= */
const Products = () => {
  const { data, loading, refetch } = useQuery(GET_PRODUCTS);

  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const [form, setForm] = useState({ name: "", price: "" });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!form.name || !form.price) return;

    await createProduct({
      variables: {
        input: {
          name: form.name,
          price: parseFloat(form.price),
          categoryId: 1,
        },
      },
    });

    refetch();
    setForm({ name: "", price: "" });
  };

  /* ================= EDIT ================= */
  const handleEditOpen = (row) => {
    setSelected(row);
    setOpen(true);
  };

  const handleEditSave = async () => {
    await updateProduct({
      variables: {
        input: {
          productId: selected.productId,
          name: selected.name,
          price: parseFloat(selected.price),
          categoryId: 1,
        },
      },
    });

    setOpen(false);
    refetch();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    await deleteProduct({
      variables: { productId: id },
    });

    refetch();
  };

  const products = data?.products || [];

  /* ================= TABLE ================= */
  const columns = [
    {
      field: "name",
      headerName: "Product",
      width: 220,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.value}</Typography>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={`$${params.value}`}
          sx={{ backgroundColor: "#8e24aa", color: "#fff" }}
        />
      ),
    },
    {
      field: "stockQuantity",
      headerName: "Stock",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value > 0 ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleEditOpen(params.row)}
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => handleDelete(params.row.productId)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Product Management
      </Typography>

      {/* CREATE */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="Product Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCreate}
                sx={{
                  height: "56px",
                  background:
                    "linear-gradient(45deg, #8e24aa, #6a1b9a)",
                }}
              >
                Add Product
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <div style={{ height: 500 }}>
            <DataGrid
              rows={products}
              columns={columns}
              getRowId={(row) => row.productId}
              loading={loading}
              sx={{
                [`& .${gridClasses.columnHeader}`]: {
                  backgroundColor: "#4a148c",
                  color: "#fff",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* EDIT MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={selected?.name || ""}
            onChange={(e) =>
              setSelected({ ...selected, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Price"
            type="number"
            margin="normal"
            value={selected?.price || ""}
            onChange={(e) =>
              setSelected({ ...selected, price: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleEditSave}
            sx={{
              background: "linear-gradient(45deg, #8e24aa, #6a1b9a)",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;