from ._imports import *

@app.get("/file/junk")
@catch("Failed to toggle junk status")
def get_junk_files(current_user:Users=Depends(get_current_user)):
    file_rows = exec(
        statement="""
        SELECT *
        FROM [usr].[v_File]
        WHERE 1=1 
            AND [idUsers] = :user_id 
            AND [isJunk] = 1
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user.idUsers
        }
    )
    return [FileView(**file) for file in file_rows]


@app.put("/file/junk")
@catch("Failed to toggle junk status")
def toggle_junk_status(idFile:UUID, current_user:Users=Depends(get_current_user), isJunk:bool=False):
    exec(
        statement="""
        UPDATE [usr].[File]
        SET [isJunk] = :isJunk
        WHERE [idUsers] = :user_id AND [idFile] = :idFile
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user.idUsers,
            "idFile": idFile,
            "isJunk": isJunk
        }
    )

