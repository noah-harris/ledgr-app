from ._imports import *
USER_DATA_ROOT = Path("/app/data")
USER_SUBFOLDERS = ("FILES", "EMAIL_ATTACHMENTS")


@app.post("/user/register", status_code=status.HTTP_201_CREATED)
def register(user:Users):
    HashedPassword = PWD_CONTEXT.hash(user.Password)
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
        exec(
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

