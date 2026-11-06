"""Statement extraction: OCR areas -> rows -> transforms -> validated transactions."""
import json
import os
import re
import subprocess
import sys
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path

OUTPUT_COLUMNS = ["TransactionDate", "PostDate", "Description", "Amount"]
STATEMENT_FIELDS = {
    "statement_date": ("Statement date", "date"),
    "start_date": ("Start date", "date"),
    "end_date": ("End date", "date"),
    "start_balance": ("Start balance", "amount"),
    "end_balance": ("End balance", "amount"),
}
AMOUNT_RE = re.compile(r"\(?-?\$?\s?(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2}\)?(?:\s?CR|-)?", re.I)
DATE_RE = re.compile(
    r"\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2}|[A-Za-z]{3,9}\.? \d{1,2},? \d{4}|\d{1,2} [A-Za-z]{3,9},? \d{4}"
)
FULL_FORMATS = ["%m/%d/%Y", "%m/%d/%y", "%m-%d-%Y", "%m-%d-%y", "%Y-%m-%d",
                "%b %d, %Y", "%B %d, %Y", "%b %d %Y", "%B %d %Y", "%d %b %Y", "%d %B %Y"]
YEARLESS_FORMATS = ["%m/%d", "%m-%d", "%b %d", "%B %d", "%d %b", "%d %B"]
RUNNER = Path(__file__).with_name("runner.py")
TRANSFORM_TIMEOUT = 10
RUNNER_ENV = {k: os.environ[k] for k in ("PATH", "SYSTEMROOT") if k in os.environ}  # keeps the API's secrets out of os.environ in user code


def to_amount(text):
    s = str(text).upper().replace("−", "-").replace("$", "").replace(",", "").replace(" ", "")
    neg = s.startswith("(") or s.startswith("-") or s.endswith("-") or s.endswith("CR")
    s = s.removesuffix("CR").strip("()-+")
    if not re.fullmatch(r"\d+(\.\d+)?|\.\d+", s):
        return None
    return -Decimal(s) if neg else Decimal(s)


def parse_date(text, ref=None, fmt=""):
    """Returns (date, error). Year-less dates (12/28) take the year that lands closest to ref."""
    s = re.sub(r"(?<=[A-Za-z])\.", "", " ".join(str(text).split())).strip(" ,")
    if not s:
        return None, "missing"
    for f in [fmt] if fmt else FULL_FORMATS + YEARLESS_FORMATS:
        has_year = "%y" in f.lower()
        try:
            d = datetime.strptime(s if has_year else f"{s} 2000", f if has_year else f"{f} %Y").date()
        except ValueError:
            continue
        if has_year:
            return d, None
        if ref is None:
            return None, f"{s} has no year; set the End date so the year can be filled in"
        options = []
        for y in (ref.year - 1, ref.year, ref.year + 1):
            try:
                options.append(date(y, d.month, d.day))
            except ValueError:
                pass
        if options:
            return min(options, key=lambda c: abs((c - ref).days)), None
    return None, f"not a date: {s}"


def parse_pages(spec, n_pages):
    spec = (spec or "all").strip().lower()
    if spec in ("", "all"):
        return list(range(1, n_pages + 1))
    nums = []
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        a, dash, b = part.partition("-")
        try:
            start = int(a)
            end = int(b) if b.strip() else (n_pages if dash else start)
        except ValueError:
            raise ValueError(f"Bad page range '{part}'. Use all, 1-3, 2- or 1,3")
        nums += range(start, end + 1)
    return sorted({p for p in nums if 1 <= p <= n_pages})


def page_chars(page):
    """Visible characters in image coordinates (0,0 = top-left of the rendered page).
    Many bank PDFs don't put the page origin at 0,0, and draw bold text twice; both are undone here."""
    ox, oy = page.bbox[0], page.bbox[1]
    return [{"text": c["text"], "x0": c["x0"] - ox, "x1": c["x1"] - ox, "top": c["top"] - oy, "bottom": c["bottom"] - oy,
             "size": c.get("size") or 10}
            for c in page.dedupe_chars().chars if c["text"].strip()]


def inside(chars, x0, top, x1, bottom):
    """Characters whose center falls in the box."""
    return [c for c in chars if x0 <= (c["x0"] + c["x1"]) / 2 < x1 and top <= (c["top"] + c["bottom"]) / 2 < bottom]


def text_lines(chars):
    """Characters grouped into visual lines, top to bottom, each sorted left to right."""
    lines = []
    for c in sorted(chars, key=lambda c: (c["top"] + c["bottom"]) / 2):
        mid = (c["top"] + c["bottom"]) / 2
        if lines and abs(mid - lines[-1]["mid"]) <= max(1.5, 0.4 * (c["bottom"] - c["top"])):
            lines[-1]["chars"].append(c)
        else:
            lines.append({"mid": mid, "chars": [c]})
    return [sorted(line["chars"], key=lambda c: c["x0"]) for line in lines]


def text_of(chars):
    """One line of characters as text, with a space wherever the gap is wider than a sliver of the font size."""
    out, prev = "", None
    for c in sorted(chars, key=lambda c: c["x0"]):
        if prev and c["x0"] - prev["x1"] > max(1.0, 0.2 * c["size"]):
            out += " "
        out += c["text"]
        prev = c
    return out


def bbox_of(chars):
    return [round(min(c["x0"] for c in chars), 1), round(min(c["top"] for c in chars), 1),
            round(max(c["x1"] for c in chars), 1), round(max(c["bottom"] for c in chars), 1)]


def find_anchor(lines, text, near_y):
    """Bottom of the line containing text, picking the match closest to near_y."""
    want = " ".join(text.lower().split())
    hits = [max(c["bottom"] for c in line) for line in lines if want and want in text_of(line).lower()]
    return min(hits, key=lambda y: abs(y - near_y)) if hits else None


def auto_columns(page, x0, top, x1, bottom):
    """Column dividers from the empty gutters between transaction lines, plus a guess at each column's type."""
    if x1 - x0 < 5 or bottom - top < 5:
        return None
    chars = page_chars(page)
    lines = text_lines(inside(chars, x0, top, x1, bottom))
    # Lines that carry an amount are transactions; notes and headings don't get a vote on gutters
    data = [line for line in lines if any(AMOUNT_RE.fullmatch(t) for t in text_of(line).split())] or lines
    if not data:
        return None

    lo, hi = int(x0), int(x1) + 1
    cover = [0] * (hi - lo + 1)
    for line in data:
        for x in {x for c in line for x in range(int(c["x0"]), int(c["x1"]) + 1)}:
            if lo <= x <= hi:
                cover[x - lo] += 1
    ink = [i for i, c in enumerate(cover) if c]
    dividers, start = [], None
    for i in range(ink[0], ink[-1] + 1):
        if cover[i] == 0:
            start = i if start is None else start
        elif start is not None:
            if i - start >= 5:
                dividers.append(round(lo + (start + i - 1) / 2, 1))
            start = None

    bands = [x0] + dividers + [x1]
    n = len(bands) - 1
    band_of = lambda c: next(k for k in range(n) if (c["x0"] + c["x1"]) / 2 < bands[k + 1] or k == n - 1)
    cells = [[text_of([c for c in line if band_of(c) == k]) for k in range(n)] for line in data]

    # Printed headers just above the area help name columns. Stacked headers ("Trans" over "Date") are joined.
    # Skip transaction lines, and section titles: a title is one phrase running across the columns,
    # a header line is several phrases with wide gaps between them.
    above = []
    for line in text_lines(inside(chars, x0, max(0, top - 30), x1, top)):
        phrases = 1 + sum(b["x0"] - a["x1"] > 0.8 * b["size"] for a, b in zip(line, line[1:]))
        if any(AMOUNT_RE.fullmatch(t) for t in text_of(line).split()):
            continue
        if phrases == 1 and any(line[0]["x0"] < d < line[-1]["x1"] for d in dividers):
            continue
        above.append(line)
    above = above[-3:]
    header = [" ".join(text_of([c for c in line if band_of(c) == k]) for line in above).strip() for k in range(n)]

    stats = []
    for k in range(n):
        vals = [c[k] for c in cells if c[k]]
        m = len(vals) or 1
        stats.append({
            "fill": len(vals) / len(cells),
            "date": sum(parse_date(v, date(2000, 12, 31))[0] is not None for v in vals) / m,
            "amount": sum(bool(AMOUNT_RE.fullmatch(v.replace(" ", ""))) for v in vals) / m,
            "length": sum(len(v) for v in vals) / m,
        })

    cols, taken = [None] * n, set()
    date_cols = [k for k in range(n) if stats[k]["date"] >= 0.6]
    for k in date_cols:
        h = header[k].lower()
        want = "PostDate" if "post" in h else "TransactionDate" if "tran" in h else None
        if want and want not in taken:
            cols[k] = {"type": want}
            taken.add(want)
    for k in date_cols:
        if cols[k] is None:
            t = next((t for t in ("TransactionDate", "PostDate") if t not in taken), None)
            cols[k] = {"type": t} if t else {"type": "Other", "name": header[k] or "Date"}
            taken.add(t)

    amount_cols = [k for k in range(n) if cols[k] is None and stats[k]["amount"] >= 0.6]
    balance = [k for k in amount_cols if "balance" in header[k].lower()]
    if not balance and (len(amount_cols) >= 3 or (len(amount_cols) == 2 and min(stats[k]["fill"] for k in amount_cols) >= 0.9)):
        balance = [amount_cols[-1]]  # a running balance is filled on every line, debit/credit columns aren't
    for k in amount_cols:
        if k in balance:
            cols[k] = {"type": "Other", "name": header[k] or "Balance"}
        else:
            cols[k] = {"type": "Amount", "flip": bool(re.search(r"withdraw|debit|subtract", header[k], re.I))}

    rest = [k for k in range(n) if cols[k] is None]
    if rest:
        cols[max(rest, key=lambda k: stats[k]["length"] * stats[k]["fill"])] = {"type": "Description"}
    for k in rest:
        if cols[k] is None:
            cols[k] = {"type": "Other", "name": header[k] or f"Other {k + 1}"}
    return {"dividers": dividers, "columns": cols}


def run_transforms(rows, stmt, transforms):
    """Runs the user's Python in a separate process so a crash or endless loop can't take the server down."""
    job = json.dumps({"rows": rows, "stmt": stmt, "transforms": transforms})
    try:
        proc = subprocess.run([sys.executable, "-I", str(RUNNER)], input=job, capture_output=True, encoding="utf-8", timeout=TRANSFORM_TIMEOUT, env=RUNNER_ENV)
    except subprocess.TimeoutExpired:
        msg = f"Stopped after {TRANSFORM_TIMEOUT} seconds. Check for an endless loop."
        return rows, [{"name": t["name"], "output": "", "errors": [{"row": None, "error": msg}]} for t in transforms]
    if proc.returncode != 0:
        return rows, [{"name": "(transform runner)", "output": "", "errors": [{"row": None, "error": proc.stderr.strip()[-1500:]}]}]
    out = json.loads(proc.stdout)
    return out["rows"], out["report"]


def extract(pdf, layout, overrides, transforms, preview_page):
    n_pages = len(pdf.pages)
    date_fmt = (layout.get("date_fmt") or "").strip()
    drop_text = (layout.get("drop_regex") or "").strip()
    try:
        drop = re.compile(drop_text, re.I) if drop_text else None
    except re.error as e:
        raise ValueError(f"Drop rows regex: {e}")
    checks = []
    chars_cache, lines_cache = {}, {}

    # 1. Statement values: what the user typed wins, otherwise the text inside the drawn box
    statement, stmt_vals = {}, {}
    for field, (label, kind) in STATEMENT_FIELDS.items():
        box = (layout.get("boxes") or {}).get(field)
        text = ""
        if box and 1 <= box["page"] <= n_pages:
            if box["page"] not in chars_cache:
                chars_cache[box["page"]] = page_chars(pdf.pages[box["page"] - 1])
            text = "\n".join(text_of(line) for line in text_lines(inside(chars_cache[box["page"]], box["x0"], box["top"], box["x1"], box["bottom"])))
        typed = str(overrides.get(field) or "").strip()
        source = typed or text
        value = None
        if source and kind == "date":
            value = parse_date(source)[0]
            if value is None:
                value = next((d for d in (parse_date(m.group())[0] for m in DATE_RE.finditer(source)) if d), None)
        elif source:
            value = to_amount(source)
            if value is None:
                m = AMOUNT_RE.search(source)
                value = to_amount(m.group()) if m else None
        stmt_vals[field] = value
        statement[field] = {
            "label": label,
            "text": text,
            "typed": bool(typed),
            "value": None if value is None else (value.isoformat() if kind == "date" else str(value)),
            "error": f"No {kind} found in “{source[:60]}”" if source and value is None else None,
        }
    ref = stmt_vals["end_date"] or stmt_vals["statement_date"]
    unset = [statement[f]["label"] for f in STATEMENT_FIELDS if stmt_vals[f] is None]
    checks.append({"name": "Statement values", "ok": not unset,
                   "detail": "all set" if not unset else "missing " + ", ".join(unset)})

    # 2. Rows from every OCR area on every page it applies to
    records, values, areas_out = [], [], {}
    for ai, area in enumerate(layout.get("areas") or []):
        name = (area.get("name") or "").strip() or f"Area {ai + 1}"
        cols = area["columns"]
        types = [c["type"] for c in cols]
        vlines = [area["x0"]] + sorted(area.get("dividers") or []) + [area["x1"]]
        if len(vlines) - 1 != len(cols):
            raise ValueError(f"{name}: {len(cols)} column labels for {len(vlines) - 1} columns")
        filled = {t["target"] for t in transforms}  # a transform can supply a column the statement doesn't print
        missing = [t for t in OUTPUT_COLUMNS if t not in types and t not in filled]
        doubled = [t for t in ("TransactionDate", "PostDate") if types.count(t) > 1]
        if missing or doubled:
            checks.append({"name": f"{name} columns", "ok": False, "detail": "; ".join(
                ([f"missing {', '.join(missing)}"] if missing else []) + ([f"more than one {', '.join(doubled)}"] if doubled else []))})

        anchored = bool((area.get("anchor_text") or "").strip()) and area.get("anchor_y") is not None
        out = areas_out[area["id"]] = {"name": name, "offset": 0.0, "rows_preview": [], "lines": None, "anchor": None, "rows": 0, "skipped": []}
        manual = area.get("rows_mode") == "manual"
        rows = []
        for n in parse_pages(area.get("pages"), n_pages):
            page = pdf.pages[n - 1]
            if n not in chars_cache:
                chars_cache[n] = page_chars(page)
            offset = 0.0
            if anchored:
                if n not in lines_cache:
                    lines_cache[n] = text_lines(chars_cache[n])
                y = find_anchor(lines_cache[n], area["anchor_text"], area["anchor_y"])
                if n == preview_page:
                    out["anchor"] = "found" if y is not None else "missing"
                if y is None:
                    out["skipped"].append(n)  # no anchor on this page means no table here
                    continue
                offset = y - area["anchor_y"]
            # The anchor moves the top and row lines; the bottom stays where it was drawn
            x0, top, x1, bottom = area["x0"], area["top"] + offset, area["x1"], area["bottom"]
            if n == preview_page:
                out["offset"] = offset
            hlines = sorted(h + offset for h in area.get("horizontals") or [] if top < h + offset < bottom)
            achars = inside(chars_cache[n], x0, top, x1, bottom)
            if n == preview_page:
                out["lines"] = len(text_lines(achars))
            if manual:
                # Everything between two row lines is one row
                bounds = [top] + hlines + [bottom]
                groups = [inside(achars, x0, a, x1, b) for a, b in zip(bounds, bounds[1:])]
            else:
                groups = text_lines(achars)
            prev_mid = None
            for g in groups:
                if not g:
                    continue
                cells = []
                for k in range(len(cols)):
                    band = [c for c in g if vlines[k] <= (c["x0"] + c["x1"]) / 2 < vlines[k + 1]]
                    cells.append(" ".join(text_of(line) for line in text_lines(band)))
                bbox = bbox_of(g)
                mid = (bbox[1] + bbox[3]) / 2
                # In auto mode a row line between two text lines stops them being folded together
                barrier = prev_mid is not None and any(prev_mid < h < mid for h in hlines)
                rows.append({"cells": cells, "page": n, "bbox": bbox, "lines": len(text_lines(g)), "barrier": barrier})
                prev_mid = mid

        if drop:
            # Also match with cells glued together, since a column line can split a word
            dropped = [r for r in rows if drop.search(" ".join(r["cells"])) or drop.search("".join(r["cells"]))]
            rows = [r for r in rows if r not in dropped]
            out["rows_preview"] += [{"bbox": r["bbox"], "dropped": True} for r in dropped if r["page"] == preview_page]

        date_idx = [k for k, t in enumerate(types) if t in ("TransactionDate", "PostDate")]
        amount_idx = [k for k, t in enumerate(types) if t == "Amount"]
        if area.get("fold_overflow", True) and not manual:
            # A line with no date is overflow from the line above when it has no amount either,
            # or when it carries the amount the line above was missing
            folded = []
            for r in rows:
                c = r["cells"]
                if folded and not r["barrier"] and not any(c[k] for k in date_idx):
                    prev = folded[-1]
                    if not any(c[k] for k in amount_idx) or not any(prev["cells"][k] for k in amount_idx):
                        prev["cells"] = [(a + " " + b).strip() if b else a for a, b in zip(prev["cells"], c)]
                        if prev["page"] == r["page"]:
                            pb, rb = prev["bbox"], r["bbox"]
                            prev["bbox"] = [min(pb[0], rb[0]), min(pb[1], rb[1]), max(pb[2], rb[2]), max(pb[3], rb[3])]
                        prev["lines"] += 1
                        continue
                folded.append(r)
            rows = folded
        if area.get("fill_dates"):
            last = {}
            for r in rows:
                for k in date_idx:
                    if r["cells"][k]:
                        last[k] = r["cells"][k]
                    elif k in last:
                        r["cells"][k] = last[k]
        out["rows"] = len(rows)
        out["rows_preview"] += [{"bbox": r["bbox"], "dropped": False} for r in rows if r["page"] == preview_page]
        if not rows:
            checks.append({"name": f"{name} rows", "ok": False, "detail": "no rows found" + (
                f"; anchor text not found on pages {out['skipped']}" if out["skipped"] else "")})
        elif out["skipped"]:
            checks.append({"name": f"{name} anchor", "ok": True, "detail": f"not on pages {out['skipped']}, skipped"})

        other_names = {}
        for k, c in enumerate(cols):
            if c["type"] == "Other":
                nm = (c.get("name") or "").strip() or f"Other {k + 1}"
                other_names[k] = f"{nm} (other)" if nm in OUTPUT_COLUMNS + ["Page", "Area"] or nm.startswith("Amount ") else nm

        for r in rows:
            c = r["cells"]
            vals = {}
            for t in ("TransactionDate", "PostDate"):
                raw = " ".join(c[k] for k in range(len(cols)) if types[k] == t and c[k])
                d = parse_date(raw, ref, date_fmt)[0] if raw else None
                vals[t] = ["date", d.isoformat()] if d else (["str", raw] if raw else ["none", ""])
            vals["Description"] = ["str", " ".join(c[k] for k in range(len(cols)) if types[k] == "Description" and c[k])]
            total, bad = Decimal(0), []
            for j, k in enumerate(amount_idx):
                a = to_amount(c[k]) if c[k] else None
                if c[k] and a is None:
                    bad.append(c[k])
                if a is not None:
                    a = -a if cols[k].get("flip") else a
                    total += a
                if len(amount_idx) > 1:
                    vals[f"Amount {j + 1}"] = ["decimal", str(a)] if a is not None else (["str", c[k]] if c[k] else ["none", ""])
            any_amount = any(c[k] for k in amount_idx)
            vals["Amount"] = ["str", " ".join(bad)] if bad else (["decimal", str(total)] if any_amount else ["none", ""])
            for k, nm in other_names.items():
                vals[nm] = ["str", c[k]]
            vals["Page"] = ["int", str(r["page"])]
            vals["Area"] = ["str", name]
            values.append(vals)
            records.append({"page": r["page"], "bbox": r["bbox"], "area": name, "lines": r["lines"], "source": " | ".join(c)})

    order = sorted(range(len(records)), key=lambda i: (records[i]["page"], records[i]["bbox"][1]))
    records = [records[i] for i in order]
    values = [values[i] for i in order]

    # 3. Transforms, in order, over every row
    report = []
    if transforms and values:
        stmt_enc = {f: (["none", ""] if v is None else ["date", v.isoformat()] if isinstance(v, date) else ["decimal", str(v)])
                    for f, v in stmt_vals.items()}
        values, report = run_transforms(values, stmt_enc, [{"name": t["name"], "target": t["target"], "code": t["code"]} for t in transforms])
        for t, rep in zip(transforms, report):
            rep["id"] = t.get("id")
        n_err = sum(len(r["errors"]) for r in report)
        checks.append({"name": "Transforms", "ok": n_err == 0, "detail": "ran cleanly" if not n_err else f"{n_err} errors"})

    # 4. Final types: dates must be dates, amounts must be numbers
    total, n_problems = Decimal(0), 0
    for rec, vals in zip(records, values):
        probs = []
        for col in ("TransactionDate", "PostDate"):
            kind, s = vals.get(col, ["none", ""])
            if kind == "date":
                rec[col] = s[:10]
            else:
                d, err = parse_date(s, ref, date_fmt) if s.strip() else (None, "missing")
                rec[col] = d.isoformat() if d else s
                if err:
                    probs.append(f"{col}: {err}")
        kind, s = vals.get("Amount", ["none", ""])
        try:
            a = Decimal(s) if kind in ("decimal", "int") else (to_amount(s) if s.strip() else None)
            if a is not None and not a.is_finite():
                a = None
        except InvalidOperation:
            a = None
        if a is None:
            rec["Amount"] = s
            probs.append("Amount: missing" if not s.strip() else f"Amount: not an amount: {s}")
        else:
            q = a.quantize(Decimal("0.01"))
            a = q if q == a else a
            rec["Amount"] = str(a)
            total += a
        kind, s = vals.get("Description", ["none", ""])
        rec["Description"] = s
        if not s.strip():
            probs.append("Description: missing")
        rec["problems"] = probs
        n_problems += bool(probs)

    if records:
        checks.append({"name": "Every row parsed", "ok": n_problems == 0,
                       "detail": "ok" if not n_problems else f"{n_problems} of {len(records)} rows have problems"})
    reconcile = None
    if stmt_vals["start_balance"] is not None and stmt_vals["end_balance"] is not None:
        computed = stmt_vals["start_balance"] + total
        ok = computed == stmt_vals["end_balance"]
        reconcile = {"start": f"{stmt_vals['start_balance']:,.2f}", "total": f"{total:,.2f}",
                     "computed": f"{computed:,.2f}", "end": f"{stmt_vals['end_balance']:,.2f}", "ok": ok}
        checks.append({"name": "Start + transactions = end", "ok": ok,
                       "detail": f"{reconcile['computed']} vs {reconcile['end']}"})

    if not layout.get("areas"):
        status = "NO AREAS"
    else:
        status = "PASS" if records and all(c["ok"] for c in checks) else "FAIL"
    return {
        "status": status,
        "checks": checks,
        "statement": statement,
        "records": records,
        "total": f"{total:,.2f}",
        "reconcile": reconcile,
        "transforms": report,
        "areas": areas_out,
        "preview_page": preview_page,
    }
