export function formatFileSize(size: number): string {
  if (!size) return "";
  if (size < 1024) return size + " B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

export function formatDate(date: string, includeTime = true): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return includeTime
    ? `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    : `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

export function screamSnakeToTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


export function title(s: string | undefined): string {
  if (!s) return "";
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}