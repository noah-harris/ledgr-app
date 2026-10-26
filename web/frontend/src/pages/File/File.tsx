import { useEffect, useState } from "react";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import mime from "mime";

import DataGrid from "../../components/common/DataGrid";
import FileViewer from "../../components/common/FileViewer";
import { formatFileSize } from "../../lib/format";
import { fetchApi } from "../../Api";
import Modal from "../../components/common/Modal";
import type { File } from "../../types";
import { Typography } from "@mui/material";
import Loading from "../../components/common/Loading";


const columns: GridColDef<File>[] = [
  { 
    field: "idFile", 
    headerName: "ID", 
    flex: 1, 
    minWidth: 150 
  },
  {
    field: "FileName",
    headerName: "Name",
    flex: 1,
    minWidth: 150,
    valueGetter: (_value: string, file: File) => file.FileName,
  },
  { 
    field: "FileExtension", 
    headerName: "Extension", 
    width: 140 
  },
  {
    field: "FileSizeBytes",
    headerName: "Size",
    width: 150,
    valueFormatter: (value: number) => formatFileSize(value)
  },
  {
    field: "mimeType",
    headerName: "Mime Type",
    flex: 1,
    minWidth: 150,
    valueGetter: (value: string, file: File) => value ?? mime.getType(file.FileExtension) ?? "unknown", 
  }
];

export default function File() {
  const [files, setFiles] = useState<File[]>([]);
  const [_selectedIds, setSelectedIds] = useState<GridRowId[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchApi("/files")
      .then((res) => res.json())
      .then(setFiles)
      .catch(console.error);
  }, []);

  if (!files.length) return <Loading />;


  return (
    <div>
      <Typography variant="h4">Files</Typography>
      <DataGrid 
        rows={files} 
        columns={columns} 
        getRowId={row => row.idFile}
        onSelect={(params) => setFile(params.row)} 
        onSelectionChange={(ids) => setSelectedIds(ids)}
        checkboxSelection
        hiddenColumns={["idFile"]}
        width="fit"
      />

      <Modal 
        open={file !== null} 
        onClose={() => setFile(null)} 
        title={file?.FileName ?? ""}
      >
        {file && <FileViewer path={`${file.DownloadEndpoint}`} />}
      </Modal>
      
    </div>
  );
}