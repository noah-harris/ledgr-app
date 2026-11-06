import { useState, useEffect } from "react";
import { useFileExport, useDocument} from "../../hooks";
import { formatDate, openFile } from "../../lib";
import { Loading, DataGrid, TagList, DocumentMenubar } from "../../components";
import type { DocumentView } from "../../types";
import type { GridColDef, GridRowId } from "@mui/x-data-grid/models";


export default function ManageDocumentsPage() {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowId[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const { exportFiles } = useFileExport(selectedFileIds);
  const { documents, loading } = useDocument();


  useEffect(() => {
    const selectedRows = documents.filter(doc => selectedRowIds.includes(doc.idDocument));
    const ids = selectedRows.map(row => row.idFile.toString());
    setSelectedFileIds(ids);
  }, [selectedRowIds, documents]);

  const columns: GridColDef<DocumentView>[] = [
    { field: "idDocument", headerName: "ID", },
    { field: "FileName", headerName: "Document",  valueGetter: (_value: string, doc: DocumentView) => `${doc.FileName}.${doc.FileExtension}` },
    { field: "FileExtension", headerName: "Extension"},
    { field: "Tags", headerName: "Tags", renderCell: (params) => (<TagList idDocument={params.row.idDocument} />) },
    { field: "Created", headerName: "Created", valueGetter: (_value: string, doc: DocumentView) => formatDate(doc.Created) },
  ];

  if (loading) return <Loading />;

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
