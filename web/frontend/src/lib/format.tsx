export function formatFileSize(size: number): string {
  if (!size) return "";
  if (size < 1024) return size + " B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

export function formatDate(date: string | undefined | null, includeTime = true): string {
  if (!date) return "";
  // A bare date parses as UTC, which would show the previous day in US time zones.
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00` : date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return includeTime
    ? `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    : `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

// Money arrives from the API as a string or a number, depending on the field's serialization.
export function formatCurrency(value: number | string | null, symbol: string, showPlus = false): string {
  const amount = Number(value);
  const digits = Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const sign = amount < 0 ? "-" : showPlus && amount > 0 ? "+" : "";
  return `${sign}${symbol}${digits}`;
}

export function title(s: string | undefined): string {
  if (!s) return "";
  // replace underscore with space
  s = s.replace(/_/g, " ");

  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}