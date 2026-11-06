from ._imports import *


def read_transform(idStatementTransform:UUID, user:Users) -> StatementTransform:
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[StatementTransform]
            WHERE [idUsers] = :idUsers AND [idStatementTransform] = :idStatementTransform
        """,
        database="ldr",
        parameters={"idUsers": user.idUsers, "idStatementTransform": idStatementTransform}
    )
    if len(result) != 1:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No such transform")
    return StatementTransform(**result[0])


@app.post("/statement/loader/transform", status_code=201, response_model=StatementTransform)
def create_statement_transform(body:StatementTransformBody, current_user:Users=Depends(get_current_user)):
    idStatementTransform = uuid4()
    exec(
        statement="""
            INSERT INTO [usr].[StatementTransform] ([idUsers], [idStatementTransform], [TransformName], [TargetColumn], [Code])
            VALUES (:idUsers, :idStatementTransform, :TransformName, :TargetColumn, :Code)
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers,
            "idStatementTransform": idStatementTransform,
            "TransformName": body.TransformName.strip() or "Untitled",
            "TargetColumn": body.TargetColumn,
            "Code": body.Code,
        }
    )
    return read_transform(idStatementTransform, current_user)


@app.put("/statement/loader/transform", status_code=200, response_model=StatementTransform)
def update_statement_transform(idStatementTransform:UUID, body:StatementTransformBody, current_user:Users=Depends(get_current_user)):
    exec(
        statement="""
            UPDATE [usr].[StatementTransform]
            SET [TransformName] = :TransformName, [TargetColumn] = :TargetColumn, [Code] = :Code
            WHERE [idUsers] = :idUsers AND [idStatementTransform] = :idStatementTransform
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers,
            "idStatementTransform": idStatementTransform,
            "TransformName": body.TransformName.strip() or "Untitled",
            "TargetColumn": body.TargetColumn,
            "Code": body.Code,
        }
    )
    return read_transform(idStatementTransform, current_user)


@app.delete("/statement/loader/transform", status_code=204)
def delete_statement_transform(idStatementTransform:UUID, current_user:Users=Depends(get_current_user)):
    read_transform(idStatementTransform, current_user)
    exec(
        statement="""
            DELETE FROM [usr].[StatementTransform]
            WHERE [idUsers] = :idUsers AND [idStatementTransform] = :idStatementTransform
        """,
        database="ldr",
        parameters={"idUsers": current_user.idUsers, "idStatementTransform": idStatementTransform}
    )
