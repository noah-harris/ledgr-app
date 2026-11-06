from ._imports import *

@app.get("/file", status_code=200, response_model=FileView)
@catch("Failed to get file")
def get_file(idFile:UUID, current_user:Users=Depends(get_current_user)):
    result = exec(
        statement=f"""
            SELECT *
            FROM [usr].[v_File] 
            WHERE 1=1 
                AND [idUsers] = :idUsers
                AND [idFile] = :idFile
        """, 
        database="ldr", 
        parameters={
            "idUsers": current_user.idUsers,
            "idFile": idFile
        }
    )

    if len(result) != 1:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"File not found")
    else:
        return FileView(**result[0])


@app.delete("/file", status_code=200)
@catch("Failed to delete file")
def delete_file(idFile:UUID, current_user:Users=Depends(get_current_user)):
    try:
        exec(
            statement=f"""
                DELETE FROM [usr].[File] 
                WHERE 1=1 
                    AND [idUsers] = :idUsers
                    AND [idFile] = :idFile
            """, 
            database="ldr", 
            parameters={
                "idUsers": current_user.idUsers,
                "idFile": idFile
            }
        )
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"{str(e)}")