import { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type Row = {
  id: string;
  name: string;
  balance: number;
};

const rows: Row[] = [
  { id: "1", name: "Checking", balance: 1250.5 },
  { id: "2", name: "Savings", balance: 8400 },
  { id: "3", name: "Credit Card", balance: -312.18 },
];

export default function AccountTable() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow
              key={r.id}
              hover
              selected={r.id === selectedId}
              onClick={() => setSelectedId(r.id)}
            >
              <TableCell>{r.name}</TableCell>
              <TableCell align="right">{r.balance.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}