import { useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";

type TreeItem = {
  id: string;
  label: string;
  children?: TreeItem[];
};

const items: TreeItem[] = [
  { id: "assets", label: "Assets", children: [
    { id: "checking", label: "Checking" },
    { id: "savings", label: "Savings" },
  ]},
  { id: "liabilities", label: "Liabilities", children: [
    { id: "card", label: "Credit Card" },
  ]},
];

export default function TreeView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <RichTreeView
      items={items}
      selectedItems={selectedId}
      onSelectedItemsChange={(_event, id) => setSelectedId(id)}
    />
  );
}