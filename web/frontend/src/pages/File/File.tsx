import { useEffect, useState } from "react";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";

import mime from "mime";

import MyDataGrid from "../../components/common/MyDataGrid";
import { formatFileSize } from "../../lib/format";
import { apiFetch } from "../../lib/apiFetch";

type Row = {
  id: string;
  name: string;
  extension: string;
  size: number; /* format stirng later string */
  mimeType: string;
};

const columns: GridColDef<Row>[] = [
  { 
    field: "id", 
    headerName: "ID", 
    flex: 1, 
    minWidth: 150 
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 150
  },
  { 
    field: "extension", 
    headerName: "Extension", 
    width: 140 
  },
  {
    field: "size",
    headerName: "Size",
    width: 150,
    valueFormatter: (value: number) => formatFileSize(value)
  },
  {
    field: "mimeType",
    headerName: "Mime Type",
    flex: 1,
    minWidth: 150,
    valueGetter: (value: string, row: Row) => value ?? mime.getType(row.extension) ?? "unknown",
  }
];

export default function File() {
  const [rows, setRows] = useState<Row[]>([]);
  const [_selectedIds, setSelectedIds] = useState<GridRowId[]>([]);

  useEffect(() => {
    apiFetch("/files")
      .then((res) => res.json())
      .then(setRows)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>File Page</h1>
      <MyDataGrid 
        rows={rows} 
        columns={columns} 
        onSelect={(id) => console.log("Selected row ID:", id)} 
        onSelectionChange={(ids) => setSelectedIds(ids)}
        checkboxSelection
      />
    </div>
  );
}