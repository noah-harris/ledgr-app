import { Box, Card, Typography } from "@mui/material";
import type { StatementSummaryView } from "../../types";
import { formatCurrency, formatDate } from "../../lib";

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <Box>
      <Typography sx={{ fontSize: "10px", fontStyle: "italic" }}>{label}</Typography>
      {value}
    </Box>
  );
}

export default function StatementCard({ statement, symbol }: { statement: StatementSummaryView; symbol: string }) {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 2 }}>
        <Field label="Statement Date" value={formatDate(statement.StatementDate, false)} />
        <Field label="Period" value={`${formatDate(statement.StartDate, false)} - ${formatDate(statement.EndDate, false)}`} />
        <Field label="Ending Balance" value={formatCurrency(statement.EndBalance, symbol)} />
        <Field label="Transactions" value={String(statement.TotalTransactions)} />
        <Field label="Deposited" value={formatCurrency(statement.AmountDeposited, symbol)} />
        <Field label="Withdrawn" value={formatCurrency(statement.AmountWithdrawn, symbol)} />
        <Field label="Balance Change" value={formatCurrency(statement?.BalanceChange, symbol, true)} />
      </Box>
    </Card>
  );
}
