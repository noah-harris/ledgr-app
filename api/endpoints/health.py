from ._imports_ import *

@app.get("/health")
@catch("Failed to check health")
def health():
    return {"status": "ok"}