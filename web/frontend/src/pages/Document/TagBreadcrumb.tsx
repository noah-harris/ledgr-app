import { Box } from "@mui/material";
import type { DocumentTag } from "../../types/DocumentTag";

export default function TagBreadcrumb( { selectedTags, setSelectedTags }: { selectedTags: DocumentTag[]; setSelectedTags: (tags: DocumentTag[]) => void }) {
  // Each tag is clickable.
  // Given 5 selected tags it would look like this,
  // Tag1 > Tag2 > Tag3 > Tag4 > Tag5
  // if you click on Tag2, the breadcrumb should update to
  // Tag1 > Tag2
  // clicking on a tag should remove all tags after it in the breadcrumb.
  // Render the breadcrumb as clickable tags.

  // if there is 1 tag left it should be removable as well
  // if there is only one tag left, it should still be removable
  // if there are no tags left, the breadcrumb should be empty 

  function handleTagClick(index: number) {
    setSelectedTags(selectedTags.slice(0, index + 1));
    if (index === selectedTags.length - 1) {
      setSelectedTags([]);
    }
  }

  return (
    <Box>
      {" > "}
      {selectedTags.map((tag, index) => (
        <span key={tag.id} onClick={() => handleTagClick(index)} style={{ cursor: "pointer" }}>
          {tag.name}
          {index < selectedTags.length - 1 && " > "}
        </span>
      ))}
    </Box>
  );
}