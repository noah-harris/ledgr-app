import { fetchApi } from "../Api";


export default function useFileExport(fileIds: string[]) {

  async function exportFiles() {
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

return { exportFiles };
}