import uvicorn
from fastapi import FastAPI
from config import API_INTERNAL_PORT

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=API_INTERNAL_PORT)


