import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import type { DocumentView } from "../../types/generated";
import { openFile } from "../../lib";
import TagList from "./TagList";

export default function DocumentCardArray({ documents }: { documents: DocumentView[] }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {documents.map(doc => (
        <Card key={doc.idDocument} data-document-id={doc.idDocument} >
          <CardActionArea onClick={() => openFile(doc.idFile)}>
            <CardContent>
              <Typography variant="h6">{doc.FullFileName}</Typography>
              <TagList idDocument={doc.idDocument}/>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}