import { useMutation } from "@apollo/client";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box, Button,
    IconButton, InputAdornment,
    Paper, TextField, Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGISTER_USER } from "../graphql/mutations";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [registerUser] = useMutation(REGISTER_USER);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        variables: {
          input: {
            name: form.name,
            email: form.email,
            password: form.password,
            role: "User", // ✅ now supported
          },
        },
      });

      alert("Account created successfully!");
      navigate("/login");

    } catch (err) {
      console.error("Register error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper sx={{ p: 5, width: 400 }}>
        <Typography variant="h4" textAlign="center">Create Account</Typography>

        <TextField label="Name" fullWidth margin="normal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField label="Email" fullWidth margin="normal"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button fullWidth variant="contained" sx={{ mt: 2 }}
          onClick={handleRegister} disabled={loading}
        >
          {loading ? "Creating..." : "Register"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Register;