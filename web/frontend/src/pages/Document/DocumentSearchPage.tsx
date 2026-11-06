import { useState } from "react";
import { Box } from "@mui/material";
import { Loading, TagBreadcrumb, TagCardArray } from "../../components";
import { useDocument } from "../../hooks";
import type { DocumentTag, DocumentView } from "../../types";
import DocumentCardArray from "../../components/uncommon/DocumentCardArray";

function documentListHasHomogenousTagSet(documents: DocumentView[]): boolean {
  if (documents.length === 0) return false;
  const firstDocTags = new Set((documents[0].Tags ?? []).map(t => t.idDocumentTag));
  return documents.every(doc => {
    const docTags = new Set((doc.Tags ?? []).map(t => t.idDocumentTag));
    if (docTags.size !== firstDocTags.size) return false;
    for (const tagId of docTags) {
      if (!firstDocTags.has(tagId)) return false;
    }
    return true;
  });
}

function getDocumentListTags(documents: DocumentView[]): DocumentTag[] {
  const tagMap = new Map<string, DocumentTag>();
  for (const doc of documents) {
    for (const tag of doc.Tags ?? []) {
      tagMap.set(tag.idDocumentTag, tag);
    }
  }
  return Array.from(tagMap.values());
}


export default function DocumentsSearchPage() {
  const { usedDocumentTags, documents, loading } = useDocument()
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>([]);

  // Documents that have every selected tag
  const potentialDocuments = documents.filter(doc => selectedTags.every(tag => (doc.Tags ?? []).some(t => t.idDocumentTag === tag.idDocumentTag)));

  // If every remaining document has the same tags, treat all of them as selected (derived, not stored)
  const userSelectedIds = new Set(selectedTags.map(t => t.idDocumentTag));
  const effectiveSelectedTags = documentListHasHomogenousTagSet(potentialDocuments)
    ? [...selectedTags, ...getDocumentListTags(potentialDocuments).filter(t => !userSelectedIds.has(t.idDocumentTag))]
    : selectedTags;

  const tagsInPotentialDocuments = new Set(potentialDocuments.flatMap(doc => (doc.Tags ?? []).map(t => t.idDocumentTag)));
  const selectedTagIds = new Set(effectiveSelectedTags.map(t => t.idDocumentTag));
  const potentialTags = usedDocumentTags.filter(tag => !selectedTagIds.has(tag.idDocumentTag) && tagsInPotentialDocuments.has(tag.idDocumentTag));

  return loading ? <Loading /> : (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TagBreadcrumb selectedTags={effectiveSelectedTags} setSelectedTags={setSelectedTags} />

      {/* No tags selected: only show tags */}
      {effectiveSelectedTags.length === 0 ? (
        <TagCardArray tags={potentialTags} setSelectedTags={setSelectedTags} />
      ) : (
        <>
          {/* Tags selected: show remaining tags (if any) and matching documents */}
          {potentialTags.length > 0 && <TagCardArray tags={potentialTags} setSelectedTags={setSelectedTags} />}
          <DocumentCardArray documents={potentialDocuments} />
        </>
      )}
    </Box>
  );
}