import { fetchApi } from "../Api";
import type { FileStatus } from "../types";


export function getFiles({ setFiles }: { setFiles: (files: any) => void }) {
  fetchApi("/files")
    .then((res) => res.json())
    .then(setFiles)
    .catch(console.error);
}



export async function uploadFile(file:File, endpoint:string): Promise<FileStatus> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetchApi(endpoint, { method: "POST", body: formData });
    if (res.ok) return { filename: file.name, status: "Uploaded" };
    return { filename: file.name, status: res.status === 409 ? "Already exists" : "Server error" };
  } catch (error) {
    console.error(error);
    return { filename: file.name, status: "Server error" };
  }
}

export function uploadFiles(files: File[], endpoint: string): Promise<FileStatus[]> {
  return Promise.all(files.map((file) => uploadFile(file, endpoint)));
}


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