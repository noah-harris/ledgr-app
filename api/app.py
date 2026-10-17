from contextlib import asynccontextmanager
from fastapi import FastAPI
from db import warm, dispose_engines
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app:FastAPI):
    warm("ldr")
    yield
    dispose_engines()

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://local.harrisnet:8004"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)