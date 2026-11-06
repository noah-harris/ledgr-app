"""Runs user transforms. Reads a job as JSON on stdin, writes rows and a report as JSON on stdout.

Started as its own process by loader.run_transforms, so a crash or endless loop can't take the server down.
Only standard-library imports are allowed. This is not a security sandbox: os and subprocess are standard library.
"""
import builtins
import contextlib
import io
import json
import sys
import traceback
from datetime import date, datetime
from decimal import Decimal

STDLIB = set(sys.stdlib_module_names)
real_import = builtins.__import__


def stdlib_only_import(name, globals=None, locals=None, fromlist=(), level=0):
    if level == 0 and name.partition(".")[0] not in STDLIB:
        raise ImportError(f"'{name}' isn't in the standard library. Transforms can only import standard-library modules.")
    return real_import(name, globals, locals, fromlist, level)


def decode(v):
    kind, s = v
    if kind == "date":
        return date.fromisoformat(s)
    if kind == "decimal":
        return Decimal(s)
    if kind == "int":
        return int(s)
    if kind == "none":
        return None
    return s


def encode(v):
    if v is None:
        return ["none", ""]
    if isinstance(v, datetime):
        return ["date", v.date().isoformat()]
    if isinstance(v, date):
        return ["date", v.isoformat()]
    if isinstance(v, bool):
        return ["str", str(v)]
    if isinstance(v, Decimal):
        return ["decimal", str(v)]
    if isinstance(v, int):
        return ["int", str(v)]
    if isinstance(v, float):
        return ["decimal", repr(v)]
    return ["str", str(v)]


def describe(e, filename):
    # Point at the line in the user's code, not in this runner
    if isinstance(e, SyntaxError):
        return f"line {e.lineno}: SyntaxError: {e.msg}"
    lines = [f.lineno for f in traceback.extract_tb(e.__traceback__) if f.filename == filename]
    msg = str(e) if not str(e).startswith("[<class") else "decimal error"  # decimal signals print as a class list
    return (f"line {lines[-1]}: " if lines else "") + f"{type(e).__name__}: {msg}"


def main():
    sys.stdin.reconfigure(encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")
    job = json.load(sys.stdin)
    stmt = {k: decode(v) for k, v in job["stmt"].items()}
    rows = [{k: decode(v) for k, v in r.items()} for r in job["rows"]]
    report = []

    builtins.__import__ = stdlib_only_import
    for t in job["transforms"]:
        printed, errors, filename = io.StringIO(), [], f"<{t['name']}>"
        with contextlib.redirect_stdout(printed):
            try:
                namespace = {}
                exec(compile(t["code"], filename, "exec"), namespace)
                fn = namespace.get("transform")
                if not callable(fn):
                    raise NameError("Define a function named transform(value, row, stmt)")
            except BaseException as e:
                errors.append({"row": None, "error": describe(e, filename)})
                fn = None
            for i, row in enumerate(rows if fn else []):
                try:
                    row[t["target"]] = fn(row.get(t["target"]), row, stmt)
                except Exception as e:
                    if len(errors) < 50:
                        errors.append({"row": i + 1, "error": describe(e, filename)})
        report.append({"name": t["name"], "output": printed.getvalue()[:4000], "errors": errors})
    builtins.__import__ = real_import

    json.dump({"rows": [{k: encode(v) for k, v in r.items()} for r in rows], "report": report}, sys.stdout)


if __name__ == "__main__":
    main()
