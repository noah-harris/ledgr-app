import type { DocumentTagLink, DocumentTag } from "../types";
import { fetchApi } from "../Api";

// Function to add a tag link to a document
export async function onSubmitTagLink(idUsers: string, idDocument: string, tagName: string, allTags: DocumentTag[]) {
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

// Function to remove a tag link from a document
export async function onRemoveTagLink(tag: DocumentTagLink) {
  await fetchApi(`/document/tag/link`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  });
}

// Function to get all document tags
export function getDocumentTags({setDocumentTags}: {setDocumentTags: (tags: DocumentTag[]) => void}) {
  return fetchApi("/document/tags")
    .then(r => r.json())
    .then(tags => {setDocumentTags(tags);});
}
