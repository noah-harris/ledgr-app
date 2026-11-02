import { useEffect, useState } from "react"
import { useFileExport, useFiles } from "../../hooks";
import { formatFileSize } from "../../lib/format";
import { DataGrid, Loading, FileMenuBar } from "../../components";
import { openFile } from "../../lib";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import type { File } from "../../types";

const columns: GridColDef<File>[] = [
  { field: "idFile", headerName: "ID", flex: 1 },
  { field: "FileName", headerName: "Name", flex: 1 },
  { field: "FileExtension", headerName: "Extension" },
  {
    field: "FileSizeBytes",
    headerName: "Size",
    flex: 1,
    valueFormatter: (value: number) => formatFileSize(value),
  },
  { field: "MimeType", headerName: "Mime Type", flex: 1 },
];

export default function FilesPage() {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowId[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const { exportFiles } = useFileExport(selectedFileIds);
  const { files, loading } = useFiles();

  useEffect(() => {
    const selectedRows = files.filter(file => selectedRowIds.includes(file.idFile));
    const ids = selectedRows.map(row => row.idFile.toString());
    setSelectedFileIds(ids);
  }, [selectedRowIds, files]);

  if (loading) return <Loading />;

  return (
    <>
      <FileMenuBar exportFiles={exportFiles}/>
      <DataGrid
        rows={files}
        columns={columns}
        getRowId={(row) => row.idFile}
        onSelect={(params) => {openFile(params.row.idFile)}}
        onSelectionChange={(ids) => setSelectedRowIds(ids)}
        checkboxSelection
        hiddenColumns={["idFile"]}
        width="fit"
      />
    </>
  );
}