from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from passlib.context import CryptContext
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
import db
from config import API_SECRET_KEY
from app import app
import shutil
from models import Users, Token

ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 120
USER_DATA_ROOT = Path("/app/data")
USER_SUBFOLDERS = ("FILES", "EMAIL_ATTACHMENTS")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def _unauthorized(detail:str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(token:str=Depends(oauth2_scheme)) -> Users:
    try:
        payload = jwt.decode(token, API_SECRET_KEY, algorithms=[ALGORITHM])
    except ExpiredSignatureError:
        raise _unauthorized("Token expired")
    except JWTError:
        raise _unauthorized("Invalid credentials")

    id_users = payload.get("sub")
    if id_users is None:
        raise _unauthorized("Invalid credentials")

    res = db.exec(
        statement="SELECT * FROM [dbo].[Users] WHERE [idUsers] = :idUsers",
        database="ldr",
        parameters={"idUsers": id_users},
    )
    if len(res) != 1:
        raise _unauthorized("Invalid credentials")
    else:
        return Users(**res[0])


@app.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends()):
    rows = db.exec(
        statement="SELECT [idUsers], [Username], [Password] FROM [dbo].[Users] WHERE [Username] = :Username",
        database="ldr",
        parameters={"Username": form.username},
    )
    row = rows[0] if rows else None

    if row is None or not pwd_context.verify(form.password, row["Password"]):
        raise _unauthorized("Wrong username or password")

    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": str(row["idUsers"]), "exp": expire},
        API_SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/user", response_model=Users)
def get_user(current_user:Users=Depends(get_current_user)):
    return current_user


@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user:Users):
    HashedPassword = pwd_context.hash(user.Password)
    idUsers = str(uuid4()).upper()
    user_root = USER_DATA_ROOT / idUsers

    try:
        for subfolder in USER_SUBFOLDERS:
            (user_root / subfolder).mkdir(parents=True, exist_ok=True)
    except OSError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not create user storage: {exc}",
        )

    try:
        db.exec(
            statement="""
                INSERT INTO [dbo].[Users] ([idUsers], [Username], [Password], [FirstName], [LastName], [Email], [Phone])
                VALUES (:idUsers, :username, :password, :first_name, :last_name, :email, :phone)
            """,
            database="ldr",
            parameters={
                "idUsers": idUsers,
                "username": user.Username,
                "password": HashedPassword,
                "first_name": user.FirstName,
                "last_name": user.LastName,
                "email": user.Email,
                "phone": user.Phone,
            },
        )

    except IntegrityError:
        shutil.rmtree(user_root, ignore_errors=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username, email, or phone already registered",
        )

    return {"message": "User registered successfully"}