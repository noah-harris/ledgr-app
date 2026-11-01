import { TextField, Button } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { v4 as uuidv4 } from "uuid";
import { Modal } from "../../components";
import type { DocumentTag } from "../../types";

export default function DocumentTagCreateModal(
  { open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (documentTag: any) => void }
) {

  return (
    <Modal
      title="ADD DOCUMENT TAG"
      onClose={onClose}
      open={open}
    >      
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        <TextField type="text" name="documentTagName" placeholder="Enter document tag name" />
      
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          sx={{ alignSelf: "flex-start", minWidth: 0, p: 0.5 }}
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
          <SaveIcon></SaveIcon>
        </Button>
      </form>
      
    </Modal>
  );
}