import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";
import type { Users } from "../../types";
import { title } from "../../lib/format";
import ClockIcon from "@mui/icons-material/AccessTime";
import CalendarIcon from "@mui/icons-material/CalendarToday";

export default function Header({ user }: { user: Users | null }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppBar position="static">

      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            ledgr
          </a>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ gap: 2, display: "flex", alignItems: "center" }}>
            <ClockIcon style={{ verticalAlign: "middle", marginRight: 4, fontSize: "1rem" }} />
            {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} 
            <CalendarIcon style={{ verticalAlign: "middle", marginRight: 4, fontSize: "1rem" }} />
            {now.toDateString()}
          </Typography>
          <Typography variant="body1">{title(user?.FirstName)} {title(user?.LastName)}</Typography>
          <a href="/user" style={{ textDecoration: "none", color: "inherit" }}><Avatar alt={user?.Username}>{user?.Username[0].toUpperCase()}</Avatar></a>
        </Box>
      </Toolbar>

    </AppBar>
  );
}
