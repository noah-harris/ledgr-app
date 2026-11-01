from ._imports import *

@app.post("/user/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm=Depends()):
    rows = exec(
        statement="SELECT [idUsers], [Username], [Password] FROM [dbo].[Users] WHERE [Username] = :Username",
        database="ldr",
        parameters={"Username": form.username},
    )
    row = rows[0] if rows else None

    if row is None or not PWD_CONTEXT.verify(form.password, row["Password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong username or password", headers={"WWW-Authenticate": "Bearer"})

    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": str(row["idUsers"]), "exp": expire},
        API_SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return Token(access_token=access_token, token_type="bearer")
