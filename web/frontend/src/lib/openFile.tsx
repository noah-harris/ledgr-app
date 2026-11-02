import { fetchApi } from "../Api";

export default async function openFile(idFile: string) {
  const tab = window.open("", "_blank");
  const res = await fetchApi(`/file/download?idFile=${idFile}`);
  if (!res.ok || !tab) { tab?.close(); return; }
  tab.location.href = URL.createObjectURL(await res.blob());
}