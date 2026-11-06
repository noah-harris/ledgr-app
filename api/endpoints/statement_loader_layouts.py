from ._imports import *

@app.get("/statement/loader/layouts", status_code=200, response_model=list[StatementLayout])
def get_statement_layouts(current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[StatementLayout]
            WHERE [idUsers] = :idUsers
            ORDER BY [LayoutName]
        """,
        database="ldr",
        parameters={"idUsers": current_user.idUsers}
    )
    return [StatementLayout(**row) for row in result]
