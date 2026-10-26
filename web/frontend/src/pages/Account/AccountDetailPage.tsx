import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { AccountView, StatementView } from "../../types"; 
import { fetchApi } from "../../Api";
import { Box, Link, Typography } from "@mui/material";
import Loading from "../../components/common/Loading";
import { screamSnakeToTitleCase, formatDate } from "../../lib/format";


export default function AccountDetailPage() {
  const { idAccount } = useParams();
  const [account, setAccount] = useState<AccountView>();
  const [latestStatement, setLatestStatement] = useState<StatementView>();

  useEffect(() => {
    fetchApi(`/account/statements/latest?idAccount=${idAccount}`)
    .then((response) => response.json())
    .then(setLatestStatement);
  }, [idAccount]);

  useEffect(() => {
    fetchApi(`/account?idAccount=${idAccount}`)
    .then((response) => response.json())
    .then(setAccount);
  }, [idAccount]);

  if (!account || !latestStatement) return <Loading />;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Link href={account.LoginPage || "/"} style={{ display: "block", width: "fit-content", textDecoration: "none" }}>
        <Box sx={{ display: "inline-block", verticalAlign: "top", textAlign: "right" }}>
          {account.OrganizationName} | {screamSnakeToTitleCase(account.AccountSubTypeName)} <br />
          <i>{account.AccountName}</i>
        </Box>
      </Link>
      <Box sx={{ display: "inline-block", marginLeft: "20px", verticalAlign: "top" }}>
        Balance: {latestStatement?.EndBalance ?? "N/A"} <br />
        <Typography style={{ fontSize: "10px", fontStyle: "italic", verticalAlign:"top" }}>As of {formatDate(latestStatement?.EndDate, false) ?? "N/A"} </Typography>
      </Box>
    </Box>
  );
}