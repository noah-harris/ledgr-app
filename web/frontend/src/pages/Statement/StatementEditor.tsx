import { useEffect, useRef, useState } from "react";
import type { CSSProperties, Dispatch, PointerEvent, SetStateAction } from "react";
import { AREA_COLORS, BOX_LABELS, COLUMN_TYPES, OUTPUT_COLUMNS, addDivider, otherName, parsePages } from "./model";
import type { Area, AreaInfo, Box, Column, Highlight, Layout, PdfPage, Rect, Selection } from "./model";

const r1 = (v: number) => Math.round(v * 10) / 10;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

type DragState = {
  kind: string;
  select: Selection;
  areaId?: string;
  index?: number;
  field?: string;
  corner?: string;
  orig?: Area | Box;
};

type EditorProps = {
  page: PdfPage;
  pageNo: number;
  pageCount: number;
  imgUrl: string;
  zoom: number;
  layout: Layout;
  setLayout: Dispatch<SetStateAction<Layout>>;
  areaInfo: Record<string, AreaInfo> | null;
  tool: string;
  setTool: (tool: string) => void;
  selected: Selection | null;
  setSelected: (selected: Selection | null) => void;
  highlight: Highlight | null;
  onAreaDrawn: (rect: Rect) => void;
  filled: Set<string>;
};

export default function StatementEditor({ page, pageNo, pageCount, imgUrl, zoom, layout, setLayout, areaInfo, tool, setTool, selected, setSelected, highlight, onAreaDrawn, filled }: EditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const highlightRef = useRef<SVGRectElement>(null);
  const [drag, setDrag] = useState<(DragState & { sx: number; sy: number }) | null>(null);
  const [draft, setDraft] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const [hoverBand, setHoverBand] = useState<{ areaId: string; k: number } | null>(null);
  const [chipDrag, setChipDrag] = useState<{ areaId: string; k: number } | null>(null);
  const W = page.width;
  const H = page.height;

  const visible = layout.areas.map((area, index) => ({ area, index })).filter(({ area }) => parsePages(area.pages, pageCount).includes(pageNo));
  const offsetOf = (area: Area) => areaInfo?.[area.id]?.offset ?? 0;
  const updateArea = (id: string | undefined, fn: (a: Area) => Area) => setLayout((l) => ({ ...l, areas: l.areas.map((a) => (a.id === id ? fn(a) : a)) }));

  useEffect(() => {
    if (highlight?.page === pageNo) highlightRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [highlight, pageNo]);

  // Screen pixels -> PDF points, whatever the zoom
  function toPdf(e: { clientX: number; clientY: number }) {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }

  function startDrag(e: PointerEvent, d: DragState) {
    if (tool !== "select") return; // in the other tools the click falls through to the page
    e.stopPropagation();
    svgRef.current!.setPointerCapture(e.pointerId);
    const { x, y } = toPdf(e);
    setDrag({ ...d, sx: x, sy: y });
    setSelected(d.select);
  }

  function onPointerDown(e: PointerEvent) {
    const p = toPdf(e);
    const x = r1(clamp(p.x, 0, W));
    const y = r1(clamp(p.y, 0, H));
    if (tool === "area" || tool.startsWith("box:")) {
      svgRef.current!.setPointerCapture(e.pointerId);
      setDraft({ x0: x, y0: y, x1: x, y1: y });
    } else if (tool === "vline" || tool === "hline") {
      const hit = visible.find(({ area }) => x > area.x0 && x < area.x1 && y > area.top + offsetOf(area) && y < area.bottom);
      if (!hit) return;
      const off = offsetOf(hit.area);
      if (tool === "vline") updateArea(hit.area.id, (a) => addDivider(a, x));
      else updateArea(hit.area.id, (a) => ({ ...a, horizontals: [...a.horizontals, r1(y - off)] }));
      setTool("select");
    } else {
      setSelected(null);
    }
  }

  function onPointerMove(e: PointerEvent) {
    if (!draft && !drag) return;
    const p = toPdf(e);
    const x = r1(clamp(p.x, 0, W));
    const y = r1(clamp(p.y, 0, H));
    if (draft) return setDraft({ ...draft, x1: x, y1: y });
    if (!drag) return;
    const dx = x - drag.sx;
    const dy = y - drag.sy;

    if (drag.kind === "box-move" || drag.kind === "box-resize") {
      const o = drag.orig as Box;
      let b: Box;
      if (drag.kind === "box-move") {
        const mx = clamp(dx, -o.x0, W - o.x1);
        const my = clamp(dy, -o.top, H - o.bottom);
        b = { ...o, x0: r1(o.x0 + mx), x1: r1(o.x1 + mx), top: r1(o.top + my), bottom: r1(o.bottom + my) };
      } else if (drag.corner === "br") {
        b = { ...o, x1: Math.max(x, o.x0 + 4), bottom: Math.max(y, o.top + 4) };
      } else {
        b = { ...o, x0: Math.min(x, o.x1 - 4), top: Math.min(y, o.bottom - 4) };
      }
      return setLayout((l) => ({ ...l, boxes: { ...l.boxes, [drag.field!]: b } }));
    }

    updateArea(drag.areaId, (a) => {
      const off = offsetOf(a);
      if (drag.kind === "divider") {
        const ds = [...a.dividers];
        const k = drag.index!;
        ds[k] = clamp(x, (k > 0 ? ds[k - 1] : a.x0) + 2, (k < ds.length - 1 ? ds[k + 1] : a.x1) - 2);
        return { ...a, dividers: ds };
      }
      if (drag.kind === "hline") return { ...a, horizontals: a.horizontals.map((h, i) => (i === drag.index ? r1(y - off) : h)) };
      if (drag.kind === "top") return { ...a, top: r1(clamp(y, 0, a.bottom - 5) - off) };
      if (drag.kind === "bottom") return { ...a, bottom: clamp(y, a.top + off + 5, H) };
      if (drag.kind === "left") return { ...a, x0: clamp(x, 0, (a.dividers[0] ?? a.x1) - 2) };
      if (drag.kind === "right") return { ...a, x1: clamp(x, (a.dividers[a.dividers.length - 1] ?? a.x0) + 2, W) };
      if (drag.kind === "move") {
        const o = drag.orig as Area;
        const mx = clamp(dx, -o.x0, W - o.x1);
        const my = clamp(dy, -(o.top + off), H - o.bottom);
        return {
          ...a,
          x0: r1(o.x0 + mx), x1: r1(o.x1 + mx), dividers: o.dividers.map((d) => r1(d + mx)),
          top: r1(o.top + my), bottom: r1(o.bottom + my), horizontals: o.horizontals.map((h) => r1(h + my)),
        };
      }
      return a;
    });
  }

  function onPointerUp() {
    if (draft) {
      const r = { x0: Math.min(draft.x0, draft.x1), top: Math.min(draft.y0, draft.y1), x1: Math.max(draft.x0, draft.x1), bottom: Math.max(draft.y0, draft.y1) };
      setDraft(null);
      if (r.x1 - r.x0 >= 8 && r.bottom - r.top >= 6) {
        if (tool === "area") {
          onAreaDrawn(r);
        } else {
          const field = tool.slice(4);
          setLayout((l) => ({ ...l, boxes: { ...l.boxes, [field]: { page: pageNo, ...r } } }));
          setSelected({ kind: "box", field });
        }
        setTool("select");
      }
    }
    setDrag(null);
  }

  function setColumnType(areaId: string, k: number, type: string) {
    updateArea(areaId, (a) => ({
      ...a,
      columns: a.columns.map((c, i) => (i !== k ? c : type === "Other" ? { type, name: c.type === "Other" ? c.name : otherName(a.columns) } : { type, flip: type === "Amount" ? !!c.flip : undefined })),
    }));
  }

  function swapColumns(areaId: string, i: number, j: number) {
    updateArea(areaId, (a) => {
      const columns = [...a.columns];
      [columns[i], columns[j]] = [columns[j], columns[i]];
      return { ...a, columns };
    });
  }

  // Column labels sit in one row above the area, centered on their column. Labels wider than a
  // narrow column get nudged sideways, and a leader line points back to their column.
  function chipsFor(area: Area) {
    const vl = [area.x0, ...area.dividers, area.x1];
    const top = (area.top + offsetOf(area)) * zoom;
    let prevRight = -Infinity;
    const chips = area.columns.map((col, k) => {
      const a = vl[k] * zoom;
      const b = vl[k + 1] * zoom;
      const width = Math.max(col.type === "Amount" ? 124 : col.type === "Other" ? 136 : 110, b - a - 4);
      const left = Math.max((a + b) / 2 - width / 2, prevRight + 3);
      prevRight = left + width;
      return { col, k, left, width, center: (a + b) / 2, top: top - 30, areaTop: top };
    });
    let limit = vl[vl.length - 1] * zoom + 70; // pushed too far right: pull back toward the area
    for (let i = chips.length - 1; i >= 0; i--) {
      chips[i].left = Math.min(chips[i].left, limit - chips[i].width);
      limit = chips[i].left - 3;
    }
    prevRight = -36 - 3; // but never off the left of the page margin
    for (const c of chips) {
      c.left = Math.max(c.left, prevRight + 3);
      prevRight = c.left + c.width;
    }
    return chips;
  }
  const SHORT: Record<string, string> = { TransactionDate: "Trans date", PostDate: "Post date", Description: "Description", Amount: "Amount" };
  const TINY: Record<string, string> = { TransactionDate: "Trans", PostDate: "Post", Description: "Desc", Amount: "Amt" };

  function labelsFor(area: Area, top: number) {
    const vl = [area.x0, ...area.dividers, area.x1];
    return area.columns.map((c, k) => (
      <text key={`l${k}`} x={vl[k] + 1.5} y={top - 2} className={`collabel k-${c.type}`}>
        {c.type === "Other" ? c.name : TINY[c.type]}
        {c.type === "Amount" && c.flip ? " ×−1" : ""}
      </text>
    ));
  }

  return (
    <div className="editor" style={{ width: W * zoom, height: H * zoom }}>
      <svg
        ref={svgRef}
        width={W * zoom}
        height={H * zoom}
        viewBox={`0 0 ${W} ${H}`}
        className={`page mode-${tool.startsWith("box:") ? "box" : tool}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {imgUrl && <image href={imgUrl} width={W} height={H} />}

        {visible.map(({ area, index }) => {
          const off = offsetOf(area);
          const top = area.top + off;
          const info = areaInfo?.[area.id];
          const skipped = info?.anchor === "missing";
          const vl = [area.x0, ...area.dividers, area.x1];
          const missing = OUTPUT_COLUMNS.filter((t) => !area.columns.some((c) => c.type === t) && !filled.has(t));
          const areaSelected = selected?.areaId === area.id;
          const empty = !skipped && info?.lines === 0;
          const tagText = `⠿ ${area.name}${skipped ? " · anchor not on this page, skipped" : empty ? " · no text inside this area" : missing.length ? ` · missing ${missing.join(", ")}` : ""}`;
          const tagY = area.bottom + 15 <= H ? area.bottom + 2 : area.bottom - 14;
          return (
            <g key={area.id} style={{ "--c": AREA_COLORS[index % AREA_COLORS.length] } as CSSProperties} className={skipped ? "area skipped" : "area"}>
              <rect x={area.x0} y={top} width={area.x1 - area.x0} height={Math.max(0, area.bottom - top)} className={areaSelected ? "hit area-box sel" : "hit area-box"}
                onPointerDown={(e) => { if (tool === "select") { e.stopPropagation(); setSelected({ kind: "area", areaId: area.id }); } }} />
              {hoverBand?.areaId === area.id && (
                <rect x={vl[hoverBand.k]} y={top} width={vl[hoverBand.k + 1] - vl[hoverBand.k]} height={Math.max(0, area.bottom - top)} className="band-hover" />
              )}
              {!skipped && (info?.rows_preview || []).map(({ bbox: b, dropped }, i) => (
                <g key={i} className={dropped ? "rowbox dropped" : "rowbox"}>
                  <rect x={b[0] - 1} y={b[1] - 0.5} width={b[2] - b[0] + 2} height={b[3] - b[1] + 1} />
                  {dropped && <line x1={b[0]} x2={b[2]} y1={(b[1] + b[3]) / 2} y2={(b[1] + b[3]) / 2} />}
                </g>
              ))}
              {!areaSelected && labelsFor(area, top)}
              {area.horizontals.map((h, i) => {
                const sel = selected?.kind === "hline" && areaSelected && selected.index === i;
                return (
                  <g key={`h${i}`}>
                    <line x1={area.x0} x2={area.x1} y1={h + off} y2={h + off} className={sel ? "hline sel" : "hline"} />
                    <line x1={area.x0} x2={area.x1} y1={h + off} y2={h + off} className="hit grab ns"
                      onPointerDown={(e) => startDrag(e, { kind: "hline", areaId: area.id, index: i, select: { kind: "hline", areaId: area.id, index: i } })} />
                  </g>
                );
              })}
              {area.dividers.map((d, i) => {
                const sel = selected?.kind === "divider" && areaSelected && selected.index === i;
                return (
                  <g key={`v${i}`}>
                    <line x1={d} x2={d} y1={top} y2={area.bottom} className={sel ? "divider sel" : "divider"} />
                    <line x1={d} x2={d} y1={top} y2={area.bottom} className="hit grab ew"
                      onPointerDown={(e) => startDrag(e, { kind: "divider", areaId: area.id, index: i, select: { kind: "divider", areaId: area.id, index: i } })} />
                  </g>
                );
              })}
              {([
                ["top", area.x0, top, area.x1, top, "ns"],
                ["bottom", area.x0, area.bottom, area.x1, area.bottom, "ns"],
                ["left", area.x0, top, area.x0, area.bottom, "ew"],
                ["right", area.x1, top, area.x1, area.bottom, "ew"],
              ] as [string, number, number, number, number, string][]).map(([edge, ax, ay, bx, by, cursor]) => (
                <line key={edge} x1={ax} y1={ay} x2={bx} y2={by} className={`hit grab edge ${cursor}`}
                  onPointerDown={(e) => startDrag(e, { kind: edge, areaId: area.id, select: { kind: "area", areaId: area.id } })} />
              ))}
              <g className={missing.length ? "hit tag warn" : "hit tag"} transform={`translate(${area.x0} ${tagY})`}
                onPointerDown={(e) => startDrag(e, { kind: "move", areaId: area.id, orig: area, select: { kind: "area", areaId: area.id } })}>
                <rect width={tagText.length * 4.4 + 10} height={12} rx={2} />
                <text x={5} y={8.8}>{tagText}</text>
              </g>
            </g>
          );
        })}

        {Object.entries(layout.boxes).filter(([, b]) => b && b.page === pageNo).map(([field, b]) => {
          const sel = selected?.kind === "box" && selected.field === field;
          return (
            <g key={field}>
              <rect x={b.x0} y={b.top} width={b.x1 - b.x0} height={b.bottom - b.top} className={sel ? "hit sbox sel" : "hit sbox"}
                onPointerDown={(e) => startDrag(e, { kind: "box-move", field, orig: b, select: { kind: "box", field } })} />
              <text x={b.x0} y={b.top - 2} className="sbox-label">{BOX_LABELS[field]}</text>
              {([["br", b.x1, b.bottom], ["tl", b.x0, b.top]] as [string, number, number][]).map(([corner, cx, cy]) => (
                <rect key={corner} x={cx - 2.5} y={cy - 2.5} width={5} height={5} className="hit handle"
                  onPointerDown={(e) => startDrag(e, { kind: "box-resize", corner, field, orig: b, select: { kind: "box", field } })} />
              ))}
            </g>
          );
        })}

        {highlight?.page === pageNo && (
          <rect ref={highlightRef} x={highlight.bbox[0] - 2} y={highlight.bbox[1] - 1} width={highlight.bbox[2] - highlight.bbox[0] + 4} height={highlight.bbox[3] - highlight.bbox[1] + 2} className="highlight" />
        )}
        {draft && (
          <rect x={Math.min(draft.x0, draft.x1)} y={Math.min(draft.y0, draft.y1)} width={Math.abs(draft.x1 - draft.x0)} height={Math.abs(draft.y1 - draft.y0)}
            className={tool === "area" ? "draft" : "draft box"} />
        )}
      </svg>

      <div className="overlay">
        <svg className="leaders" width={W * zoom} height={H * zoom}>
          {visible.filter(({ area }) => area.id === selected?.areaId).map(({ area }) =>
            chipsFor(area)
              .filter(({ left, width, center }) => Math.abs(left + width / 2 - center) > 6)
              .map(({ k, left, width, center, top, areaTop }) => (
                <line key={`${area.id}-${k}`} x1={left + width / 2} y1={top + 23} x2={center} y2={areaTop} />
              ))
          )}
        </svg>
        {visible.filter(({ area }) => area.id === selected?.areaId).map(({ area }) =>
          chipsFor(area).map(({ col, k, left, width, top }: { col: Column; k: number; left: number; width: number; top: number }) => (
            <div
              key={`${area.id}-${k}`}
              className={`chip k-${col.type}${chipDrag?.areaId === area.id && chipDrag.k !== k ? " droppable" : ""}`}
              style={{ left, top, width }}
              onMouseEnter={() => setHoverBand({ areaId: area.id, k })}
              onMouseLeave={() => setHoverBand(null)}
              onDragOver={(e) => {
                if (chipDrag?.areaId === area.id) {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (chipDrag?.areaId === area.id && chipDrag.k !== k) swapColumns(area.id, chipDrag.k, k);
                setChipDrag(null);
              }}
            >
              <span
                className="grip"
                draggable
                title="Drag onto another column label to swap them"
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", String(k));
                  e.dataTransfer.effectAllowed = "move";
                  setChipDrag({ areaId: area.id, k });
                }}
                onDragEnd={() => setChipDrag(null)}
              >
                ⠿
              </span>
              <select value={col.type} onChange={(e) => setColumnType(area.id, k, e.target.value)} title="What this column holds">
                {COLUMN_TYPES.map((t) => (
                  <option key={t} value={t}>{t === "Other" ? (col.type === "Other" ? `Other: ${col.name}` : "Other…") : SHORT[t]}</option>
                ))}
              </select>
              {col.type === "Amount" && (
                <button
                  className={col.flip ? "flip on" : "flip"}
                  title={col.flip ? "Sign flipped: values are multiplied by −1. Click to undo." : "Flip the sign of this column (multiply by −1)"}
                  onClick={() => updateArea(area.id, (a) => ({ ...a, columns: a.columns.map((c, i) => (i === k ? { ...c, flip: !c.flip } : c)) }))}
                >
                  ±
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
