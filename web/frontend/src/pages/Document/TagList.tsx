import type { DocumentTagLinkView } from "../../types";
import { useState } from "react";
import { Autocomplete, Chip, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { DocumentTag } from "../../types";

// TODO:

export default function TagList({ tags, allTags, onAddTag, onRemoveTag, refresh }: { 
  tags: DocumentTagLinkView[]; 
  allTags: DocumentTag[]; 
  onAddTag: (tag: string) => Promise<void>; 
  onRemoveTag: (tag: DocumentTagLinkView) => Promise<void>; 
  refresh: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const tagNames = tags.map(tag => tag.DocumentTagName).sort();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, height: "100%", overflow: "hidden" }}>
      {
        tags
        .sort((a, b) => a.DocumentTagName.localeCompare(b.DocumentTagName))
        .map((tag) => (
          <Chip label={tag.DocumentTagName} onDelete={() => { onRemoveTag(tag); refresh(); }} size="small" />
        ))
      }

      {adding ? (
        <Autocomplete
          freeSolo
          size="small"
          options={allTags.map(t => t.DocumentTagName).filter((t) => !tagNames.includes(t))}
          onChange={async (_, value) => {
            const tag: DocumentTag | undefined = allTags.find(t => t.DocumentTagName === value);
            if (tag && !tagNames.includes(tag.DocumentTagName)) await onAddTag(tag.DocumentTagName);
            setAdding(false);
            refresh();
          }}
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
          renderInput={(params) => (
            <TextField {...params} autoFocus placeholder="Add tag" />
          )}
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



// export default function TagList({ tags }: { tags: string[] }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 6, height: "100%", overflow: "hidden" }}>
//       {tags.map((tag) => (
//         <span
//           key={tag}
//           style={{
//             padding: "3px 10px",
//             borderRadius: 999,
//             backgroundColor: "#e8e8e8",
//             color: "#333",
//             fontSize: 12,
//             lineHeight: 1.4,
//             whiteSpace: "nowrap",
//             flexShrink: 0,
//           }}
//         >
//           {tag}
//         </span>
//       ))}
      
//       <span
//         style={{
//           display: "inline-flex",
//           alignItems: "center",
//           justifyContent: "center",
//           width: 22,
//           height: 22,
//           borderRadius: "50%",
//           backgroundColor: "#e8e8e8",
//           color: "#333",
//           cursor: "pointer",
//           flexShrink: 0,
//         }}
//       >
//         <IconButton size="small" sx={{ width: 22, height: 22, bgcolor: "#e8e8e8", "&:hover": { bgcolor: "#d6d6d6" } }}>
//           <AddIcon sx={{ fontSize: 14 }} />
//         </IconButton>
//       </span>
//     </div>
//   );
// }


// export default function TagList({tags}: {tags: string[]}) {

//   return (
//     <>
//       {tags.map((tag) => (
//         <span key={tag} style={{ padding: "4px 8px", margin: "2px", backgroundColor: "#e0e0e0", borderRadius: "4px", display: "inline-block" }}>
//           {tag}
//         </span>
//       ))}
//     </>  
//   );
// }
