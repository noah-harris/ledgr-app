import { useRef, useState } from "react";
import { Link, matchPath, useLocation } from "react-router";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";


type NavLink = { to: string; label: string; children?: { to: string; label: string }[] };

const links: NavLink[] = [
  { to: "/ledgr", label: "Ledgr", children: [
    { to: "/ledgr/accounts", label: "Accounts" },
    { to: "/ledgr/transactions", label: "Transactions" },
  ]},
  { to: "/documents", label: "Documents" },
  { to: "/settings", label: "Settings" },
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

// // src/components/NavBar.tsx
// import { Link, matchPath, useLocation } from "react-router";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Box from "@mui/material/Box";
 

// const links = [
//   { to: "/ledgr", label: "Ledgr" },
//   { to: "/documents", label: "Documents", end: true },
//   { to: "/settings", label: "Settings" },

// ];

// export default function NavBar() {
//   const { pathname } = useLocation();

//   const current =
//     links.find((l) => matchPath({ path: l.to, end: l.to === "/" }, pathname))?.to ?? false;
 
//   return (
//     <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//       <Tabs value={current}>
//         {links.map((l) => (
//           <Tab key={l.to} label={l.label} value={l.to} to={l.to} component={Link} />
//         ))}
//       </Tabs>
//     </Box>
//   );
// }
 