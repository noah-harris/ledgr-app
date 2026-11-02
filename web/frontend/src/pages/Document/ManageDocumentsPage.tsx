import { useState, useEffect } from "react";
import { formatDate } from "../../lib/format";
import { getDocuments } from "../../services/document";
import { getDocumentTags } from "../../services/document_tag";
import DocumentMenubar from "./Menubar";
import { onSubmitTagLink, onRemoveTagLink } from "../../services/document_tag";
import { Loading, DataGrid, TagList } from "../../components";
import { exportFiles } from "../../services/files";
import type { DocumentView, DocumentTag } from "../../types";
import type { GridColDef, GridRowId } from "@mui/x-data-grid/models";


export default function ManageDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentView[]>([]);
  const [documentTags, setDocumentTags] = useState<DocumentTag[]>([]);
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>([]);
  const [_file, setFile] = useState<File | null>(null);

  useEffect(() => {
    getDocuments({ setDocuments });
    getDocumentTags({ setDocumentTags });
  }, []);

  const columns: GridColDef<DocumentView>[] = [
    { field: "idDocument", headerName: "ID", },
    { field: "FileName", headerName: "Document",  valueGetter: (_value: string, doc: DocumentView) => `${doc.FileName}.${doc.FileExtension}` },
    { field: "FileExtension", headerName: "Extension"},
    { field: "Tags", headerName: "Tags",
      renderCell: (params) => (
        <TagList
          tags={params.row.Tags}
          allTags={documentTags}
          onAddTag={async (tag: string) => { await onSubmitTagLink(params.row.idUsers, params.row.idDocument, tag, documentTags) }}
          onRemoveTag={async (tag) => { await onRemoveTagLink(tag); }} 
          refresh={() => {getDocuments({ setDocuments }); }}
        />
      )
    },
    { field: "Created", headerName: "Created", width: 150, valueGetter: (_value: string, doc: DocumentView) => formatDate(doc.Created) },
  ];


  if (!documents.length) return <Loading />;

  return (
    <>
      <DocumentMenubar 
        onExport={() => { exportFiles((() => {
          const selectedRows = documents.filter(doc => selectedIds.includes(doc.idDocument));
          const ids = selectedRows.map(row => row.idFile.toString());
          return ids;
        })());}
      }
        onShare={() => { console.log("Share clicked") }}
      />
      <DataGrid
        rows={documents}
        columns={columns}
        getRowId={(row) => row.idDocument}
        onSelect={(params) => setFile(params.row)}
        onSelectionChange={(ids) => setSelectedIds(ids)}
        checkboxSelection
        hiddenColumns={["idDocument"]}
        width="fit"
      />
    </>
  );
}
