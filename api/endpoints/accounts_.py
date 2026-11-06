from ._imports import *

@app.get("/accounts", status_code=200, response_model=list[AccountView])
@catch("Failed to get accounts")
def get_accounts(current_user:Users=Depends(get_current_user)):
    result = exec (
        statement="""
            SELECT *
            FROM [usr].[v_Account]
            WHERE [idUsers] = :user_id
        """,
        database="ldr",
        parameters={"user_id": current_user.idUsers}
    )
    return [AccountView(**row) for row in result]
