from app import app
from db import get_connection, exec
from error import catch
from pathlib import Path
from passlib.context import CryptContext
from fastapi import HTTPException, status, UploadFile, Depends
from fastapi.responses import FileResponse, JSONResponse
from fastapi.routing import APIRoute
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from uuid import uuid4
from models import *
from tempfile import TemporaryDirectory
import json
from starlette.background import BackgroundTask
from zipfile import ZipFile
from datetime import datetime, timedelta, timezone
from tempfile import mkdtemp
from collections import defaultdict
import shutil
from sqlalchemy.exc import IntegrityError
from jose.exceptions import ExpiredSignatureError
from jose import jwt, JWTError

from config import API_SECRET_KEY

ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 120
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token:str=Depends(oauth2_scheme)) -> Users:
    try:
        payload = jwt.decode(token, API_SECRET_KEY, algorithms=[ALGORITHM])
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired", headers={"WWW-Authenticate": "Bearer"})
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials", headers={"WWW-Authenticate": "Bearer"})

    id_users = payload.get("sub")
    if id_users is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials", headers={"WWW-Authenticate": "Bearer"})

    res = exec(
        statement="SELECT * FROM [dbo].[Users] WHERE [idUsers] = :idUsers",
        database="ldr",
        parameters={"idUsers": id_users},
    )
    
    if len(res) != 1:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials", headers={"WWW-Authenticate": "Bearer"})
    else:
        return Users(**res[0])




