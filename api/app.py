from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from db import warm, dispose_engines
from fastapi.middleware.cors import CORSMiddleware
import traceback
from fastapi.responses import JSONResponse

@asynccontextmanager
async def lifespan(app:FastAPI):
    warm("ldr")
    yield
    dispose_engines()

app = FastAPI(lifespan=lifespan)


# Turn any unhandled exception into a 500 JSON response
@app.middleware("http")
async def catch_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        traceback.print_exc()  # still log the full traceback in the terminal
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": f"{type(exc).__name__}: {exc}"},
        )



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://local.harrisnet:8004"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)