from ._imports import *

@app.get("/organization", status_code=200, response_model=OrganizationView)
@catch("Failed to get organization")
def get_organization(idOrganization:UUID, current_user:Users=Depends(get_current_user)):
    result = exec(
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

    if len(result) != 1:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Organization not found")
    else:
        return OrganizationView(**result[0])
