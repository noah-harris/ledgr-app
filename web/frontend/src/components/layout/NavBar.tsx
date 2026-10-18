// src/components/NavBar.tsx
import { Link, matchPath, useLocation } from "react-router";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
 

const links = [
  { to: "/ledgr", label: "Ledgr" },
  { to: "/documents", label: "Documents", end: true },
  
  { to: "/settings", label: "Settings" },

];

export default function NavBar() {
  const { pathname } = useLocation();
 
  // Which tab matches the current URL? "/" must match exactly; others match as a prefix
  // (so /accounts/2 still highlights Accounts). false = no tab highlighted (e.g. NotFound).
  const current =
    links.find((l) => matchPath({ path: l.to, end: l.to === "/" }, pathname))?.to ?? false;
 
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={current}>
        {links.map((l) => (
          <Tab key={l.to} label={l.label} value={l.to} to={l.to} component={Link} />
        ))}
      </Tabs>
    </Box>
  );
}
 


// export default function NavBar() {
//   return (
//     <nav style={{ display: "flex", gap: 4, padding: "0 16px", borderBottom: "1px solid #ccc" }}>
//       {links.map((link) => (
//         <NavLink
//           key={link.to}
//           to={link.to}
//           end={link.end}
//           style={({ isActive }) => ({
//             padding: "10px 14px",
//             textDecoration: "none",
//             color: isActive ? "#0078d4" : "inherit",
//             fontWeight: isActive ? "bold" : "normal",
//             borderBottom: isActive ? "3px solid #0078d4" : "3px solid transparent",
//           })}
//         >
//           {link.label}
//         </NavLink>
//       ))}
//     </nav>
//   );
// }