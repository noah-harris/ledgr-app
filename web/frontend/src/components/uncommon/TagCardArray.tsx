import type { Dispatch, SetStateAction } from "react";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import type { DocumentTag } from "../../types/generated";

export default function TagCardArray({ tags, setSelectedTags }: { tags: DocumentTag[], setSelectedTags: Dispatch<SetStateAction<DocumentTag[]>> }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {tags.map(tag => (
        <Card key={tag.idDocumentTag} data-tag-id={tag.idDocumentTag} sx={{ width: 160, height: 160 }}>
          <CardActionArea onClick={() => setSelectedTags(prev => [...prev, tag])} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6">{tag.DocumentTagName}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}