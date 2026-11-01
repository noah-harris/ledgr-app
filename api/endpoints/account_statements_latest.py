from ._imports import *

@app.get("/account/statements/latest", status_code=200, response_model=StatementView)
@catch("Failed to get latest account statement")
def get_latest_account_statement(idAccount:str, current_user:Users=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT TOP 1 *
            FROM [usr].[v_Statement]
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [idAccount] = :idAccount
            ORDER BY [EndDate] DESC
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers,
            "idAccount": idAccount
        }
    )
    if not res or len(res) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    statement = StatementView(**res[0])
    return statement