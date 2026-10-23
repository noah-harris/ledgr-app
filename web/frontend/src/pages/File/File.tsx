import { useEffect, useState } from "react";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import mime from "mime";

import DataGrid from "../../components/common/DataGrid";
import FileViewer from "../../components/common/FileViewer";
import { formatFileSize } from "../../lib/format";
import { fetchApi } from "../../Api";
import Modal from "../../components/common/Modal";
import type { Row } from "../../types/GridFileRow";


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
    minWidth: 150,
    valueGetter: (_value: string, row: Row) => row.name,
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
  const [file, setFile] = useState<Row | null>(null);

  useEffect(() => {
    fetchApi("/files")
      .then((res) => res.json())
      .then(setRows)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>File Page</h1>
      <DataGrid 
        rows={rows} 
        columns={columns} 
        onSelect={(params) => setFile(params.row)} 
        onSelectionChange={(ids) => setSelectedIds(ids)}
        checkboxSelection
      />

      <Modal open={file !== null} onClose={() => setFile(null)} title={file?.name ?? ""}>
        {file && <FileViewer path={file.download} />}
      </Modal>
    </div>
  );
}