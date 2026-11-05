from ._imports import *

@app.get("/file/noimage", status_code=200)
@catch("Failed to get no-image file")
def get_no_image_file(current_user:Users=Depends(get_current_user)):
    file_row = exec(
        statement=f"""
            SELECT *
            FROM [usr].[v_File] 
            WHERE [idUsers] = :idUsers AND [idFile] = '00000000-0000-0000-0000-000000000000'
        """, 
        database="ldr", 
        parameters={
            "idUsers": current_user.idUsers
        }
    )

    if not file_row or len(file_row) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    
    file = file_row[0]
    return FileView(**file)