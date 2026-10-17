from app import app
import uvicorn
from config import API_INTERNAL_PORT
from endpoints import *

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(API_INTERNAL_PORT))


