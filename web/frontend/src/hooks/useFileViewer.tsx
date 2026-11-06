import { useState } from "react";
import { Box } from "@mui/material";
import { FileViewer } from "../components";
import { fetchApi } from "../Api";
import type { File } from "../types";

export default function useFileViewer() {
  const [file, setFile] = useState<File | undefined>();

  function setFileId(idFile:string|undefined) {
    if (!idFile) {
      setFile(undefined);
    }
    else {
      fetchApi(`/file?idFile=${idFile}`)
      .then((response) => response.json())
      .then((file => setFile(file)));
    }
  } 

  const viewer = (
    file ? file?.DownloadEndpoint && <FileViewer path={file?.DownloadEndpoint} /> : <Box>File not found</Box>
  );

  return {
    file,
    setFile,
    setFileId,
    viewer,
  };
}