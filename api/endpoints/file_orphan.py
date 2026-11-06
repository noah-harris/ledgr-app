from ._imports import *

@app.get("/file/orphan", response_model=List[FileView])
@catch("Failed to get orphan files")
def get_orphan_files(current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [isAllowedAny] = 0
                AND [isJunk] = 0
                AND [idFile] <> '00000000-0000-0000-0000-000000000000'
            ORDER BY f.[Updated] ASC
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    return [FileView(**file) for file in result]
