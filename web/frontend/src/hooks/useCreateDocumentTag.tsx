import { useState } from "react";
import { TextField, Button } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { v4 as uuidv4 } from "uuid";
import { fetchApi } from "../Api";
import { Modal } from "../components";
import type { DocumentTag } from "../types";


function onSubmitNewModal(documentTag: DocumentTag) {
  fetchApi("/document/tag", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(documentTag)})
    .then(response => response.json())
    .catch(error => console.error(error));
}

export default function useCreateDocumentTag() {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);

  const modal = (
    <Modal
      title="Create Document Tag"
      onClose={() => setVisible(false)}
      open={visible}
    >      
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        <TextField type="text" name="documentTagName" placeholder="Enter new tag..." />
      
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
            onSubmitNewModal(documentTag);
            setVisible(false);
          }}
        >
          <SaveIcon></SaveIcon>
        </Button>
      </form>
      
    </Modal>
  )



  return { modal, open };
}