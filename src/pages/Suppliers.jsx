import { useQuery, useMutation } from "@apollo/client";
import { GET_SUPPLIERS } from "../graphql/queries";
import { CREATE_SUPPLIER } from "../graphql/mutations";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

const Suppliers = () => {
  const { data, loading, error, refetch } = useQuery(GET_SUPPLIERS);

  const [createSupplier, { loading: creating }] = useMutation(CREATE_SUPPLIER);

  const [form, setForm] = useState({
    name: "",
    contactInfo: "",
  });

  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ================= CREATE SUPPLIER =================
  const handleCreate = async () => {
    setSuccess("");
    setErrorMsg("");

    if (!form.name || !form.contactInfo) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      await createSupplier({
        variables: {
          input: {
            name: form.name,
            contactInfo: form.contactInfo,
          },
        },
      });

      setSuccess("Supplier added successfully ✅");

      setForm({
        name: "",
        contactInfo: "",
      });

      refetch();
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { field: "supplierId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "contactInfo",
      headerName: "Contact",
      flex: 1,
    },
  ];

  // ================= UI =================
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Supplier Management
      </Typography>

      <Grid container spacing={3}>
        {/* ================= FORM ================= */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#1a1a1a", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Supplier
              </Typography>

              {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <TextField
                label="Name"
                fullWidth
                sx={{ mt: 2 }}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <TextField
                label="Contact Info"
                fullWidth
                sx={{ mt: 2 }}
                value={form.contactInfo}
                onChange={(e) =>
                  setForm({ ...form, contactInfo: e.target.value })
                }
              />

              <Button
                fullWidth
                sx={{ mt: 3 }}
                variant="contained"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? (
                  <CircularProgress size={24} />
                ) : (
                  "Add Supplier"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= TABLE ================= */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: "#1a1a1a", borderRadius: 3 }}>
            <CardContent>
              <div style={{ height: 420 }}>
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 5,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error">
                    Failed to load suppliers
                  </Alert>
                ) : (
                  <DataGrid
                    rows={data?.suppliers || []}
                    columns={columns}
                    getRowId={(row) => row.supplierId}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Suppliers;