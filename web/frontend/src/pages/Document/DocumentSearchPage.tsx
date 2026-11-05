import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, Loading, TagBreadcrumb } from "../../components";
import { fetchApi } from "../../Api";
import { formatDate, openFile } from "../../lib";
import type { GridColDef } from "@mui/x-data-grid";
import type { DocumentTag, DocumentView } from "../../types";

const tagColumns: GridColDef<DocumentTag>[] = [
  { field: "idDocumentTag", headerName: "ID" },
  { field: "DocumentTagName", headerName: "Name" },
];

const documentColumns: GridColDef<DocumentView>[] = [
  { field: "idDocument", headerName: "ID" },
  { field: "FileName", headerName: "Document", valueGetter: (_value: string, doc: DocumentView) => `${doc.FileName}.${doc.FileExtension}` },
  { field: "Created", headerName: "Created", valueGetter: (_value: string, doc: DocumentView) => formatDate(doc.Created) },
];

const getTagId = (row: DocumentTag) => row.idDocumentTag;
const getDocumentId = (row: DocumentView) => row.idDocument;
const tagHiddenColumns = ["idDocumentTag"];
const documentHiddenColumns = ["idDocument"];

export default function DocumentsSearchPage() {
  const [allTags, setAllTags] = useState<DocumentTag[]>([]);
  const [allDocuments, setAllDocuments] = useState<DocumentView[]>([]);
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi("/document/tags/used").then(r => r.json()),
      fetchApi("/documents").then(r => r.json()),
    ])
      .then(([tags, docs]) => {
        setAllTags(tags);
        setAllDocuments(docs);
      })
      .finally(() => setLoading(false));
  }, []);

  // Documents that have every selected tag
  const selectedIds = new Set(selectedTags.map(t => t.idDocumentTag));
  const remainingDocuments = allDocuments.filter(doc =>
    selectedTags.every(tag => (doc.Tags ?? []).some(t => t.idDocumentTag === tag.idDocumentTag))
  );

  // Unselected tags that still appear on at least one remaining document
  const tagIdsInDocs = new Set(remainingDocuments.flatMap(doc => (doc.Tags ?? []).map(t => t.idDocumentTag)));
  const remainingTags = allTags.filter(tag => !selectedIds.has(tag.idDocumentTag) && tagIdsInDocs.has(tag.idDocumentTag));

  if (loading) return <Loading />;

  return (
    <Box>
      <TagBreadcrumb selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

      {remainingTags.length > 1 ? (
        <DataGrid
          key="tags"
          rows={remainingTags}
          columns={tagColumns}
          onSelect={params => setSelectedTags(prev => [...prev, params.row])}
          getRowId={getTagId}
          hiddenColumns={tagHiddenColumns}
          width="fit"
        />
      ) : (
        <DataGrid
          key="documents"
          rows={remainingDocuments}
          columns={documentColumns}
          onSelect={params => openFile(params.row.idFile)}
          getRowId={getDocumentId}
          hiddenColumns={documentHiddenColumns}
          width="fit"
        />
      )}

    </Box>
  );
}