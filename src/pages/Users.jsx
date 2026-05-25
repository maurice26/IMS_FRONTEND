import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

import { DELETE_USER, REGISTER_USER, UPDATE_USER } from "../graphql/mutations";
import { GET_USERS } from "../graphql/queries";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Alert,
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
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";

const ROLE_LABEL = (role) =>
  role === "USER" ? "User" : role === "SALES" ? "Sales" : role;

const Users = () => {
  const { data, loading, refetch } = useQuery(GET_USERS);

  const [deleteUser] = useMutation(DELETE_USER, { onCompleted: () => refetch() });
  const [updateUser] = useMutation(UPDATE_USER, { onCompleted: () => refetch() });
  const [registerUser] = useMutation(REGISTER_USER, { onCompleted: () => refetch() });

  const users = data?.users || [];

  // ── Edit role state ──
  const [editingId, setEditingId] = useState(null);
  const [newRole, setNewRole] = useState("");

  // ── Add user dialog state ──
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "User" });
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // ── Handlers ──
  const handleDelete = async (id) => {
    try {
      await deleteUser({ variables: { input: { userId: id } } });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleUpdate = async (id) => {
    const user = users.find((u) => u.userId === id);
    try {
      await updateUser({
        variables: {
          input: {
            userId: id,
            name: user?.name ?? "",
            email: user?.email ?? "",
            role: newRole,
          },
        },
      });
      setEditingId(null);
      setNewRole("");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

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
      await registerUser({
        variables: {
          input: { name, email, password, role },
        },
      });
      setAddSuccess("User created successfully!");
      setAddForm({ name: "", email: "", password: "", role: "User" });
      setTimeout(() => {
        setAddOpen(false);
        setAddSuccess("");
      }, 1200);
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

  // ── Columns ──
  const columns = [
    {
      field: "name",
      headerName: "User",
      width: 260,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "#8e24aa" }}>
            {params.value?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{params.value}</Typography>
            <Typography variant="body2" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 200,
      renderCell: (params) => {
        const isEditing = editingId === params.row.userId;
        if (isEditing) {
          return (
            <Select
              size="small"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          );
        }
        return (
          <Chip
            label={ROLE_LABEL(params.value)}
            size="small"
            sx={{
              backgroundColor: params.value === "Admin" ? "#8e24aa" : "#3949ab",
              color: "#fff",
            }}
          />
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: () => <Chip label="Active" color="success" size="small" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      renderCell: (params) => {
        const isEditing = editingId === params.row.userId;
        return (
          <Stack direction="row" spacing={1}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleUpdate(params.row.userId)}
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => { setEditingId(null); setNewRole(""); }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setEditingId(params.row.userId);
                  setNewRole(ROLE_LABEL(params.row.role));
                }}
              >
                Edit Role
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.userId)}
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all users, roles, and access permissions
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setAddOpen(true)}
            sx={{ background: "linear-gradient(45deg, #8e24aa, #6a1b9a)" }}
          >
            Add User
          </Button>
          <Button
            variant="outlined"
            onClick={refetch}
            sx={{ borderColor: "#8e24aa", color: "#8e24aa" }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: 3, background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
        <CardContent sx={{ p: 0 }}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.userId}
              loading={loading}
              pageSizeOptions={[5, 10, 25, 50]}
              checkboxSelection
              sx={{
                border: "none",
                [`& .${gridClasses.row}`]: { bgcolor: "#121212" },
                [`& .${gridClasses.columnHeader}`]: {
                  backgroundColor: "#4a148c",
                  color: "white",
                  fontWeight: "bold",
                },
                [`& .${gridClasses.cell}`]: {
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={addOpen} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: "linear-gradient(45deg, #8e24aa, #6a1b9a)", color: "#fff" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonAddIcon />
            Create New User
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {addError && (
              <Alert severity="error" onClose={() => setAddError("")}>
                {addError}
              </Alert>
            )}
            {addSuccess && (
              <Alert severity="success">{addSuccess}</Alert>
            )}

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

export default Users;