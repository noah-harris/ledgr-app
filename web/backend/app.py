from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

DIST = Path(__file__).resolve().parent.parent / "frontend/dist"

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

# Built JS/CSS files
app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")

# Everything else → index.html so React Router handles the URL
@app.get("/{path:path}")
def spa(path: str):
    if path.startswith("api/"):
        raise HTTPException(404)
    file = DIST / path
    if file.is_file():
        return FileResponse(file)          # favicon, etc.
    return FileResponse(DIST / "index.html")