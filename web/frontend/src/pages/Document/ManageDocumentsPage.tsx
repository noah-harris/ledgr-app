import { useState, useEffect } from "react";
import openFile from "../../lib/openFile";
import { useFileExport } from "../../hooks";
import { formatDate } from "../../lib/format";
import { getDocuments } from "../../services/document";
import { getDocumentTags } from "../../services/document_tag";
import { onSubmitTagLink, onRemoveTagLink } from "../../services/document_tag";
import { Loading, DataGrid, TagList, DocumentMenubar } from "../../components";
import type { DocumentView, DocumentTag } from "../../types";
import type { GridColDef, GridRowId } from "@mui/x-data-grid/models";


export default function ManageDocumentsPage() {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowId[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  
  const [documents, setDocuments] = useState<DocumentView[]>([]);
  const [documentTags, setDocumentTags] = useState<DocumentTag[]>([]);
  const { exportFiles } = useFileExport(selectedFileIds);
  
  useEffect(() => {
    const selectedRows = documents.filter(doc => selectedRowIds.includes(doc.idDocument));
    const ids = selectedRows.map(row => row.idFile.toString());
    setSelectedFileIds(ids);
  }, [selectedFileIds, documents]);

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
      <DocumentMenubar exportFiles={exportFiles}/>
      <DataGrid
        rows={documents}
        columns={columns}
        getRowId={(row) => row.idDocument}
        onSelectionChange={(ids) => setSelectedRowIds(ids)}
        onSelect={(params) => {openFile(params.row.idFile)}}
        checkboxSelection
        hiddenColumns={["idDocument"]}
        width="fit"
      />
    </>
  );
}
