import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
 
export default function Footer() {
  const year = new Date().getFullYear();
 
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        py: 1.5,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        &copy; {year} ledgr
      </Typography>
      <Typography variant="caption" color="text.secondary">
        v1.0.0
      </Typography>
    </Box>
  );
}
 