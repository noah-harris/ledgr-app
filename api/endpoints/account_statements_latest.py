from ._imports import *

@app.get("/account/statements/latest", status_code=200, response_model=StatementView)
@catch("Failed to get latest account statement")
def get_latest_account_statement(idAccount:UUID, current_user:Users=Depends(get_current_user)):
    result = exec(
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
    
    if len(result) != 1:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Latest account statement not found")
    else:
        return StatementView(**result[0])