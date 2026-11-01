from ._imports import *

@app.get("/files/junk")
@catch("Failed to get junk files")
def get_junk_files(current_user:Users=Depends(get_current_user)):
    file_rows = exec(
        statement="""
            SELECT *
            FROM [usr].[File] 
            WHERE 1=1 
                AND [idUsers] = :user_id
                AND [IsJunk] = 1
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user.idUsers
        }
    )
    if not file_rows or len(file_rows) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    
    return file_rows
