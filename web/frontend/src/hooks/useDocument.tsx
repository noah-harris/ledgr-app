import { useState, useEffect } from "react";
import { fetchApi } from "../Api";
import type { DocumentView, DocumentTag, DocumentTagLink } from "../types";
import { useUser } from "../hooks";

export default function useDocument() {
  const [documents, setDocuments] = useState<DocumentView[]>([]);
  const [documentTags, setDocumentTags] = useState<DocumentTag[]>([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      
      const documents = await fetchApi("/documents").then((r) => r.json());
      const documentTags = await fetchApi("/document/tags").then((r) => r.json());

      if (cancelled) return;

      setDocuments(documents);
      setDocumentTags(documentTags);

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);


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
  }

  return { documents, documentTags, loading, getDocument, linkDocumentTag, unlinkDocumentTag };
}