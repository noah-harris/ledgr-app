import { useState, useEffect } from "react";
import type { GridColDef } from "@mui/x-data-grid/models";
import DataGrid from "../../components/common/DataGrid";
import type { DocumentTagLink, DocumentView } from "../../types";
import { formatDate } from "../../lib/format";
import { fetchApi } from "../../Api";
import TagList from "./TagList";
import type { DocumentTag } from "../../types";


async function onSubmitTagLink(idUsers: string, idDocument: string, tagName: string, allTags: DocumentTag[]) {
  const documentTag:DocumentTag|undefined = allTags.find(t => t.DocumentTagName === tagName);
  if (!documentTag) {
    throw new Error(`Tag with name ${tagName} not found`);
  }
  let documentTagLink: DocumentTagLink = { 
    idUsers, 
    idDocument, 
    idDocumentTag: documentTag.idDocumentTag,
    Created: new Date().toISOString(),
    Updated: new Date().toISOString()
  };

  fetchApi(`/document/tag/link`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(documentTagLink),
  });
}

export default function ManageDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentView[]>([]);
  const [allTags, setAllTags] = useState<DocumentTag[]>([]);

  useEffect(() => {
    fetchApi("/documents")
      .then(r => r.json())
      .then(docs => {setDocuments(docs);});
  }, []);

  useEffect(() => {
    fetchApi("/document/tags")
      .then(r => r.json())
      .then(tags => {setAllTags(tags);});
  }, []);

const columns: GridColDef<DocumentView>[] = [
  { field: "idDocument", headerName: "ID", width: 150 },
  { field: "FileName", headerName: "Document", width: 250, valueGetter: (_value: string, doc: DocumentView) => `${doc.FileName}.${doc.FileExtension}` },
  { field: "FileExtension", headerName: "Extension", width: 100 },
  { field: "Tags", headerName: "Tags", width: 300,
    renderCell: (params) => (
      <TagList
        tags={params.row.Tags}
        allTags={allTags}
        onAddTag={async (tag: string) => { await onSubmitTagLink(params.row.idUsers, params.row.idDocument, tag, allTags) }}
        refresh={() => {
          fetchApi("/documents")
            .then(r => r.json())
            .then(docs => { setDocuments(docs); });
        }}
      />
    )
  },
  { field: "Created", headerName: "Created", width: 150, valueGetter: (_value: string, doc: DocumentView) => formatDate(doc.Created) },
];

return (
  <DataGrid
    rows={documents}
    columns={columns}
    getRowId={(row) => row.idDocument}
    hiddenColumns={["idDocument"]}
    width="fit"
  />
);

}
