import importlib
import pkgutil
from fastapi.routing import APIRoute
from app import app

for m in pkgutil.iter_modules(__path__):
    if m.name.startswith("_"):
        continue
    before = len(app.routes)
    importlib.import_module(f"{__name__}.{m.name}")
    added = app.routes[before:]
    expected = "/" + m.name.rstrip("_").replace("_", "/")
    if not added:
        raise RuntimeError(f"endpoints/{m.name}.py registered no endpoints")
    wrong = [r.path for r in added if r.path != expected and not r.path.startswith(expected + "/")]
    if wrong:
        raise RuntimeError(f"endpoints/{m.name}.py must only register {expected} or {expected}/..., found {wrong}")

routes = [(method, r.path) for r in app.routes if isinstance(r, APIRoute) for method in r.methods]
dupes = {x for x in routes if routes.count(x) > 1}
if dupes:
    raise RuntimeError(f"Registered more than once: {dupes}")
