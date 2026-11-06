from ._imports import *

@app.get("/statement/loader/transforms", status_code=200, response_model=list[StatementTransform])
def get_statement_transforms(current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[StatementTransform]
            WHERE [idUsers] = :idUsers
            ORDER BY [TransformName]
        """,
        database="ldr",
        parameters={"idUsers": current_user.idUsers}
    )
    return [StatementTransform(**row) for row in result]
