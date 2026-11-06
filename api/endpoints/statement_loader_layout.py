from ._imports import *
from sqlalchemy import text


def read_layout(idStatementLayout:UUID, user:Users) -> dict:
    """ The layout row, plus the transforms it runs, in order. """
    parameters = {"idUsers": user.idUsers, "idStatementLayout": idStatementLayout}
    layout = exec(
        statement="""
            SELECT *
            FROM [usr].[StatementLayout]
            WHERE [idUsers] = :idUsers AND [idStatementLayout] = :idStatementLayout
        """,
        database="ldr",
        parameters=parameters
    )
    if len(layout) != 1:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No such layout")
    transforms = exec(
        statement="""
            SELECT *
            FROM [usr].[StatementLayoutTransform]
            WHERE [idUsers] = :idUsers AND [idStatementLayout] = :idStatementLayout
            ORDER BY [Position]
        """,
        database="ldr",
        parameters=parameters
    )
    return {"Layout": StatementLayout(**layout[0]), "Transforms": [StatementLayoutTransform(**row) for row in transforms]}


def save_layout(idStatementLayout:UUID|None, body:StatementLayoutBody, user:Users) -> dict:
    """ Insert when idStatementLayout is None, otherwise update. The row and its transform links change together. """
    name = body.LayoutName.strip()
    if not name:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Give the layout a name")

    id_layout = idStatementLayout or uuid4()
    parameters = {"idUsers": user.idUsers, "idStatementLayout": id_layout}
    values = {**parameters, "LayoutName": name, "Definition": json.dumps(body.Definition)}

    try:
        with get_connection("ldr") as conn:
            if idStatementLayout is None:
                conn.execute(text("""
                    INSERT INTO [usr].[StatementLayout] ([idUsers], [idStatementLayout], [LayoutName], [Definition])
                    VALUES (:idUsers, :idStatementLayout, :LayoutName, :Definition)
                """), values)
            else:
                updated = conn.execute(text("""
                    UPDATE [usr].[StatementLayout]
                    SET [LayoutName] = :LayoutName, [Definition] = :Definition
                    WHERE [idUsers] = :idUsers AND [idStatementLayout] = :idStatementLayout
                """), values)
                if updated.rowcount == 0:
                    raise HTTPException(status.HTTP_404_NOT_FOUND, "No such layout")

            conn.execute(text("""
                DELETE FROM [usr].[StatementLayoutTransform]
                WHERE [idUsers] = :idUsers AND [idStatementLayout] = :idStatementLayout
            """), parameters)

            known = conn.execute(
                text("SELECT [idStatementTransform] FROM [usr].[StatementTransform] WHERE [idUsers] = :idUsers"),
                parameters
            ).scalars().all()
            known = {str(t).upper() for t in known}
            for position, transform in enumerate(body.Transforms):
                if str(transform.idStatementTransform).upper() in known:
                    conn.execute(text("""
                        INSERT INTO [usr].[StatementLayoutTransform] ([idUsers], [idStatementLayout], [idStatementTransform], [Position], [isEnabled])
                        VALUES (:idUsers, :idStatementLayout, :idStatementTransform, :Position, :isEnabled)
                    """), {
                        **parameters,
                        "idStatementTransform": transform.idStatementTransform,
                        "Position": position,
                        "isEnabled": transform.isEnabled,
                    })
    except IntegrityError:
        raise HTTPException(status.HTTP_409_CONFLICT, f"A layout named “{name}” already exists")

    return read_layout(id_layout, user)


@app.get("/statement/loader/layout", status_code=200)
def get_statement_layout(idStatementLayout:UUID, current_user:Users=Depends(get_current_user)):
    return read_layout(idStatementLayout, current_user)


@app.post("/statement/loader/layout", status_code=201)
def create_statement_layout(body:StatementLayoutBody, current_user:Users=Depends(get_current_user)):
    return save_layout(None, body, current_user)


@app.put("/statement/loader/layout", status_code=200)
def update_statement_layout(idStatementLayout:UUID, body:StatementLayoutBody, current_user:Users=Depends(get_current_user)):
    return save_layout(idStatementLayout, body, current_user)


@app.delete("/statement/loader/layout", status_code=204)
def delete_statement_layout(idStatementLayout:UUID, current_user:Users=Depends(get_current_user)):
    read_layout(idStatementLayout, current_user)
    exec(
        statement="""
            DELETE FROM [usr].[StatementLayout]
            WHERE [idUsers] = :idUsers AND [idStatementLayout] = :idStatementLayout
        """,
        database="ldr",
        parameters={"idUsers": current_user.idUsers, "idStatementLayout": idStatementLayout}
    )
