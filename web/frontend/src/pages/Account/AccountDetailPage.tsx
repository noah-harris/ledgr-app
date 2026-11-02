import { useParams } from "react-router";
import { Box, Link, Typography } from "@mui/material";
import { Loading } from "../../components";
import { formatDate, title } from "../../lib";
import NotFound from "../NotFound";
import { useAccount } from "../../hooks";

export default function AccountDetailPage() {
  const { idAccount } = useParams();
  if (!idAccount) return <NotFound />;

  const { account, latestStatement, loading } = useAccount(idAccount);

  if (loading) return <Loading />;

  return (
    <>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Link href={account?.LoginPage || "/"} style={{ display: "block", width: "fit-content", textDecoration: "none" }}>
        <Box sx={{ display: "inline-block", verticalAlign: "top", textAlign: "right" }}>
          {account?.OrganizationName} | {title(account?.AccountSubTypeName)} <br />
          <i>{account?.AccountName}</i>
        </Box>
      </Link>
      <Box sx={{ display: "inline-block", marginLeft: "20px", verticalAlign: "top" }}>
        Balance: {latestStatement?.EndBalance ?? "N/A"} <br />
        <Typography style={{ fontSize: "10px", fontStyle: "italic", verticalAlign:"top" }}>As of {formatDate(latestStatement?.EndDate, false) ?? "N/A"} </Typography>
      </Box>
    </Box>
    <Box>
      
    </Box>

    </>
  );
}