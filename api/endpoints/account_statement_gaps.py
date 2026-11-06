from ._imports import *

@app.get("/account/statement/gaps")
@catch("Failed to get account statement gaps")
def account_statement_gaps(idAccount: UUID, current_user:Users=Depends(get_current_user)):
    result = exec (
        statement="""
            SELECT *
            FROM usr.[v_StatementGap]
            WHERE 1=1 
                AND [idUsers] = :idUsers
                AND [idAccount] = :idAccount
            ORDER BY [idAccount], [GapStartDate]
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers,
            "idAccount": idAccount
        }
    )
    return [StatementGapView(**row) for row in result]


