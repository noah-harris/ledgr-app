export const OUTPUT_COLUMNS = ["TransactionDate", "PostDate", "Description", "Amount"];
export const COLUMN_TYPES = [...OUTPUT_COLUMNS, "Other"];
export const AREA_COLORS = ["#1f6feb", "#8250df", "#0f7b6c", "#bf3989", "#9a6700", "#cf222e"];
export const BOX_LABELS: Record<string, string> = {
  statement_date: "Statement date",
  start_date: "Start date",
  end_date: "End date",
  start_balance: "Start balance",
  end_balance: "End balance",
};

export type Column = { type: string; name?: string; flip?: boolean };
export type Box = { page: number; x0: number; top: number; x1: number; bottom: number };
export type Rect = Omit<Box, "page">;
export type Area = Rect & {
  id: string;
  name: string;
  pages: string;
  dividers: number[];
  columns: Column[];
  horizontals: number[];
  rows_mode: string;
  fold_overflow: boolean;
  fill_dates: boolean;
  anchor_text: string;
  anchor_y: number | null;
};
export type LayoutDefinition = { date_fmt: string; drop_regex: string; areas: Area[]; boxes: Record<string, Box> };
export type LayoutTransform = { id: string; enabled: boolean };
export type Layout = LayoutDefinition & { id: string | null; name: string; transforms: LayoutTransform[] };
export type Transform = { id: string; name: string; target: string; code: string };
export type Selection = { kind: string; areaId?: string; index?: number; field?: string };
export type Highlight = { i: number; page: number; bbox: number[] };
export type PdfPage = { width: number; height: number; has_text: boolean };
export type Doc = { id: string; pages: PdfPage[] };

export type AreaInfo = {
  name: string;
  offset: number;
  rows_preview: { bbox: number[]; dropped: boolean }[];
  lines: number | null;
  anchor: string | null;
  rows: number;
  skipped: number[];
};
export type TransactionRecord = {
  page: number;
  bbox: number[];
  area: string;
  lines: number;
  source: string;
  problems: string[];
  [column: string]: unknown;
};
export type ExtractResult = {
  status: string;
  checks: { name: string; ok: boolean; detail: string }[];
  statement: Record<string, { label: string; text: string; typed: boolean; value: string | null; error: string | null }>;
  records: TransactionRecord[];
  total: string;
  reconcile: { start: string; total: string; computed: string; end: string; ok: boolean } | null;
  transforms: { id: string; name: string; output: string; errors: { row: number | null; error: string }[] }[];
  areas: Record<string, AreaInfo>;
  preview_page: number;
};

// Same rules as the server: "all", "1-3", "2-", "1,3"
export function parsePages(spec: string, n: number) {
  const s = (spec || "all").trim().toLowerCase();
  if (s === "" || s === "all") return Array.from({ length: n }, (_, i) => i + 1);
  const out = new Set<number>();
  for (const part of s.split(",").map((p) => p.trim()).filter(Boolean)) {
    const [a, b = ""] = part.split("-");
    const start = parseInt(a, 10);
    const end = part.includes("-") ? (b.trim() ? parseInt(b, 10) : n) : start;
    if (Number.isNaN(start) || Number.isNaN(end)) return [];
    for (let p = start; p <= end; p++) if (p >= 1 && p <= n) out.add(p);
  }
  return [...out];
}

export function otherName(columns: Column[]) {
  let k = 1;
  while (columns.some((c) => c.type === "Other" && c.name === `Other ${k}`)) k++;
  return `Other ${k}`;
}

// A new column line splits a column; the right half starts as "Other"
export function addDivider(area: Area, x: number): Area {
  if (x <= area.x0 + 2 || x >= area.x1 - 2 || area.dividers.some((d) => Math.abs(d - x) < 2)) return area;
  const dividers = [...area.dividers, x].sort((a, b) => a - b);
  const columns = [...area.columns];
  columns.splice(dividers.indexOf(x) + 1, 0, { type: "Other", name: otherName(columns) });
  return { ...area, dividers, columns };
}

// Removing a line merges its two columns, keeping the more useful label
export function removeDivider(area: Area, k: number): Area {
  const columns = [...area.columns];
  const [left, right] = [columns[k], columns[k + 1]];
  columns.splice(k, 2, left.type === "Other" && right.type !== "Other" ? right : left);
  return { ...area, dividers: area.dividers.filter((_, j) => j !== k), columns };
}
