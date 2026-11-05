import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "../../components";
import { useCreateDocumentTag, useDocument } from "../../hooks";
import type { DocumentTag } from "../../types";
import type { GridColDef } from "@mui/x-data-grid/models";

const columns: GridColDef<DocumentTag>[] = [
  { field: "idDocumentTag", headerName: "ID" },
  { field: "DocumentTagName", headerName: "Name", valueGetter: (_value: string, tag: DocumentTag) => tag.DocumentTagName }
];

export default function ManageDocumentTagPage() {
  const { documentTags } = useDocument();
  const { modal: createDocumentTagModal, open: openCreateDocumentTagModal } = useCreateDocumentTag();

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