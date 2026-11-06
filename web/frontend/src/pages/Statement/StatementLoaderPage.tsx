import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { fetchApi } from "../../Api";
import type { StatementLayout, StatementLayoutTransform, StatementTransform } from "../../types";
import StatementEditor from "./StatementEditor";
import { AREA_COLORS, BOX_LABELS, COLUMN_TYPES, OUTPUT_COLUMNS, otherName, parsePages, removeDivider } from "./model";
import type { Area, Doc, ExtractResult, Highlight, Layout, LayoutDefinition, LayoutTransform, Rect, Selection, Transform, TransactionRecord } from "./model";
import "./StatementLoader.css";
import useStatement from "../../hooks/useStatement";

const STATEMENT_FIELDS = [
  ["statement_date", "date"],
  ["start_date", "date"],
  ["end_date", "date"],
  ["start_balance", "amount"],
  ["end_balance", "amount"],
];
const NEW_LAYOUT: Layout = { id: null, name: "New layout", date_fmt: "", drop_regex: "", areas: [], boxes: {}, transforms: [] };
const NEW_CODE = `def transform(value, row, stmt):
    # value: this row's current value in the target column
    # row:   every column of this row, e.g. row["Description"], row["Amount"], row["Page"]
    # stmt:  statement values, e.g. stmt["end_date"], stmt["start_balance"]
    # Dates are datetime.date, amounts are decimal.Decimal, text is str.
    # A cell that couldn't be parsed arrives as its raw text.
    return value
`;
const TABS = [["statement", "Statement"], ["areas", "OCR areas"], ["transforms", "Transforms"], ["transactions", "Transactions"]];

const LOADER = "/statement/loader";

type LayoutResponse = { Layout: StatementLayout; Transforms: StatementLayoutTransform[] };
type ApiOptions = { method?: string; body?: unknown; signal?: AbortSignal; params?: Record<string, string | number> };

const newId = () => Math.random().toString(36).slice(2, 10);
const definitionOf = (l: Layout): LayoutDefinition => ({ date_fmt: l.date_fmt, drop_regex: l.drop_regex, areas: l.areas, boxes: l.boxes });
const snapshot = (l: Layout) => JSON.stringify({ name: l.name, ...definitionOf(l), transforms: l.transforms });
const message = (e: unknown) => (e as Error).message;
const toTransform = (t: StatementTransform): Transform => ({ id: t.idStatementTransform, name: t.TransformName, target: t.TargetColumn, code: t.Code });
const transformBody = ({ name, target, code }: Omit<Transform, "id">) => ({ TransformName: name, TargetColumn: target, Code: code });

async function api<T>(path: string, { method = "GET", body, signal, params }: ApiOptions = {}): Promise<T> {
  const init: RequestInit = { method, signal };
  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
    init.headers = { "Content-Type": "application/json" };
  }
  const res = await fetchApi(`${LOADER}${path}`, init, params);
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const d = data?.detail;
    throw new Error(typeof d === "string" ? d : Array.isArray(d) ? d.map((x: { msg: string }) => x.msg).join("; ") : `${res.status} ${res.statusText}`);
  }
  return data;
}

function CodeArea({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      className="code"
      spellCheck={false}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        e.preventDefault();
        const t = e.currentTarget;
        const s = t.selectionStart;
        onChange(value.slice(0, s) + "    " + value.slice(t.selectionEnd));
        requestAnimationFrame(() => (t.selectionStart = t.selectionEnd = s + 4));
      }}
    />
  );
}

export default function StatementLoaderPage() {
  const { statementUnenteredFiles: files } = useStatement();
  const pdfs = useMemo(() => files
    .filter((f) => f.FileExtension.toLowerCase() === "pdf" && !f.isJunk)
    .sort((a, b) => Number(b.AllowStatementImage) - Number(a.AllowStatementImage) || a.FileName.localeCompare(b.FileName)), [files]);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [zoom, setZoom] = useState(1.25);
  const [layout, setLayout] = useState(NEW_LAYOUT);
  const [savedSnap, setSavedSnap] = useState(snapshot(NEW_LAYOUT));
  const [layoutList, setLayoutList] = useState<StatementLayout[]>([]);
  const [library, setLibrary] = useState<Transform[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Partial<Transform>>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tool, setTool] = useState("select");
  const [selected, setSelected] = useState<Selection | null>(null);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [tab, setTab] = useState("statement");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [onlyProblems, setOnlyProblems] = useState(false);

  const page = doc?.pages[pageNo - 1];
  const areaInfo = result && result.preview_page === pageNo ? result.areas : null;
  const dirty = snapshot(layout) !== savedSnap;
  const updateArea = (id: string | undefined, fn: (a: Area) => Area) => setLayout((l) => ({ ...l, areas: l.areas.map((a) => (a.id === id ? fn(a) : a)) }));
  const setL = (key: "name" | "date_fmt" | "drop_regex") => (e: ChangeEvent<HTMLInputElement>) => setLayout((l) => ({ ...l, [key]: e.target.value }));

  useEffect(() => {
    api<StatementLayout[]>("/layouts").then(setLayoutList).catch((e) => setError(message(e)));
    api<StatementTransform[]>("/transforms").then((ts) => setLibrary(ts.map(toTransform))).catch((e) => setError(message(e)));
  }, []);

  // Pages need the auth header, so they can't be plain image URLs
  useEffect(() => {
    if (!doc) return;
    const ctrl = new AbortController();
    let url = "";
    fetchApi(`${LOADER}/pdf/page`, { signal: ctrl.signal }, { idFile: doc.id, n: pageNo })
      .then((res) => {
        if (!res.ok) throw new Error(`Couldn't load page ${pageNo}`);
        return res.blob();
      })
      .then((blob) => setImgUrl((url = URL.createObjectURL(blob))))
      .catch((e) => {
        if (e.name !== "AbortError") setError(message(e));
      });
    return () => {
      ctrl.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [doc, pageNo]);

  // Transforms send their current editor text, so unsaved edits preview live
  const transformOf = (id: string): Transform | undefined => {
    const saved = library.find((t) => t.id === id);
    return saved && { ...saved, ...drafts[id] };
  };
  const activeTransforms = layout.transforms
    .filter((t) => t.enabled && transformOf(t.id))
    .map((t) => {
      const { id, name, target, code } = transformOf(t.id)!;
      return { id, name, target, code };
    });
  const filled = new Set(activeTransforms.map((t) => t.target)); // columns a running transform supplies
  const payload = JSON.stringify({ layout: definitionOf(layout), overrides, transforms: activeTransforms, preview_page: pageNo });

  // Re-run extraction on every change, debounced so dragging stays smooth
  useEffect(() => {
    if (!doc) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        setResult(await api<ExtractResult>("/pdf/extract", { method: "POST", body: payload, signal: ctrl.signal, params: { idFile: doc.id } }));
        setError("");
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError(message(e));
      } finally {
        if (!ctrl.signal.aborted) setBusy(false);
      }
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [doc, payload]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === "Escape") {
        setTool("select");
        setSelected(null);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selected && selected.kind !== "area") {
        e.preventDefault();
        removeSelected();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  function removeSelected() {
    if (!selected) return;
    if (selected.kind === "divider") updateArea(selected.areaId, (a) => removeDivider(a, selected.index!));
    if (selected.kind === "hline") updateArea(selected.areaId, (a) => ({ ...a, horizontals: a.horizontals.filter((_, j) => j !== selected.index) }));
    if (selected.kind === "area") setLayout((l) => ({ ...l, areas: l.areas.filter((a) => a.id !== selected.areaId) }));
    if (selected.kind === "box") removeBox(selected.field!);
    setSelected(null);
  }

  function removeBox(field: string) {
    setLayout((l) => {
      const { [field]: _, ...boxes } = l.boxes;
      return { ...l, boxes };
    });
  }

  async function openPdf(idFile: string) {
    if (!idFile) return;
    try {
      const d = await api<Doc>("/pdf", { params: { idFile } });
      // The layout stays, so a tuned layout applies straight to the next statement
      setDoc(d);
      setPageNo(1);
      setResult(null);
      setOverrides({});
      setHighlight(null);
      setSelected(null);
      setError("");
    } catch (err) {
      setError(message(err));
    }
  }

  async function areaDrawn(r: Rect) {
    const id = newId();
    const w = (r.x1 - r.x0) / 4;
    let dividers = [1, 2, 3].map((k) => Math.round((r.x0 + w * k) * 10) / 10);
    let columns = OUTPUT_COLUMNS.map((type) => ({ type }));
    try {
      const auto = await api<Pick<Area, "dividers" | "columns"> | null>("/pdf/columns", { method: "POST", body: { page: pageNo, ...r }, params: { idFile: doc!.id } });
      if (auto) ({ dividers, columns } = auto);
    } catch (err) {
      setError(message(err));
    }
    setLayout((l) => ({
      ...l,
      areas: [
        ...l.areas,
        { id, name: `Area ${l.areas.length + 1}`, pages: String(pageNo), ...r, dividers, columns, horizontals: [],
          rows_mode: "auto", fold_overflow: true, fill_dates: false, anchor_text: "", anchor_y: null },
      ],
    }));
    setSelected({ kind: "area", areaId: id });
    setTab("areas");
  }

  async function autoColumns(area: Area) {
    const off = areaInfo?.[area.id]?.offset ?? 0;
    try {
      const auto = await api<Pick<Area, "dividers" | "columns"> | null>("/pdf/columns", { method: "POST", body: { page: pageNo, x0: area.x0, top: area.top + off, x1: area.x1, bottom: area.bottom }, params: { idFile: doc!.id } });
      if (!auto) return setError("No text inside that area on this page");
      updateArea(area.id, (a) => ({ ...a, ...auto }));
    } catch (err) {
      setError(message(err));
    }
  }

  // Area geometry is stored relative to where the anchor was when it was set.
  // Setting or clearing it bakes the current page's shift into the stored positions.
  async function setAnchor(area: Area) {
    const off = areaInfo?.[area.id]?.offset ?? 0;
    try {
      const { y } = await api<{ y: number }>("/pdf/anchor", { method: "POST", body: { page: pageNo, text: area.anchor_text, near_y: area.top + off }, params: { idFile: doc!.id } });
      updateArea(area.id, (a) => ({ ...a, top: a.top + off, horizontals: a.horizontals.map((h) => h + off), anchor_y: y }));
    } catch (err) {
      setError(message(err));
    }
  }

  function clearAnchor(area: Area, patch: Partial<Area> = {}) {
    const off = areaInfo?.[area.id]?.offset ?? 0;
    updateArea(area.id, (a) => ({ ...a, top: a.top + off, horizontals: a.horizontals.map((h) => h + off), anchor_y: null, ...patch }));
  }

  // --- Layouts ---

  function toLayout({ Layout: L, Transforms }: LayoutResponse): Layout {
    const transforms: LayoutTransform[] = Transforms.map((t) => ({ id: t.idStatementTransform, enabled: t.isEnabled }));
    return { ...NEW_LAYOUT, ...JSON.parse(L.Definition), id: L.idStatementLayout, name: L.LayoutName, transforms };
  }

  async function loadLayout(id: string) {
    if (!id) return;
    try {
      const next = toLayout(await api<LayoutResponse>("/layout", { params: { idStatementLayout: id } }));
      setLayout(next);
      setSavedSnap(snapshot(next));
      setSelected(null);
      setHighlight(null);
    } catch (err) {
      setError(message(err));
    }
  }

  async function saveLayout(asNew: boolean) {
    const body = {
      LayoutName: layout.name,
      Definition: definitionOf(layout),
      Transforms: layout.transforms.map((t) => ({ idStatementTransform: t.id, isEnabled: t.enabled })),
    };
    try {
      const saved = asNew || !layout.id
        ? await api<LayoutResponse>("/layout", { method: "POST", body })
        : await api<LayoutResponse>("/layout", { method: "PUT", body, params: { idStatementLayout: layout.id } });
      const next = toLayout(saved);
      setLayout(next);
      setSavedSnap(snapshot(next));
      setLayoutList(await api<StatementLayout[]>("/layouts"));
    } catch (err) {
      setError(message(err));
    }
  }

  function newLayout() {
    setLayout(NEW_LAYOUT);
    setSavedSnap(snapshot(NEW_LAYOUT));
    setSelected(null);
  }

  // --- Transforms ---

  async function newTransform() {
    try {
      const t = toTransform(await api<StatementTransform>("/transform", { method: "POST", body: transformBody({ name: "New transform", target: "Description", code: NEW_CODE }) }));
      setLibrary((lib) => [...lib, t]);
      setLayout((l) => ({ ...l, transforms: [...l.transforms, { id: t.id, enabled: true }] }));
      setEditingId(t.id);
    } catch (err) {
      setError(message(err));
    }
  }

  async function saveTransform(id: string) {
    try {
      const body = transformBody(transformOf(id)!);
      const t = toTransform(await api<StatementTransform>("/transform", { method: "PUT", body, params: { idStatementTransform: id } }));
      setLibrary((lib) => lib.map((x) => (x.id === id ? t : x)));
      setDrafts(({ [id]: _, ...rest }) => rest);
    } catch (err) {
      setError(message(err));
    }
  }

  async function deleteTransform(id: string) {
    try {
      await api("/transform", { method: "DELETE", params: { idStatementTransform: id } });
      setLibrary((lib) => lib.filter((x) => x.id !== id));
      setLayout((l) => ({ ...l, transforms: l.transforms.filter((t) => t.id !== id) }));
      setEditingId(null);
      setConfirm(null);
    } catch (err) {
      setError(message(err));
    }
  }

  const editDraft = (id: string, field: keyof Transform, value: string) => setDrafts((d) => ({ ...d, [id]: { ...(d[id] || {}), [field]: value } }));
  const isDirty = (id: string) => {
    const saved = library.find((t) => t.id === id);
    const d = drafts[id];
    return !!(saved && d && Object.entries(d).some(([k, v]) => saved[k as keyof Transform] !== v));
  };
  const moveTransform = (i: number, delta: number) =>
    setLayout((l) => {
      const ts = [...l.transforms];
      const j = i + delta;
      if (j < 0 || j >= ts.length) return l;
      [ts[i], ts[j]] = [ts[j], ts[i]];
      return { ...l, transforms: ts };
    });

  // Every column a transform can read or target
  const extraColumns: string[] = [];
  for (const a of layout.areas) {
    const amounts = a.columns.filter((c) => c.type === "Amount").length;
    if (amounts > 1) for (let k = 1; k <= amounts; k++) extraColumns.push(`Amount ${k}`);
    for (const c of a.columns) if (c.type === "Other" && c.name) extraColumns.push(c.name);
  }
  const rowKeys = [...new Set([...OUTPUT_COLUMNS, ...extraColumns, "Page", "Area"])];
  const targets = [...new Set([...OUTPUT_COLUMNS, ...extraColumns.filter((c) => !c.startsWith("Amount "))])];

  function downloadCsv(records: TransactionRecord[]) {
    const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const lines = [OUTPUT_COLUMNS.join(","), ...records.map((r) => OUTPUT_COLUMNS.map((c) => esc(String(r[c] ?? ""))).join(","))];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    a.download = `${(pdfs.find((f) => f.idFile === doc?.id)?.FileName || "statement")}_transactions.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  const hints: Record<string, string> = {
    select: "Click an area to edit its column labels; drag one label onto another to swap them. Drag lines and edges, or the ⠿ tag to move an area. Select a line or box and press Delete.",
    area: "Drag on the page around the transaction rows, just below the printed column headers.",
    vline: "Click inside an area to add a column line.",
    hline: "Click inside an area to add a row line.",
  };
  const hint = tool.startsWith("box:") ? `Drag on the page to draw the ${BOX_LABELS[tool.slice(4)]} box.` : hints[tool];
  const records = result?.records || [];
  const problemCount = records.filter((r) => r.problems.length).length;
  const multiArea = layout.areas.length > 1;

  return (
    <div className="statement-loader">
      <header className="topbar">
        <strong>Statement Loader</strong>
        <select value={doc?.id ?? ""} onChange={(e) => openPdf(e.target.value)} title="Open a PDF from your files">
          <option value="">Open statement PDF…</option>
          {pdfs.map((f) => <option key={f.idFile} value={f.idFile}>{f.FullFileName}</option>)}
        </select>
        {doc && (
          <span className="pager">
            <button disabled={pageNo <= 1} onClick={() => setPageNo(pageNo - 1)}>‹</button>
            Page {pageNo} of {doc.pages.length}
            <button disabled={pageNo >= doc.pages.length} onClick={() => setPageNo(pageNo + 1)}>›</button>
          </span>
        )}
        <select value={zoom} onChange={(e) => setZoom(Number(e.target.value))} title="Zoom">
          {[0.75, 1, 1.25, 1.5, 2].map((z) => <option key={z} value={z}>{z * 100}%</option>)}
        </select>
        <span className="spacer" />
        <select value="" onChange={(e) => loadLayout(e.target.value)} title="Load a saved layout">
          <option value="">Saved layouts ({layoutList.length})…</option>
          {layoutList.map((l) => <option key={l.idStatementLayout} value={l.idStatementLayout}>{l.LayoutName}</option>)}
        </select>
        <input className="name" value={layout.name} onChange={setL("name")} title="Layout name" />
        <button className={dirty ? "primary" : ""} onClick={() => saveLayout(false)}>Save layout{dirty ? " •" : ""}</button>
        <button onClick={() => saveLayout(true)} disabled={!layout.id}>Save as new</button>
        <button onClick={newLayout}>New</button>
      </header>

      {error && (
        <div className="error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      <main className="layout">
        <section className="canvas">
          {!doc && <p className="empty">Open a statement PDF to start. Upload it under Files first.</p>}
          {doc && (
            <>
              <div className="toolbar">
                <button className={tool === "select" ? "on" : ""} onClick={() => setTool("select")}>Select</button>
                <button className={tool === "area" ? "on" : ""} onClick={() => setTool("area")}>+ OCR area</button>
                <button className={tool === "vline" ? "on" : ""} disabled={!layout.areas.length} onClick={() => setTool("vline")}>+ Column line</button>
                <button className={tool === "hline" ? "on" : ""} disabled={!layout.areas.length} onClick={() => setTool("hline")}>+ Row line</button>
                <select value={tool.startsWith("box:") ? tool.slice(4) : ""} className={tool.startsWith("box:") ? "on" : ""} onChange={(e) => e.target.value && setTool(`box:${e.target.value}`)}>
                  <option value="">+ Statement box…</option>
                  {STATEMENT_FIELDS.map(([f]) => <option key={f} value={f}>{BOX_LABELS[f]}{layout.boxes[f] ? " (redraw)" : ""}</option>)}
                </select>
                <button disabled={!selected} onClick={removeSelected}>Remove selected</button>
              </div>
              <div className="hint">
                {hint}
                {page && !page.has_text && <b> This page has no text layer (it's a scan), so it can't be read.</b>}
              </div>
              {page && <StatementEditor
                page={page}
                pageNo={pageNo}
                pageCount={doc.pages.length}
                imgUrl={imgUrl}
                zoom={zoom}
                layout={layout}
                setLayout={setLayout}
                areaInfo={areaInfo}
                tool={tool}
                setTool={setTool}
                selected={selected}
                setSelected={setSelected}
                highlight={highlight}
                onAreaDrawn={areaDrawn}
                filled={filled}
              />}
            </>
          )}
        </section>

        <aside className="side">
          <div className="status-card">
            <div className="status-row">
              <span className={`pill ${(result?.status || "none").replace(" ", "-").toLowerCase()}`}>{result?.status || "—"}</span>
              <span>{records.length} transactions{problemCount ? `, ${problemCount} with problems` : ""}</span>
              {busy && <span className="muted">updating…</span>}
            </div>
            {result?.reconcile && (
              <div className={result.reconcile.ok ? "recon ok" : "recon bad"}>
                Start {result.reconcile.start} + transactions {result.reconcile.total} = {result.reconcile.computed} {result.reconcile.ok ? "=" : "≠"} End {result.reconcile.end}
              </div>
            )}
            <ul className="checks">
              {(result?.checks || []).filter((c) => !c.name.startsWith("Start +")).map((c, i) => (
                <li key={i} className={c.ok ? "ok" : "bad"}>{c.ok ? "✓" : "✗"} <b>{c.name}</b>: {c.detail}</li>
              ))}
            </ul>
          </div>

          <nav className="tabs">
            {TABS.map(([key, label]) => (
              <button key={key} className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
                {label}
                {key === "transactions" && records.length ? ` (${records.length})` : ""}
              </button>
            ))}
          </nav>

          {tab === "statement" && (
            <div className="panel">
              <p className="muted">Draw a box around each value. The text inside is read on every change; type in a field to override it.</p>
              {STATEMENT_FIELDS.map(([field, kind]) => {
                const st = result?.statement?.[field];
                const box = layout.boxes[field];
                const typed = field in overrides;
                return (
                  <div key={field} className="sfield">
                    <div className="sfield-head">
                      <b>{BOX_LABELS[field]}</b>
                      <span className="muted">{box ? `box on page ${box.page}` : "no box"}</span>
                      <span className="spacer" />
                      <button className={tool === `box:${field}` ? "on" : ""} disabled={!doc} onClick={() => setTool(`box:${field}`)}>{box ? "Redraw" : "Draw box"}</button>
                      {box && <button title="Remove the box" onClick={() => removeBox(field)}>×</button>}
                    </div>
                    {st?.text && <div className="boxtext" title="Text inside the box">{st.text}</div>}
                    <div className="sfield-value">
                      <input
                        className={typed ? "typed" : ""}
                        value={typed ? overrides[field] : st?.value ?? ""}
                        placeholder={kind === "date" ? "2026-12-31 or 12/31/2026" : "0.00"}
                        onChange={(e) => setOverrides((o) => ({ ...o, [field]: e.target.value }))}
                      />
                      {typed && <button onClick={() => setOverrides(({ [field]: _, ...rest }) => rest)}>↺ Use box</button>}
                    </div>
                    {typed && <div className="muted small">Typed value{st?.value ? ` → ${st.value}` : ""}</div>}
                    {st?.error && <div className="err-text">{st.error}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "areas" && (
            <>
              <div className="panel">
                <label className="row"><span>Drop rows matching</span><input value={layout.drop_regex} placeholder="BEGINNING BALANCE|ENDING BALANCE" onChange={setL("drop_regex")} /></label>
                <label className="row"><span>Date format</span><input value={layout.date_fmt} placeholder="auto (12/31, 12/31/26, Dec 31 …)" onChange={setL("date_fmt")} /></label>
              </div>
              {!layout.areas.length && <p className="muted pad">No OCR areas yet. Click “+ OCR area” and drag around the transaction rows.</p>}
              {layout.areas.map((area, i) => {
                const info = result?.areas?.[area.id];
                const applies = doc && parsePages(area.pages, doc.pages.length).includes(pageNo);
                const absent = OUTPUT_COLUMNS.filter((t) => !area.columns.some((c) => c.type === t));
                const missing = absent.filter((t) => !filled.has(t));
                const fromTransform = absent.filter((t) => filled.has(t));
                const anchored = area.anchor_y != null;
                return (
                  <div key={area.id} className={selected?.areaId === area.id ? "panel area-card sel" : "panel area-card"} style={{ "--c": AREA_COLORS[i % AREA_COLORS.length] } as CSSProperties}>
                    <div className="area-head">
                      <span className="swatch" />
                      <input className="area-name" value={area.name} onChange={(e) => updateArea(area.id, (a) => ({ ...a, name: e.target.value }))} />
                      <span className="muted">{info ? `${info.rows} rows` : ""}</span>
                      <span className="spacer" />
                      {confirm === `area-${area.id}` ? (
                        <button className="danger" onClick={() => { setLayout((l) => ({ ...l, areas: l.areas.filter((a) => a.id !== area.id) })); setConfirm(null); }}>Confirm delete</button>
                      ) : (
                        <button onClick={() => setConfirm(`area-${area.id}`)}>Delete</button>
                      )}
                    </div>
                    <label className="row"><span>Pages</span><input value={area.pages} placeholder="all, 1, 2-, 1-3" onChange={(e) => updateArea(area.id, (a) => ({ ...a, pages: e.target.value }))} /></label>
                    <label className="row">
                      <span>Rows</span>
                      <select value={area.rows_mode} onChange={(e) => updateArea(area.id, (a) => ({ ...a, rows_mode: e.target.value }))}>
                        <option value="auto">Auto: one row per text line</option>
                        <option value="manual">Manual: one row between each pair of row lines</option>
                      </select>
                    </label>
                    <div className="muted small">{area.rows_mode === "manual" ? "Add row lines between records. Each band between two lines becomes one row." : "Each text line is a row. A row line you add stops the lines on either side from being folded together."}{info?.lines != null ? ` ${info.lines} text lines inside on this page.` : ""}</div>
                    <label className="check"><input type="checkbox" checked={area.fold_overflow} onChange={(e) => updateArea(area.id, (a) => ({ ...a, fold_overflow: e.target.checked }))} /> Fold overflow lines into the row above</label>
                    <label className="check"><input type="checkbox" checked={area.fill_dates} onChange={(e) => updateArea(area.id, (a) => ({ ...a, fill_dates: e.target.checked }))} /> Fill blank dates from the row above</label>
                    <div className="row">
                      <span>Anchor text</span>
                      <div className="inline">
                        <input
                          value={area.anchor_text}
                          placeholder="e.g. Trans Date Post Date"
                          onChange={(e) => (anchored ? clearAnchor(area, { anchor_text: e.target.value }) : updateArea(area.id, (a) => ({ ...a, anchor_text: e.target.value })))}
                        />
                        {anchored ? <button onClick={() => clearAnchor(area)}>Clear</button> : <button disabled={!applies || !area.anchor_text.trim()} onClick={() => setAnchor(area)}>Set</button>}
                      </div>
                    </div>
                    <div className="muted small">
                      {anchored
                        ? `Anchored. ${info?.anchor === "missing" ? "Not on this page, so this page is skipped." : "Found on this page."}${info?.skipped?.length ? ` Skipped pages ${info.skipped.join(", ")}.` : ""}`
                        : "Optional: text printed just above the rows, usually the column header. The area's top then follows it on every page and statement, and pages without it are skipped."}
                    </div>
                    <table className="cols">
                      <tbody>
                        {area.columns.map((c, k) => (
                          <tr key={k}>
                            <td className="muted">{k + 1}</td>
                            <td>
                              <select
                                value={c.type}
                                onChange={(e) => {
                                  const type = e.target.value;
                                  updateArea(area.id, (a) => ({
                                    ...a,
                                    columns: a.columns.map((x, j) => (j !== k ? x : type === "Other" ? { type, name: x.type === "Other" ? x.name : otherName(a.columns) } : { type, flip: type === "Amount" ? !!x.flip : undefined })),
                                  }));
                                }}
                              >
                                {COLUMN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </td>
                            <td>
                              {c.type === "Other" && (
                                <input value={c.name} placeholder="name, e.g. Balance" onChange={(e) => updateArea(area.id, (a) => ({ ...a, columns: a.columns.map((x, j) => (j === k ? { ...x, name: e.target.value } : x)) }))} />
                              )}
                              {c.type === "Amount" && (
                                <label className="check inline-check">
                                  <input type="checkbox" checked={!!c.flip} onChange={(e) => updateArea(area.id, (a) => ({ ...a, columns: a.columns.map((x, j) => (j === k ? { ...x, flip: e.target.checked } : x)) }))} /> Flip sign (× −1)
                                </label>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {missing.length > 0 && <div className="err-text">Missing {missing.join(", ")}. Every area needs all four, from a column or a transform.</div>}
                    {fromTransform.length > 0 && <div className="muted small">{fromTransform.join(", ")} comes from a transform.</div>}
                    {area.columns.filter((c) => c.type === "Amount").length > 1 && <div className="muted small">Amount columns are summed into Amount.</div>}
                    <div className="buttons">
                      <button disabled={!applies} title={applies ? "" : "Go to a page this area applies to"} onClick={() => autoColumns(area)}>Auto-detect columns</button>
                      {layout.areas.length > 1 && (
                        <select
                          value=""
                          title="Use another area's column lines and labels. Handy when sections share the same columns."
                          onChange={(e) => {
                            const src = layout.areas.find((a) => a.id === e.target.value);
                            if (src) updateArea(area.id, (a) => ({ ...a, x0: src.x0, x1: src.x1, dividers: [...src.dividers], columns: src.columns.map((c) => ({ ...c })) }));
                          }}
                        >
                          <option value="">Copy columns from…</option>
                          {layout.areas.filter((a) => a.id !== area.id).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {tab === "transforms" && (
            <div className="panel">
              <p className="muted">Python functions that run on every row, top to bottom. Standard library only. Saved to the database and shared across layouts.</p>
              <ol className="tlist">
                {layout.transforms.map((lt, i) => {
                  const t = transformOf(lt.id);
                  if (!t) return null;
                  const rep = result?.transforms?.find((r) => r.id === lt.id);
                  const errorCount = rep?.errors.length ?? 0;
                  return (
                    <li key={lt.id} className={editingId === lt.id ? "on" : ""}>
                      <input type="checkbox" checked={lt.enabled} title="Run this transform" onChange={(e) => setLayout((l) => ({ ...l, transforms: l.transforms.map((x) => (x.id === lt.id ? { ...x, enabled: e.target.checked } : x)) }))} />
                      <button className="link" onClick={() => setEditingId(editingId === lt.id ? null : lt.id)}>
                        {t.name} → {t.target}
                        {isDirty(lt.id) ? " •" : ""}
                      </button>
                      {errorCount > 0 && <span className="err-text">{errorCount} errors</span>}
                      <span className="spacer" />
                      <button onClick={() => moveTransform(i, -1)} disabled={i === 0} title="Run earlier">↑</button>
                      <button onClick={() => moveTransform(i, 1)} disabled={i === layout.transforms.length - 1} title="Run later">↓</button>
                      <button onClick={() => setLayout((l) => ({ ...l, transforms: l.transforms.filter((x) => x.id !== lt.id) }))} title="Remove from this layout (stays in the library)">×</button>
                    </li>
                  );
                })}
              </ol>
              <div className="buttons">
                <button className="primary" onClick={newTransform}>+ New transform</button>
                <select value="" onChange={(e) => e.target.value && setLayout((l) => ({ ...l, transforms: [...l.transforms, { id: e.target.value, enabled: true }] }))}>
                  <option value="">Add saved transform…</option>
                  {library.filter((t) => !layout.transforms.some((x) => x.id === t.id)).map((t) => <option key={t.id} value={t.id}>{t.name} → {t.target}</option>)}
                </select>
              </div>

              {editingId && transformOf(editingId) && (() => {
                const t = transformOf(editingId)!;
                const rep = result?.transforms?.find((r) => r.id === editingId);
                const inLayout = layout.transforms.find((x) => x.id === editingId);
                return (
                  <div className="teditor">
                    <label className="row"><span>Name</span><input value={t.name} onChange={(e) => editDraft(editingId, "name", e.target.value)} /></label>
                    <label className="row">
                      <span>Column</span>
                      <select value={t.target} onChange={(e) => editDraft(editingId, "target", e.target.value)}>
                        {[...new Set([...targets, t.target])].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </label>
                    <CodeArea value={t.code} onChange={(v) => editDraft(editingId, "code", v)} />
                    <div className="muted small">
                      row keys: {rowKeys.map((k) => <code key={k}>{k}</code>)}
                      <br />
                      stmt keys: {STATEMENT_FIELDS.map(([f]) => <code key={f}>{f}</code>)}
                    </div>
                    <div className="buttons">
                      <button className={isDirty(editingId) ? "primary" : ""} disabled={!isDirty(editingId)} onClick={() => saveTransform(editingId)}>Save transform</button>
                      {isDirty(editingId) && <button onClick={() => setDrafts(({ [editingId]: _, ...rest }) => rest)}>Discard changes</button>}
                      <span className="spacer" />
                      {confirm === `t-${editingId}` ? (
                        <button className="danger" onClick={() => deleteTransform(editingId)}>Confirm delete from library</button>
                      ) : (
                        <button onClick={() => setConfirm(`t-${editingId}`)}>Delete</button>
                      )}
                    </div>
                    {!inLayout?.enabled && <div className="muted small">Not running: {inLayout ? "enable it in the list above" : "add it to this layout"} to preview it.</div>}
                    {rep && (
                      <div className="trun">
                        {rep.errors.length === 0 ? <div className="ok-text">Ran on {records.length} rows without errors.</div> : (
                          <ul className="problems">
                            {rep.errors.map((er, i) => <li key={i}>{er.row ? `Row ${er.row}: ` : ""}{er.error}</li>)}
                          </ul>
                        )}
                        {rep.output && (
                          <>
                            <div className="muted small">print() output</div>
                            <pre className="printed">{rep.output}</pre>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {tab === "transactions" && (
            <div className="panel">
              <div className="tx-head">
                <label className="check"><input type="checkbox" checked={onlyProblems} onChange={(e) => setOnlyProblems(e.target.checked)} /> Only rows with problems</label>
                <span className="spacer" />
                <button disabled={!records.length} onClick={() => downloadCsv(records)}>Download CSV</button>
              </div>
              <p className="muted small">Click a row to see where it came from on the page. Hover for its raw cells.</p>
              <div className="table-wrap">
                <table className="tx">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Pg</th>
                      {multiArea && <th>Area</th>}
                      <th title="TransactionDate">Trans date</th>
                      <th title="PostDate">Post date</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) =>
                      onlyProblems && !r.problems.length ? null : (
                        <tr
                          key={i}
                          className={`${r.problems.length ? "bad" : ""} ${highlight?.i === i ? "hl" : ""}`}
                          title={(r.problems.length ? r.problems.join("\n") + "\n\n" : "") + `${r.lines} line${r.lines > 1 ? "s" : ""}: ${r.source}`}
                          onClick={() => {
                            setHighlight({ i, page: r.page, bbox: r.bbox });
                            setPageNo(r.page);
                          }}
                        >
                          <td className="muted">{i + 1}</td>
                          <td className="muted">{r.page}</td>
                          {multiArea && <td>{r.area}</td>}
                          <td>{String(r.TransactionDate ?? "")}</td>
                          <td>{String(r.PostDate ?? "")}</td>
                          <td className="desc">{String(r.Description ?? "")}</td>
                          <td className="num">{String(r.Amount ?? "")}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
