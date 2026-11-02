import { useState } from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { fetchApi } from "../Api";
import type { FileStatus } from "../types";

export default function useFileUpload(endpoint: string) {
  const [uploading, setUploading] = useState(false);
  const [fileStatus, setFileStatus] = useState<{ filename: string; status: string }[]>([]);

  function uploadFiles(files: File[], endpoint: string): Promise<FileStatus[]> {
    return Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetchApi(endpoint, { method: "POST", body: formData });
        if (res.ok) return { filename: file.name, status: "Uploaded" };
        return { filename: file.name, status: res.status === 409 ? "Already exists" : "Server error" };
      } catch (error) {
        console.error(error);
        return { filename: file.name, status: "Server error" };
      }
    }));
  }

  function selectAndUploadFiles() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = () => {
      if (!input.files?.length) return;
      setUploading(true);
      uploadFiles(Array.from(input.files), endpoint)
        .then(setFileStatus)
        .finally(() => setUploading(false));
    };
    input.click();
  }


  const backdrop = (
    <Backdrop
      sx={(theme) => ({ color: "#fff", backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: theme.zIndex.drawer + 1, flexDirection: "column" })}
      open={uploading || fileStatus.length > 0}
      onClick={() => !uploading && setFileStatus([])}
    >
      {uploading && <style>{`body { overflow: hidden; }`}</style>}
      <Box sx={{ width: "100%", padding: 2, overflowY: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {uploading ? <CircularProgress color="inherit" /> : fileStatus.map((s) => (
          <div key={s.filename} style={{ textAlign: "left", color: s.status !== "Uploaded" ? "red" : "inherit" }}>
            {s.filename}: {s.status}
          </div>
        ))}
      </Box>
    </Backdrop>
  );

  return { selectAndUploadFiles, uploading, backdrop };
}