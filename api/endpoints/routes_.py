from ._imports import *

@app.get("/routes", status_code=200, response_description="List all routes", response_model=list[dict])
def get_all_routes(current_user:Users=Depends(get_current_user)):
    routes_dict = defaultdict(list)
    for route in app.routes:
        if isinstance(route, APIRoute):
            routes_dict[route.path].extend(list(route.methods))
    routes = [{"path":path, "methods": info} for path, info in routes_dict.items()]
    return routes