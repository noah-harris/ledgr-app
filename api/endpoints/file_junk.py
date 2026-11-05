from ._imports import *

@app.put("/file/junk/toggle")
@catch("Failed to toggle junk status")
def toggle_junk_status(idFile:UUID, current_user:Users=Depends(get_current_user)):
    file_rows = exec(
        statement="""
        UPDATE [usr].[File]
        SET [isJunk] = CASE WHEN [isJunk] = 1 THEN 0 ELSE 1 END
        WHERE [idUsers] = :user_id AND [idFile] = :idFile
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user.idUsers,
            "idFile": idFile
        }
    )
    if not file_rows or len(file_rows) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    
    return file_rows
