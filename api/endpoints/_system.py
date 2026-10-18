from ._imports import *
from fastapi.routing import APIRoute

@app.get("/routes", status_code=200, response_description="List all routes", response_model=list)
def get_all_routes(current_user:dict=Depends(get_current_user)):
    routes_list = []
    for route in app.routes:
        if isinstance(route, APIRoute):
            routes_list.append({
                "path": route.path,
                "methods": list(route.methods)
            })
    routes_list.sort(key=lambda x: x["path"])
    return routes_list


@app.get("/health", status_code=200, response_description="Check the health of the system", response_model=dict)
@catch("Failed to check health")
def health():
    return {"status": "ok"}