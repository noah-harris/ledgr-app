import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import type { DocumentTag } from "../../types/DocumentTag";
import type { Document } from "../../types/Document";
import DataGrid from "../../components/common/DataGrid";
import { fetchApi } from "../../Api";
import type { GridColDef } from "@mui/x-data-grid";


// export default function DocumentPage() {
//   const [selectedTags, setSelectedTags] = useState<DocumentTag[]>([]);
//   const [breadcrumbDisplay, setBreadcrumbDisplay] = useState<string>(">");
//   const [initialDocuments, setInitialDocuments] = useState<Document[]>([]);
//   const [initialTags, setInitialTags] = useState<DocumentTag[]>([]);
//   const [remainingTags, setRemainingTags] = useState<DocumentTag[]>([]);
//   const [remainingDocuments, setRemainingDocuments] = useState<Document[]>([]);
//   const [_loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       fetchApi("/document/tags/used", {}, { hasAttributeValue: true }).then(r => r.json()),
//       fetchApi("/documents").then(r => r.json()),
//     ]).then(([tags, docs]) => {
//       setInitialTags(tags);
//       setRemainingTags(tags);
//       setInitialDocuments(docs);
//       setRemainingDocuments(docs);
//       setLoading(false);
//     });
//   }, []);


//   useEffect(() => {
//     updateBreadcrumbDisplay();
//     updateRemainingTags();
//     updateRemainingDocuments();
//   }, [selectedTags]);

  
//   function updateBreadcrumbDisplay() {
//     setBreadcrumbDisplay(selectedTags.map(tag => tag.name).join(" > "));
//   }


//   function updateRemainingDocuments() {
//     setRemainingDocuments(initialDocuments.filter(doc =>
//       selectedTags.every(tag =>
//         doc.tags.some(t => t.idDocumentTag === tag.id)
//       )
//     ));
//   }


//   function updateRemainingTags() {
//     setRemainingTags(initialTags.filter(tag =>
//       !selectedTags.some(selected => selected.id === tag.id)
//     ));
//   }


//   function handleTagSelection(selectedTagId: string) {
//     setSelectedTags(prev => {
//       const newSelectedTags = [...prev, remainingTags.find(tag => tag.id === selectedTagId)!];
//       updateBreadcrumbDisplay();
//       updateRemainingTags();
//       updateRemainingDocuments();
//       return newSelectedTags;
//     });
//   }

//   const columns: GridColDef<DocumentTag>[] = [
//     { 
//       field: "id", 
//       headerName: "ID", 
//       flex: 1, 
//       minWidth: 150 
//     },
//     {
//       field: "name",
//       headerName: "Name",
//       flex: 1,
//       minWidth: 150,
//     },
//   ];

//   return (
//     <Box>
//       {breadcrumbDisplay}

//       <DataGrid
//         rows={remainingTags}
//         columns={columns}
//         onSelect={(params) => handleTagSelection(params.row.id)} 
//       />

//       {/* just make a bunch of boxes representing remaining documents */}
//       {remainingDocuments.map(doc => (
//         <Box key={doc.id}>
//           {doc.name}
//         </Box>
//       ))}

//     </Box>
    
//   );
// }


export default function DocumentsPage() {
  const [allTags, setAllTags] = useState<DocumentTag[]>([]);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi("/document/tags/used", {}, { hasAttributeValue: false }).then(r => r.json()),
      fetchApi("/documents").then(r => r.json()),
    ]).then(([tags, docs]) => {
      setAllTags(tags);
      setAllDocuments(docs);
      setLoading(false);
    });
  }, []);

  // Derived on every render. No state, no effects, always in sync.
  const breadcrumb = selectedTags.map(t => t.name).join(" > ");

  const remainingTags = allTags.filter(tag =>
    !selectedTags.some(s => s.id === tag.id)
  );

  const remainingDocuments = allDocuments.filter(doc =>
    selectedTags.every(tag => doc.tags.some(t => t.idDocumentTag === tag.id))
  );

  const columns: GridColDef<DocumentTag>[] = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 150 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <Box>
      {breadcrumb}

      <DataGrid
        rows={remainingTags}
        columns={columns}
        onSelect={params => setSelectedTags(prev => [...prev, params.row])}
      />

      {remainingDocuments.map(doc => (
        <Box key={doc.id}>{doc.name}</Box>
      ))}
    </Box>
  );
}