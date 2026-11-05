from ._imports import *

@app.get("/statements", status_code=200, response_model=list[StatementView])
@catch("Failed to get statements")
def get_statements(idAccount:UUID, current_user:Users=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT *
            FROM [usr].[v_Statement]
            WHERE 1=1 
                AND [idUsers] = :idUsers
                AND [idAccount] = :idAccount
        """,
        database="ldr",
        parameters={"idUsers": current_user.idUsers, "idAccount": idAccount}
    )
    statements = [StatementView(**row) for row in res]
    return statements