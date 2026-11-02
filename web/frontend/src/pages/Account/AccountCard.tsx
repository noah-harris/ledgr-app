import { Link } from "react-router";
import { Card } from "@mui/material";
import type { AccountView } from "../../types";
import { formatDate } from "../../lib/format";

export default function AccountCard({ account }: { account: AccountView }) {
  const isClosed = account.EndDate && new Date(account.EndDate) <= new Date();

  return (
    <Link
      to={`/accounts/${account.idAccount}`}
      style={{ display: "block", width: "fit-content", textDecoration: "none" }}
    >
      <Card variant="outlined" sx={{ p: 2 }}>
        | {account.OrganizationName} | {account.AccountSubTypeName} | {account.AccountName} |<br />
        | Opened | {formatDate(account.StartDate, false)} {isClosed ? `| Closed | ${formatDate(account.EndDate, false)} |` : ""}<br />
        | Status | {isClosed ? "Closed" : "Open"} |
      </Card>
    </Link>
  );
}
