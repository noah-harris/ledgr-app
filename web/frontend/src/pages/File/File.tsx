import { useEffect, useState } from "react";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import DataGrid from "../../components/common/DataGrid";
import FileViewer from "../../components/common/FileViewer";
import { formatFileSize } from "../../lib/format";
import Modal from "../../components/common/Modal";
import type { File } from "../../types";
import { Backdrop, Box, Button, CircularProgress, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import Loading from "../../components/common/Loading";
import { uploadFiles, exportFiles, getFiles } from "../../services/files";


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
  const [uploading, setUploading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<{ filename: string; status: string }[]>([]);

  useEffect(() => { 
    setLoading(true);
    getFiles({ setFiles });
    setLoading(false);
  }, []);

  function selectAndUploadFiles() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.click();
    input.onchange = () => {
      if (input.files?.length) {
        setUploading(true);
        uploadFiles(Array.from(input.files), "/file/upload")
          .then(setFileStatus)
          .finally(() => setUploading(false));
      }
    };
  }


  if (loading) return <Loading />;

  return (
    <div>
      <Typography variant="h4">Files</Typography>

      <Box>
        <Button variant="contained" onClick={() => selectAndUploadFiles()} disabled={uploading}><UploadIcon /></Button>
        <Button variant="contained" onClick={() => exportFiles(selectedIds as string[])} disabled={!selectedIds.length}><DownloadIcon /></Button>
      </Box>

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


      <Backdrop
        sx={(theme) => ({ color: "#fff", backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: theme.zIndex.drawer + 1, flexDirection: "column" })}
        open={uploading || fileStatus.length > 0}
        onClick={() => !uploading && setFileStatus([])}
      >
        {/* TODO: THIS IS PRETTY JANKY, MAKE THIS LESS HORRIBLE LATER*/}
        {uploading && <style>{`body { overflow: hidden; }`}</style>}
        {!uploading && fileStatus.length === 0 && <style>{`body { overflow: auto; }`}</style>}

        <Typography variant="h6" sx={{ mb: 2 }}>
          {uploading ? "Uploading files..." : "Upload Status"}
        </Typography>
        <Box sx={{ width: "100%", padding: 2, overflowY: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
          {uploading ? <CircularProgress color="inherit" /> : fileStatus.map((s) => (
            <div key={s.filename} style={{ textAlign: "left", color: s.status !== "Uploaded" ? "red" : "inherit" }}>
              {s.filename}: {s.status}
            </div>
          ))}
        </Box>
      </Backdrop>
    </div>
  );
}