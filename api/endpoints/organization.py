from ._imports import *

@app.get("/organizations", status_code=200, response_model=list[OrganizationView])
@catch("Failed to get organizations")
def get_organizations(current_user:Users=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT *
            FROM [usr].[v_Organization]
            WHERE [idUsers] = :idUsers
        """,
        database="ldr",
        parameters={"idUsers": current_user.idUsers}
    )
    organizations = [OrganizationView(**row) for row in res]
    return organizations


@app.get("/organization", status_code=200, response_model=OrganizationView)
@catch("Failed to get organization")
def get_organization(idOrganization:UUID, current_user:Users=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT *
            FROM [usr].[v_Organization]
            WHERE 1=1 
                AND [idUsers] = :idUsers
                AND [idOrganization] = :idOrganization
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers,
            "idOrganization": idOrganization
        }
    )
    organization = OrganizationView(**res[0]) if res else None
    return organization
