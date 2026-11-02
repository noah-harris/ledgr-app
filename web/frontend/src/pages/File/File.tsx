import { useEffect, useState } from "react";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { formatFileSize } from "../../lib/format";
import { getFiles } from "../../services/files";
import { DataGrid, Loading } from "../../components";
import type { File } from "../../types";
import { fetchApi } from "../../Api";

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
  const [_selectedIds, setSelectedIds] = useState<GridRowId[]>([]);

  useEffect(() => { 
    setLoading(true);
    getFiles({ setFiles });
    setLoading(false);
  }, []);


  if (loading) return <Loading />;

  return (
    <>

      <DataGrid
        rows={files}
        columns={columns}
        getRowId={(row) => row.idFile}
        onSelect={async (params) => {
          const tab = window.open("", "_blank");
          const res = await fetchApi(`/file/download?idFile=${params.row.idFile}`);
          if (!res.ok || !tab) { tab?.close(); return; }
          tab.location.href = URL.createObjectURL(await res.blob());
        }}
        onSelectionChange={(ids) => setSelectedIds(ids)}
        checkboxSelection
        hiddenColumns={["idFile"]}
        width="fit"
      />

    </>
  );
}