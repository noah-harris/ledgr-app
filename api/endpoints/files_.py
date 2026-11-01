from ._imports import *

@app.get("/files")
@catch("Failed to get files")
def get_files(current_user:Users=Depends(get_current_user)):
    file_rows = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] 
            WHERE [idUsers] = :user_id
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user.idUsers
        }
    )
    if not file_rows or len(file_rows) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    
    return [FileView(**file) for file in file_rows]
