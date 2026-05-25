import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { LOGIN_USER } from "../graphql/mutations";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginUser] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
  if (!form.email || !form.password) return;

  try {
    setLoading(true);

    const res = await loginUser({
      variables: {
        input: {
          email: form.email,
          password: form.password,
        },
      },
    });

    const { token, user } = res.data.login;

    localStorage.setItem("token", token);
    login({ ...user, id: user.userId });

    navigate("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d1b69 100%)",
      }}
    >
      <Paper sx={{ p: 5, width: 400, borderRadius: 3 }}>
        
        {/* Title */}
        <Typography variant="h4" textAlign="center" mb={3}>
          Login
        </Typography>

        {/* Email */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password */}
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Forgot Password */}
        <Box textAlign="right" mt={1}>
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: "primary.main",
            }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </Typography>
        </Box>

        {/* Sign Up */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <MuiLink
              component={RouterLink}
              to="/register"
              underline="hover"
              fontWeight="bold"
            >
              Sign Up
            </MuiLink>
          </Typography>
        </Box>

      </Paper>
    </Box>
  );
};

export default Login;