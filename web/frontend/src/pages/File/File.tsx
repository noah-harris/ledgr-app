import { useEffect, useState } from "react";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { formatFileSize } from "../../lib/format";
import { getFiles } from "../../services/files";
import { DataGrid, FileViewer, Modal, Loading, FileUploadExport } from "../../components";
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
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { 
    setLoading(true);
    getFiles({ setFiles });
    setLoading(false);
  }, []);


  if (loading) return <Loading />;

  return (
    <div>
      <Typography variant="h4">Files</Typography>

      <FileUploadExport endpoint="/file/upload" targetFileIds={selectedIds as string[]} />

      <DataGrid
        rows={files}
        columns={columns}
        getRowId={(row) => row.idFile}
        onSelect={(params) => setFile(params.row)}
        onSelectionChange={(ids) => setSelectedIds(ids)}
        checkboxSelection
        hiddenColumns={["idFile"]}
        width="fit"
      />

      <Modal open={file !== null} onClose={() => setFile(null)} title={file?.FileName ?? ""}>
        {file && <FileViewer path={file.DownloadEndpoint ?? ""} />}
      </Modal>

    </div>
  );
}