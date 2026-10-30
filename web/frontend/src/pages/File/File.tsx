import { useEffect, useState } from "react";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import DataGrid from "../../components/common/DataGrid";
import FileViewer from "../../components/common/FileViewer";
import { formatFileSize } from "../../lib/format";
import { fetchApi } from "../../Api";
import Modal from "../../components/common/Modal";
import type { File } from "../../types";
import { Box, Button, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import Loading from "../../components/common/Loading";

const columns: GridColDef<File>[] = [
  { 
    field: "idFile", 
    headerName: "ID", 
    flex: 1, 
  },
  {
    field: "FileName",
    headerName: "Name",
    flex: 1,
  },
  { 
    field: "FileExtension", 
    headerName: "Extension", 
  },
  {
    field: "FileSizeBytes",
    headerName: "Size",
    flex: 1,
    valueFormatter: (value: number) => formatFileSize(value)
  },
  {
    field: "MimeType",
    headerName: "Mime Type",
    flex: 1,
  }
];



export default function File() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchApi("/files")
      .then((res) => res.json())
      .then(setFiles)
      .catch(console.error);
  }, []);


  function exportSelectedFiles() {
    fetchApi("/file/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
         selectedIds
      )
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ledgr-export-${selectedIds.length}-files-${new Date().toISOString()}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(console.error);
  }

  function importFiles() {

    // Open file dialog to select files for import
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const formData = new FormData();
        for (const file of Array.from(target.files)) {
          formData.append("files", file);
        }
        try {
          const res = await fetchApi("/file/upload", {
            method: "POST",
            body: formData
          });
          if (res.ok) {
            const newFiles = await res.json();
            setFiles((prev) => [...prev, ...newFiles]);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    input.click();

  } 
  if (!files.length) return <Loading />;


  return (
    <div>
      <Typography variant="h4">Files</Typography>

      <Box>
        <Button variant="contained" onClick={() => importFiles()}><UploadIcon /></Button>
        <Button variant="contained" onClick={() => exportSelectedFiles()}><DownloadIcon /></Button>
      </Box>

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