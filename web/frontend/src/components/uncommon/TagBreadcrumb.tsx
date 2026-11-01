import { Box, Typography } from "@mui/material";
import type { DocumentTag } from "../../types";

export default function TagBreadcrumb( { selectedTags, setSelectedTags }: { selectedTags: DocumentTag[]; setSelectedTags: (tags: DocumentTag[]) => void }) {

  function handleTagClick(index: number) {
    setSelectedTags(selectedTags.slice(0, index + 1));
    if (index === selectedTags.length - 1) {
      setSelectedTags([]);
    }
  }

  return (
    <Box sx={{ fontSize: "1.25rem", px: 2, py: 1.5 }}>
      <Typography>
        {" > "}
        {selectedTags.map((tag, index) => (
          <span key={tag.idDocumentTag} onClick={() => handleTagClick(index)} style={{ cursor: "pointer" }}>
            {tag.DocumentTagName}
            {index < selectedTags.length - 1 && " > "}
          </span>
        ))}
      </Typography>
    </Box>
  );
}
