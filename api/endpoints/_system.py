from ._imports import *
from fastapi.routing import APIRoute
from collections import defaultdict

@app.get("/routes", status_code=200, response_description="List all routes", response_model=list[dict])
def get_all_routes(current_user:Users=Depends(get_current_user)):
    routes_dict = defaultdict(list)
    for route in app.routes:
        if isinstance(route, APIRoute):
            routes_dict[route.path].extend(list(route.methods))
    routes = [{"path":path, "methods": info} for path, info in routes_dict.items()]
    return routes


@app.get("/health", status_code=200, response_description="Check the health of the system", response_model=dict)
@catch("Failed to check health")
def health():
    return {"status": "ok"}