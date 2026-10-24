import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import type { User } from "../../types/User";

export default function Header({ user }: { user: User | null }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Make link to home */}
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            ledgr
          </a>
        </Typography>

        {/* Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">
            {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </Typography>
          <Typography variant="body1">{user?.username}</Typography>
          <Avatar src={user?.avatarUrl} alt={user?.username}>
            {user?.username[0].toUpperCase()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
