export function formatFileSize(size: number): string {
  if (!size) return "";
  if (size < 1024) return size + " B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

export function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}