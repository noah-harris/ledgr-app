import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "../../components";
import { useCreateDocumentTag } from "../../hooks";
import { fetchApi } from "../../Api";
import type { DocumentTag } from "../../types";
import type { GridColDef } from "@mui/x-data-grid/models";

const columns: GridColDef<DocumentTag>[] = [
  { field: "idDocumentTag", headerName: "ID" },
  { field: "DocumentTagName", headerName: "Name", valueGetter: (_value: string, tag: DocumentTag) => tag.DocumentTagName }
];

export default function ManageDocumentTagPage() {
  const [documentTags, setDocumentTags] = useState<DocumentTag[]>([]);
  const { modal: createDocumentTagModal, open: openCreateDocumentTagModal } = useCreateDocumentTag();

  useEffect(() => {
    fetchApi("/document/tags")
      .then(response => response.json())
      .then(data => setDocumentTags(data))
      .catch(error => console.error(error));
  }, []);
    
  return (
    <>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => openCreateDocumentTagModal()}
        sx={{ alignSelf: "center", minWidth: 0, p: 0.5 }}
      >
        <AddIcon />
      </Button>

      <DataGrid 
        getRowId={(row) => row.idDocumentTag}
        columns={columns}
        rows={documentTags}
        hiddenColumns={["idDocumentTag"]}
        width="fit"
      />
      
      {createDocumentTagModal}
    </>
  );
}