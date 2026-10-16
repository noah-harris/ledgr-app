import uvicorn
from app import app
from config import WEB_INTERNAL_PORT

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=WEB_INTERNAL_PORT)
