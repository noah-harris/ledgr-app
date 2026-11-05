import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi, fetchJson } from "../Api";
import { queryKeys } from "../lib";
import type { DocumentView, DocumentTag, DocumentTagLink } from "../types";
import { useUser } from "../hooks";

// Stable references: pages list these results in effect dependencies.
const NO_DOCUMENTS: DocumentView[] = [];
const NO_DOCUMENT_TAGS: DocumentTag[] = [];

export default function useDocument() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const documentsQuery = useQuery({
    queryKey: queryKeys.documents,
    queryFn: () => fetchJson<DocumentView[]>("/documents"),
  });
  const documentTagsQuery = useQuery({
    queryKey: queryKeys.documentTags,
    queryFn: () => fetchJson<DocumentTag[]>("/document/tags"),
  });
  const documents = documentsQuery.data ?? NO_DOCUMENTS;
  const documentTags = documentTagsQuery.data ?? NO_DOCUMENT_TAGS;
  const loading = documentsQuery.isPending || documentTagsQuery.isPending;

  function getDocument(idDocument: string) {
    let document = documents.find(doc => doc.idDocument === idDocument)
    if (!document) throw new Error(`Document with id ${idDocument} not found`);
    return document;
  }

  async function linkDocumentTag(idDocument:string, idDocumentTag: string) {
    if (!user || !user.idUsers) throw new Error("User not logged in");
    let documentTagLink: DocumentTagLink = { 
      idUsers: user.idUsers, 
      idDocument, 
      idDocumentTag,
      Created: new Date().toISOString(),
      Updated: new Date().toISOString()
    };

    await fetchApi(`/document/tag/link`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(documentTagLink),
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.documents });
  }

  async function unlinkDocumentTag(idDocument:string, idDocumentTag: string) {
    if (!user || !user.idUsers) throw new Error("User not logged in");
    let documentTagLink: DocumentTagLink = { 
      idUsers: user.idUsers, 
      idDocument, 
      idDocumentTag,
      Created: new Date().toISOString(),
      Updated: new Date().toISOString()
    };

    await fetchApi(`/document/tag/link`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(documentTagLink),
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.documents });
  }

  return { documents, documentTags, loading, getDocument, linkDocumentTag, unlinkDocumentTag };
}