from ._imports import *

@app.get("/file", status_code=200)
@catch("Failed to get file")
def get_file(idFile:UUID, current_user:Users=Depends(get_current_user)):
    file_row = exec(
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

    if not file_row or len(file_row) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    
    file = file_row[0]
    return FileView(**file)


@app.delete("/file", status_code=200)
@catch("Failed to delete file")
def delete_file(idFile:str, current_user:Users=Depends(get_current_user)):
    file_row = exec(
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

    if not file_row or len(file_row) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    
    file = file_row[0]
    return file