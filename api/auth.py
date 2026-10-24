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
from db import get_connection
from config import API_SECRET_KEY
from app import app
from models import User, Token
import shutil

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


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, API_SECRET_KEY, algorithms=[ALGORITHM])
    except ExpiredSignatureError:
        raise _unauthorized("Token expired")
    except JWTError:
        raise _unauthorized("Invalid credentials")

    id_users = payload.get("sub")
    if id_users is None:
        raise _unauthorized("Invalid credentials")

    with get_connection("ldr") as conn:
        row = conn.execute(
            text(
                "SELECT [idUsers], [Username], [FirstName], [LastName], [Email], [Phone], [ContainerDataPathRoot], [Created], [Updated]"
                "FROM [dbo].[Users] WHERE [idUsers] = :idUsers"
            ),
            {"idUsers": id_users},
        ).mappings().first()

    if row is None:
        raise _unauthorized("Invalid credentials")

    user = dict(row)
    user["idUsers"] = str(user["idUsers"])
    return user


@app.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends()):
    with get_connection("ldr") as conn:
        row = conn.execute(
            text(
                "SELECT [idUsers], [Username], [Password] "
                "FROM [dbo].[Users] WHERE [Username] = :Username"
            ),
            {"Username": form.username},
        ).mappings().first()

    if row is None or not pwd_context.verify(form.password, row["Password"]):
        raise _unauthorized("Wrong username or password")

    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": str(row["idUsers"]), "exp": expire},
        API_SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/user", response_model=dict)
def get_user(current_user:dict=Depends(get_current_user)):
    return {
        "id": current_user["idUsers"],
        "username": current_user["Username"],
        "firstName": current_user["FirstName"],
        "lastName": current_user["LastName"],
        "email": current_user["Email"],
        "phone": current_user["Phone"],
        "containerDataPathRoot": current_user["ContainerDataPathRoot"],
        "created": current_user["Created"],
        "updated": current_user["Updated"],
    }



@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user:User):
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
        with get_connection("ldr") as conn:
            conn.execute(
                text(
                    "INSERT INTO [dbo].[Users] "
                    "([idUsers], [Username], [Password], [FirstName], [LastName], [Email], [Phone]) "
                    "VALUES (:idUsers, :username, :password, :first_name, :last_name, :email, :phone)"
                ),
                {
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