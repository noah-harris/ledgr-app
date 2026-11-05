import { useParams } from "react-router";
import { Box, Link, Stack, Typography } from "@mui/material";
import { Loading } from "../../components";
import { formatDate, title } from "../../lib";
import NotFound from "../NotFound";
import StatementCard from "./StatementCard";
import { useAccount } from "../../hooks";

export default function AccountDetailPage() {
  const { idAccount } = useParams();
  if (!idAccount) return <NotFound />;

  const { account, latestStatement, loading, statements } = useAccount(idAccount);

  if (loading) return <Loading />;


  return account && (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>

        <Link href={account.LoginPage || "/"} style={{ display: "block", width: "fit-content", textDecoration: "none" }}>
          <Box sx={{ display: "inline-block", verticalAlign: "top", textAlign: "right" }}>
            {account?.OrganizationName} | {title(account?.AccountSubTypeName)} <br />
            <i>{account?.AccountName}</i>
          </Box>
        </Link>

        {latestStatement && (
          <Box sx={{ display: "inline-block", marginLeft: "20px", verticalAlign: "top" }}>
            Balance: {latestStatement.EndBalance} <br />
            <Typography style={{ fontSize: "10px", fontStyle: "italic", verticalAlign:"top" }}>As of {formatDate(latestStatement.EndDate, false)} </Typography>
          </Box>
        )} 

    </Box>

    <Box sx={{ marginTop: "20px" }}>
      <Typography variant="h5">Statements</Typography>
      <Stack spacing={1}>
        {statements.map(statement => (
          <StatementCard key={statement.idStatement} statement={statement} symbol={account.Symbol} />
        ))}
      </Stack>
    </Box>
  </>
  );
}