import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import type { FileTag } from "../../types/FileTag";
import Listbox from "../../components/common/ListBox";
import { fetchApi } from "../../Api";


export default function Document() {
  const [fileTags, setFileTags] = useState<FileTag[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchApi("/file-tag")
      .then((res) => res.json())
      .then(setFileTags);
  }, []);


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField label="Search"/>
        <Box>
          <Button variant="contained">Export</Button>
          <Button variant="outlined">Delete</Button>
          <Button variant="text">Upload</Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Listbox
          items={fileTags.map((a) => ({ id: a.id, label: a.name }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </Box>

    </Box>
  );
}