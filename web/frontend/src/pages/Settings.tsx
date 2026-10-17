import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import DataGrid from "../components/test/DataGrid";
 
type Account = {
  id: number;
  name: string;
  type: string;
  balance: number;
};
 
const rows: Account[] = [
  { id: 1, name: "Checking", type: "Bank", balance: 1250.5 },
  { id: 2, name: "Savings", type: "Bank", balance: 8400 },
  { id: 3, name: "Credit Card", type: "Credit", balance: -312.18 },
  { id: 4, name: "Brokerage", type: "Investment", balance: 15230.77 },
  { id: 5, name: "Roth IRA", type: "Investment", balance: 22100.0 },
  { id: 6, name: "Mortgage", type: "Loan", balance: -198500.0 },
];
 
const columns: GridColDef<Account>[] = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
  { field: "type", headerName: "Type", width: 140 },
  {
    field: "balance",
    headerName: "Balance",
    type: "number",
    width: 150,
    valueFormatter: (value: number) => value.toFixed(2),
  },
];
 
export default function Settings() {
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const selected = rows.find((r) => r.id === selectedId);
 
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {selected ? `Selected: ${selected.name}` : "Click a row to select it"}
      </Typography>
 
      <DataGrid rows={rows} columns={columns} onSelect={setSelectedId} />
    </Box>
  );
}