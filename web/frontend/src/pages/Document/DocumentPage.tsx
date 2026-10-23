import { useEffect, useState } from "react";
import Loading from "../../components/common/Loading";
import Box from "@mui/material/Box";
import type { GridColDef } from "@mui/x-data-grid";
import type { DocumentTag } from "../../types/DocumentTag";
import type { Document } from "../../types/Document";
import DataGrid from "../../components/common/DataGrid";
import { fetchApi } from "../../Api";
import Modal from "../../components/common/Modal";
import FileViewer from "../../components/common/FileViewer";
import TagBreadcrumb from "./TagBreadcrumb";
import { formatDate } from "../../lib/format";

const tagColumns: GridColDef<DocumentTag>[] = [
  { field: "id", headerName: "ID", flex: 1, minWidth: 150 },
  { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
];

const documentColumns: GridColDef<Document>[] = [
  { field: "id", headerName: "ID", flex: 1, minWidth: 150 },
  { field: "name", headerName: "Document", flex: 1, minWidth: 150, valueGetter: (_value: string, doc: Document) => `${doc.name}.${doc.extension}` },
  { field: "created", headerName: "Created", flex: 1, minWidth: 150, valueGetter: (_value: string, doc: Document) => formatDate(doc.created) },
];

export default function DocumentsPage() {
  const [allTags, setAllTags] = useState<DocumentTag[]>([]);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<Document | null>(null);

  useEffect(() => {
    Promise.all([
      fetchApi("/document/tags/used", {}, { hasAttributeValue: false }).then(r => r.json()),
      fetchApi("/documents").then(r => r.json()),
    ])
      .then(([tags, docs]) => {
        setAllTags(tags);
        setAllDocuments(docs);
      })
      .finally(() => setLoading(false));
  }, []);

  // Documents that have every selected tag
  const selectedIds = new Set(selectedTags.map(t => t.id));
  const remainingDocuments = allDocuments.filter(doc =>
    selectedTags.every(tag => doc.tags.some(t => t.idDocumentTag === tag.id))
  );

  // Unselected tags that still appear on at least one remaining document
  const tagIdsInDocs = new Set(remainingDocuments.flatMap(doc => doc.tags.map(t => t.idDocumentTag)));
  const remainingTags = allTags.filter(tag => !selectedIds.has(tag.id) && tagIdsInDocs.has(tag.id));

  if (loading) return <Loading />;

  return (
    <Box>
      <TagBreadcrumb selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

      {remainingTags.length > 1 ? (
        <DataGrid
          rows={remainingTags}
          columns={tagColumns}
          onSelect={params => setSelectedTags(prev => [...prev, params.row])}
        />
      ) : (
        <DataGrid
          rows={remainingDocuments}
          columns={documentColumns}
          onSelect={params => setFile(params.row)}
        />
      )}

      <Modal open={file !== null} onClose={() => setFile(null)} title={file?.name ?? ""}>
        {file && <FileViewer path={file.download} />}
      </Modal>
    </Box>
  );
}