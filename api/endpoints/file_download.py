from ._imports import *

@app.get("/file/download", status_code=200, response_class=FileResponse)
@catch("Failed to download file")
def get_file_download(current_user:Users=Depends(get_current_user), idFile:UUID|None=None, filename:str|None=None):

    if not idFile and not filename:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Client Error: Either idFile or filename must be provided")

    try:
        if idFile:
            result = exec(
                statement="SELECT * FROM [usr].[v_File] WHERE [idUsers] = :idUsers AND [idFile] = :idFile",
                database="ldr",
                parameters={"idFile": idFile, "idUsers": current_user.idUsers}
            )
        else:
            result = exec(
                statement="SELECT * FROM [usr].[v_File] WHERE [idUsers] = :idUsers AND [FullFileName] = :filename",
                database="ldr",
                parameters={"filename": filename, "idUsers": current_user.idUsers}
            )
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Server Error: Failed to retrieve file")

    
    file_row = result[0] if result else None
    if not file_row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    file_object = FileView(**file_row)

    if not Path(file_object.ContainerFilePath).exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return FileResponse(
        path=Path(file_object.ContainerFilePath),
        status_code=200,
        filename=file_object.FullFileName,
        media_type=file_object.MimeType
    )