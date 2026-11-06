import { useFileViewer, useDocument } from "../../hooks";
import { useEffect, useState } from "react";
import type { DocumentView, DocumentTag } from "../../types";
import { fetchApi } from "../../Api";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid, DocumentMenubar } from "../../components";
import { Box, Button } from "@mui/material";


export default function TagUntaggedDocumentsToolPage() {
  const [document, setDocument] = useState<DocumentView | null | undefined>();
  const { setFileId, viewer } = useFileViewer();
  const { documentTags, linkDocumentTag } = useDocument();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);


  // if the response is not okay, thenset the document to undefined
  useEffect(() => {
    if (document == null) {
      fetchApi("/document/untagged")
      .then((response) => { if (!response.ok || undefined) { setDocument(undefined) }  return response })
      .then((response) => response.json())
      .then((doc) => {
        setDocument(doc[0]);
      });
    }
  }, [document]);

  // Update the file viewer whenever the document changes
  useEffect(() => {
    if (document?.idFile) {
      setFileId(document.idFile);
    }
  }, [document]);


  function onLinkTags() {
    for (const tagId of selectedTagIds) {
      linkDocumentTag(document!.idDocument, tagId);
    }
    setSelectedTagIds([]);
    setDocument(null);
  }

  const columns: GridColDef<DocumentTag>[] = [
    { field: "idDocumentTag", headerName: "ID" },
    { field: "DocumentTagName", headerName: "Tag" },
  ];
  

  return document ? (
    <>
      <DocumentMenubar exportFiles={() => {}} />
      <Box style = {{ display: "flex", flexDirection: "row", gap: "2rem" }}>
      {viewer}
      <DataGrid
        rows={documentTags}
        columns={columns}
        getRowId={(row) => row.idDocumentTag}
        onSelectionChange={(ids) => setSelectedTagIds(() => ids as string[])}
        checkboxSelection
        hiddenColumns={["idDocumentTag"]}
        width="fit"
      />
      <Button
        variant="contained"
        onClick={onLinkTags}
      >
        Link Tags
      </Button>
    </Box>
    </>
  ) : <div>No untagged documents found</div>
}
  
