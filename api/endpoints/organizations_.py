from ._imports import *

@app.get("/organizations", status_code=200, response_model=list[OrganizationView])
@catch("Failed to get organizations")
def get_organizations(current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[v_Organization]
            WHERE [idUsers] = :idUsers
        """,
        database="ldr",
        parameters={"idUsers": current_user.idUsers}
    )
    return [OrganizationView(**row) for row in result]
