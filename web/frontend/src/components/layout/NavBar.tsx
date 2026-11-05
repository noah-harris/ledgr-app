import { useRef, useState } from "react";
import { Link, matchPath, useLocation } from "react-router";
import { Tabs, Tab, Box, Popper, Paper, MenuList, MenuItem } from "@mui/material";
import type { NavLink } from "../../types";

const links: NavLink[] = [
  { 
    to: "/accounts", 
    label: "Accounts", 
  },
  {
    to: "/transactions",
    label: "Transactions"
  },
  { 
    to: "/documents/manage", 
    label: "Documents",
    children: [
      { to: "/documents/manage", label: "Manage" },
      { to: "/documents/search", label: "Search" },
      { to: "/document/tags/manage", label: "Tags" }
  ]},
  {
    to: "/files",
    label: "Files",
    children: [
      { to: "/files", label: "All Files" },
      { to: "/file/junk", label: "Junk" },
      { to: "/file/sort-orphan", label: "Sort Orphans…" }
    ]
  },
  { 
    to: "/settings", 
    label: "Settings" 
  },
  { 
    to: "/dev", 
    label: "Developer" 
  },
];

export default function NavBar() {
  const { pathname } = useLocation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeTimer = useRef<number>(0);

  const current =
    links.find((l) => matchPath({ path: l.to, end: false }, pathname))?.to ?? false;

  const open = (e: React.MouseEvent<HTMLElement>, key: string) => {
    clearTimeout(closeTimer.current);
    setAnchor(e.currentTarget);
    setOpenKey(key);
  };
  const close = () => {
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 120);
  };

  const active = links.find((l) => l.to === openKey);

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={current}>
        {links.map((l) => (
          <Tab
            key={l.to}
            label={l.label}
            value={l.to}
            to={l.to}
            component={Link}
            onMouseEnter={l.children ? (e) => open(e, l.to) : undefined}
            onMouseLeave={l.children ? close : undefined}
          />
        ))}
      </Tabs>

      <Popper open={!!active?.children} anchorEl={anchor} placement="bottom-start" sx={{ zIndex: 1300 }}>
        <Paper
          elevation={3}
          onMouseEnter={() => clearTimeout(closeTimer.current)}
          onMouseLeave={close}
        >
          <MenuList dense>
            {active?.children?.map((c) => (
              <MenuItem key={c.to} component={Link} to={c.to} onClick={() => setOpenKey(null)}>
                {c.label}
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popper>
    </Box>
  );
}
