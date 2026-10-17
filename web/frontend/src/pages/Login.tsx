import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box sx={{ maxWidth: 360, mx: "auto", mt: 10 }}>
      <Typography variant="h4">Login</Typography>
      <Typography variant="body1">Please enter your credentials to log in.</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained">Login</Button>
      </Box>
    </Box>
  );
}