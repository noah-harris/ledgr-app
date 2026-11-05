import { useState  } from "react";
import { Autocomplete, Chip, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDocument } from "../../hooks"
import type {  DocumentTag, DocumentView } from "../../types";

export default function TagList({document}: {document: DocumentView}) {
  const [adding, setAdding] = useState(false);
  const { documentTags, linkDocumentTag, unlinkDocumentTag } = useDocument();
  

  async function onChangeTag(selectedTagName: string|null) {
    setAdding(false);
    if (!selectedTagName) return;
    const tag:DocumentTag|undefined = documentTags.find(tag => tag.DocumentTagName === selectedTagName);
    if (!tag) return;
    await linkDocumentTag(document.idDocument, tag.idDocumentTag);
    setAdding(false);
  }


  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, height: "100%", overflow: "hidden" }}>
      {
        document.Tags
        .sort((a, b) => a.DocumentTagName.localeCompare(b.DocumentTagName))
        .map((tag) => (
          <Chip 
            label={tag.DocumentTagName} 
            onDelete={() => { unlinkDocumentTag(document.idDocument, tag.idDocumentTag); }} 
            size="small" 
          />
          )
        )
      }

      {adding ? (
        <Autocomplete
          freeSolo
          size="small"
          options={ documentTags.map(t => t.DocumentTagName).filter((t) => !document.Tags.map(tag => tag.DocumentTagName).sort().includes(t)) }
          onChange={(_, selectedTagName) => { onChangeTag(selectedTagName); }}
          onBlur={() => setAdding(false)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") setAdding(false);
          }}
          sx={{
            width: 140,
            height: 24,
            "& .MuiFormControl-root": { height: 24 },
            "& .MuiInputBase-root": {
              height: 24,
              p: "0 10px !important",
              fontSize: 12,
              borderRadius: 999,
            },
            "& .MuiInputBase-input": { p: "0 !important", height: "100%" },
          }}

          renderInput={(params) => (<TextField {...params} autoFocus placeholder="Add tag" />)}

        />
      ) : (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setAdding(true);
          }}
          sx={{ width: 22, height: 22, bgcolor: "#e8e8e8", "&:hover": { bgcolor: "#d6d6d6" } }}
        >
          <AddIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </div>
  );
}
