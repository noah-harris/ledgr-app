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
  },
  { 
    field: "hasAttributeValue", 
    headerName: "Settable Value", 
    width: 140 
  }
];


function onSubmitNewModal(documentTag: DocumentTag) {
  // Send Post Request to create a new document tag
  fetchApi("/document/tag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(documentTag)
  })
    .then(response => response.json())
    .then(data => console.log(data))
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
    <div>
      <Typography variant="h4" gutterBottom>Manage Document Tags</Typography>

      <DataGrid 
        getRowId={(row) => row.idDocumentTag}
        columns={columns}
        rows={documentTags}
        hiddenColumns={["idDocumentTag"]}
        
        
      />

      <Button 
        variant="contained" 
        color="primary"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <AddIcon />
      </Button>

      <DocumentTagCreateModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={onSubmitNewModal}
      />

    </div>
  );
}