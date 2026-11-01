import { Box, CircularProgress, Backdrop, Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import { uploadFiles, exportFiles } from "../../services/files";

export default function FileUploadExport({endpoint, targetFileIds }:{endpoint:string, targetFileIds: string[]}) {
  const [uploading, setUploading] = useState(false);
  const [fileStatus, setFileStatus] = useState<{ filename: string; status: string }[]>([]);
  
  function selectAndUploadFiles() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.click();
    input.onchange = () => {
      if (input.files?.length) {
        setUploading(true);
        uploadFiles(Array.from(input.files), endpoint)
          .then(setFileStatus)
          .finally(() => setUploading(false));
      }
    };
  }

  
  return (
    <Box>
      <Box>
        <Button variant="contained" onClick={() => selectAndUploadFiles()} disabled={uploading}><UploadIcon /></Button>
        <Button variant="contained" onClick={() => exportFiles(targetFileIds)} disabled={!targetFileIds.length}><DownloadIcon /></Button>
      </Box>

      <Backdrop
        sx={(theme) => ({ color: "#fff", backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: theme.zIndex.drawer + 1, flexDirection: "column" })}
        open={uploading || fileStatus.length > 0}
        onClick={() => !uploading && setFileStatus([])}
      >
        {/* TODO: THIS IS PRETTY JANKY, MAKE THIS LESS HORRIBLE LATER*/}
        {uploading && <style>{`body { overflow: hidden; }`}</style>}
        {/* {!uploading && fileStatus.length === 0 && <style>{`body { overflow: auto; }`}</style>} */}

        {/* <Typography variant="h6" sx={{ mb: 2 }}>
          {uploading ? "Uploading files..." : "Upload Status"}
        </Typography> */}

        <Box sx={{ width: "100%", padding: 2, overflowY: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
          {uploading ? <CircularProgress color="inherit" /> : fileStatus.map((s) => (
            <div key={s.filename} style={{ textAlign: "left", color: s.status !== "Uploaded" ? "red" : "inherit" }}>
              {s.filename}: {s.status}
            </div>
          ))}
        </Box>

      </Backdrop>
      
    </Box>
  );
}