from ._imports import *

@app.get("/statements", status_code=200, response_model=list[StatementView])
@catch("Failed to get statements")
def get_statements(current_user:dict=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT *
            FROM [usr].[v_Statement]
            WHERE [idUsers] = :idUsers
        """,
        database="ldr",
        parameters={"idUsers": current_user["idUsers"]}
    )
    statements = [StatementView(**row) for row in res]
    return statements