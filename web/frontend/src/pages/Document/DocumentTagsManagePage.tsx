import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import type { GridColDef } from "@mui/x-data-grid/models";
import { Typography } from "@mui/material";

import DataGrid from "../../components/common/DataGrid";
import DocumentTagCreateModal from "./CreateDocumentTag";
import type { DocumentTag } from "../../types";
import { fetchApi } from "../../Api";


const columns: GridColDef<DocumentTag>[] = [
  { 
    field: "idDocumentTag", 
    headerName: "ID", 
    flex: 1, 
    minWidth: 150 
  },
  {
    field: "DocumentTagName",
    headerName: "Name",
    flex: 1,
    minWidth: 150,
    valueGetter: (_value: string, tag: DocumentTag) => tag.DocumentTagName,
  }
];


function onSubmitNewModal(documentTag: DocumentTag) {
  fetchApi("/document/tag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(documentTag)
  })
    .then(response => response.json())
    .catch(error => console.error(error));
}

export default function ManageDocumentTagPage() {
  const [documentTags, setDocumentTags] = useState<DocumentTag[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchApi("/document/tags")
      .then(response => response.json())
      .then(data => setDocumentTags(data))
      .catch(error => console.error(error));
  }, []);
    
  return (
    <>
      <Typography variant="h4">Manage Document Tags</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setIsCreateModalOpen(true)}
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

      <DocumentTagCreateModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={onSubmitNewModal}
      />
    </>
  );
}