import Modal from "../../components/common/Modal";
import { TextField, Button } from "@mui/material";
import type { DocumentTag } from "../../types";
import { v4 as uuidv4 } from "uuid";



export default function DocumentTagCreateModal(
  { open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (documentTag: any) => void }
) {


  return (
    <Modal
      title="Create Document Tag"
      onClose={onClose}
      open={open}
    >      
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        <label>
          Document Tag Name:
          <TextField type="text" name="documentTagName" />
        </label>

        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            const form = e.currentTarget.form;
            const documentTag: DocumentTag = {
              idUsers: null,
              idDocumentTag: uuidv4(),
              DocumentTagName: form?.documentTagName.value,
              isDefaultDocumentTag: null,
              Created: new Date().toISOString(),
              Updated: new Date().toISOString(),
            };
            onSubmit(documentTag);
            onClose();
          }}
        >
          Create
        </Button>
      </form>
      
    </Modal>
  );
}