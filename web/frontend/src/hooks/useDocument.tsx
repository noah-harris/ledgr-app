import { useQuery } from "@tanstack/react-query";
import { fetchApi, fetchJson } from "../Api";
import type { DocumentView, DocumentTag } from "../types";
import { useUser } from "../hooks";
import { queryKeys, queryClient } from "../query";

// Stable references: pages list these results in effect dependencies.

export default function useDocument() {
  const { user } = useUser();

  const documentsQuery = useQuery({
    queryKey: queryKeys.documents,
    queryFn: () => fetchJson<DocumentView[]>("/documents"),
  });

  const documentTagsQuery = useQuery({
    queryKey: queryKeys.documentTags,
    queryFn: () => fetchJson<DocumentTag[]>("/document/tags"),
  });

  const NO_DOCUMENTS: DocumentView[] = [];
  const NO_DOCUMENT_TAGS: DocumentTag[] = [];
  
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
    await fetchApi(`/document/tag/link?idDocument=${idDocument}&idDocumentTag=${idDocumentTag}`, {method: "PUT"})
    await queryClient.invalidateQueries({ queryKey: queryKeys.documents });
  }

  async function unlinkDocumentTag(idDocument:string, idDocumentTag: string) {
    if (!user || !user.idUsers) throw new Error("User not logged in");
    await fetchApi(`/document/tag/link?idDocument=${idDocument}&idDocumentTag=${idDocumentTag}`, {method: "DELETE"});
    await queryClient.invalidateQueries({ queryKey: queryKeys.documents });
  }

  return { documents, documentTags, loading, getDocument, linkDocumentTag, unlinkDocumentTag };
}