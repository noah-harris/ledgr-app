from ._imports import *

@app.get("/statement/unentered/files", status_code=200, response_model=list[FileView])
@catch("Failed to get statement unentered files")
def get_statement_unentered_files(current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT * 
            FROM usr.[v_File] AS f 
            WHERE 1=1 
                AND f.[idUsers] = :idUsers
                AND [AllowStatementImage] = 1 
                AND NOT EXISTS (
                    SELECT NULL 
                    FROM [usr].[Statement] AS s 
                    WHERE 1=1 
                        AND s.[idUsers] = f.[idUsers] 
                        AND s.[idImage] = f.[idFile]
                    )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    return [FileView(**row) for row in result]
