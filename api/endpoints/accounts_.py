from ._imports import *

@app.get("/accounts", status_code=200, response_model=list[AccountView])
@catch("Failed to get accounts")
def get_accounts(current_user:Users=Depends(get_current_user)):
    res = exec (
        statement="""
            SELECT *
            FROM [usr].[v_Account]
            WHERE 1=1
                AND [idUsers] = :user_id
        """,
        database="ldr",
        parameters={
            "user_id": current_user.idUsers
        }
    )
    accounts = [AccountView(**row) for row in res]
    return accounts
