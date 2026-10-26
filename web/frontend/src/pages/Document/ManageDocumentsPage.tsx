import { useState, useEffect } from "react";
import type { GridColDef } from "@mui/x-data-grid/models";
import DataGrid from "../../components/common/DataGrid";
import type { DocumentTagLink, DocumentView } from "../../types";
import { formatDate } from "../../lib/format";
import { fetchApi } from "../../Api";
import TagList from "./TagList";
import type { DocumentTag } from "../../types";
import Loading from "../../components/common/Loading";



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

  await fetchApi(`/document/tag/link`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(documentTagLink),
  });
}

async function onRemoveTagLink(tag: DocumentTagLink) {
  await fetchApi(`/document/tag/link`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
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
  { field: "idDocument", headerName: "ID", },
  { field: "FileName", headerName: "Document",  valueGetter: (_value: string, doc: DocumentView) => `${doc.FileName}.${doc.FileExtension}` },
  { field: "FileExtension", headerName: "Extension"},
  { field: "Tags", headerName: "Tags",
    renderCell: (params) => (
      <TagList
        tags={params.row.Tags}
        allTags={allTags}
        onAddTag={async (tag: string) => { await onSubmitTagLink(params.row.idUsers, params.row.idDocument, tag, allTags) }}
        onRemoveTag={async (tag) => { await onRemoveTagLink(tag); }} 
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

  if (!documents.length) return <Loading />;

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
