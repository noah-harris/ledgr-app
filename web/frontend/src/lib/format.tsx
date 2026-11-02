export function formatFileSize(size: number): string {
  if (!size) return "";
  if (size < 1024) return size + " B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

export function formatDate(date: string | undefined | null, includeTime = true): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return includeTime
    ? `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    : `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

export function title(s: string | undefined): string {
  if (!s) return "";
  // replace underscore with space
  s = s.replace(/_/g, " ");

  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}