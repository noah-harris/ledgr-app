from ._imports import *

@app.get("/health", status_code=200, response_description="Check the health of the system", response_model=dict)
@catch("Failed to check health")
def health():
    return {"status": "ok"}