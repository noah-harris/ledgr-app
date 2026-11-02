import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import useCreateDocumentTag from "../../hooks/useCreateDocumentTag";
import AddIcon from '@mui/icons-material/Add';
import type { GridColDef } from "@mui/x-data-grid/models";
import { Typography } from "@mui/material";

import DataGrid from "../../components/common/DataGrid";
import type { DocumentTag } from "../../types";
import { fetchApi } from "../../Api";


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

      <Typography variant="h4">Manage Document Tags</Typography>

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