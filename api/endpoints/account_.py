from ._imports import *

@app.get("/account", status_code=200, response_model=AccountView)
@catch("Failed to get account")
def get_account(idAccount:UUID, current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[v_Account]
            WHERE 1=1 
                AND [idUsers] = :user_id
                AND [idAccount] = :idAccount
        """,
        database="ldr",
        parameters={
            "user_id": current_user.idUsers,
            "idAccount": idAccount
        }
    )
    
    if len(result) != 1:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Account not found")
    else:
        return AccountView(**result[0])
