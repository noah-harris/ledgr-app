from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback
from db import warm, dispose_engines


@asynccontextmanager
async def lifespan(app:FastAPI):
    warm("ldr")
    yield
    dispose_engines()

app = FastAPI(lifespan=lifespan)


@app.middleware("http")
async def catch_exceptions(request: Request, call_next):
    """
        Catch any unhandled exceptions and return a JSON response with status code 500.
    """
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
