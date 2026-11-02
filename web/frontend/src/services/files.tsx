import { fetchApi } from "../Api";

// Function to get all files
export function getFiles({ setFiles }: { setFiles: (files: any) => void }) {
  fetchApi("/files")
    .then((res) => res.json())
    .then(setFiles)
    .catch(console.error);
}


// Function to export files
export async function exportFiles(fileIds: string[]) {
  if (!fileIds.length) return;
  try {
    const res = await fetchApi("/file/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fileIds),
    });
    if (!res.ok) throw new Error(`Export failed: ${res.status}`);

    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledgr-export-${fileIds.length}-files-${new Date().toISOString()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
}
