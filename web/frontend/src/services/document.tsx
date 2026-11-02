
import { fetchApi } from "../Api";

// Function to get all documents
export function getDocuments({setDocuments}: {setDocuments: (docs: any[]) => void}) {
  return fetchApi("/documents").then(r => r.json()).then(docs => {setDocuments(docs);});
}

