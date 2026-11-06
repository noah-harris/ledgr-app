from ._imports import *

@app.get("/statements", status_code=200, response_model=list[StatementSummaryView])
@catch("Failed to get statements")
def get_statements(idAccount:UUID, current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[v_StatementSummary]
            WHERE 1=1 
                AND [idUsers] = :idUsers
                AND [idAccount] = :idAccount
            ORDER BY [StatementDate] DESC
        """,
        database="ldr",
        parameters={"idUsers": current_user.idUsers, "idAccount": idAccount}
    )
    return [StatementSummaryView(**row) for row in result]