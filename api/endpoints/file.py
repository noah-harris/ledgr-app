from ._imports import *

######################### STANDARD CRUD #########################

##### CREATE

@app.post("/file/upload", status_code=200, description="Upload one or more images for the current user", response_description="Success message", response_model=dict)
@catch("Failed to upload image")
async def upload_image(files:list[UploadFile], current_user:Users=Depends(get_current_user)):

    def _check_file_exists_database(file:UploadFile) -> bool:
        result = exec(
            statement="SELECT 1 FROM [usr].[File] WHERE [idUsers] = :idUsers AND [FullFileName] = :filename",
            database="ldr",
            parameters={"filename": file.filename, "idUsers": current_user.idUsers}
        )
        return bool(result)

    def _check_image_exists_disk(file:UploadFile) -> bool:
        dest:Path = current_user.ContainerDataPathRoot / "FILES" / Path(file.filename)
        return dest.exists()
    

    for file in files:

        
        # Ensure the destination directory exists
        filename = Path(file.filename)
        dest:Path = current_user.ContainerDataPathRoot / "FILES" / Path(file.filename)
        dest.parent.mkdir(parents=True, exist_ok=True)

        # Check for duplicates in the database and on disk before writing the file
        if _check_file_exists_database(file) or _check_image_exists_disk(file):
            raise HTTPException(status.HTTP_409_CONFLICT, f"Conflict Error: An image named '{file.filename}' already exists.")

        # Write the file to disk
        data = await file.read()
        dest.write_bytes(data)

        # Verify that the file was successfully written to disk
        if not _check_image_exists_disk(file):
            dest.unlink(missing_ok=True)
            raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Disk Error: Failed to write image to disk {file.filename}")

        # Insert the file metadata into the database
        try:
            exec(
                statement="""
                    INSERT INTO [usr].[File] ([idUsers], [idFile], [FileName], [FileExtension], [FileSizeBytes])
                    VALUES (:idUsers, :idFile, :FileName, :FileExtension, :FileSizeBytes)
                """,
                database="ldr",
                parameters={
                    "idUsers": current_user.idUsers,
                    "idFile": uuid4(),
                    "FileName": filename.stem,
                    "FileExtension": filename.suffix.lstrip("."),
                    "FileSizeBytes": len(data)
                }
            )
        except Exception as e:
            dest.unlink(missing_ok=True)
            raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Database Error: Failed to upload image {file.filename}")

        # Final verification: ensure the file metadata exists in the database
        if not _check_file_exists_database(file):
            dest.unlink(missing_ok=True)
            raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Database Error: Failed to upload image {file.filename}")
        
    return JSONResponse(status_code=200, content={"message": "Images uploaded successfully"})

##### READ

@app.get("/file", status_code=200)
@catch("Failed to get file")
def get_file(idFile:str, current_user:Users=Depends(get_current_user)):
    file_row = exec(
        statement=f"""
            SELECT *
            FROM [usr].[File] 
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


@app.get("/files")
@catch("Failed to get files")
def get_files(current_user:Users=Depends(get_current_user)):
    file_rows = exec(
        statement="""
            SELECT *
            FROM [usr].[File] 
            WHERE [idUsers] = :user_id
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user.idUsers
        }
    )
    if not file_rows or len(file_rows) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    
    return file_rows


@app.get("/file/download", status_code=200, response_class=FileResponse)
@catch("Failed to download file")
def get_file_download(current_user:Users=Depends(get_current_user), idFile:str|None=None, filename:str|None=None):

    if not idFile and not filename:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Client Error: Either idFile or filename must be provided")

    try:
        if idFile:
            result = exec(
                statement="SELECT * FROM [usr].[File] WHERE [idUsers] = :idUsers AND [idFile] = :idFile",
                database="ldr",
                parameters={"idFile": idFile, "idUsers": current_user.idUsers}
            )
        else:
            result = exec(
                statement="SELECT * FROM [usr].[File] WHERE [idUsers] = :idUsers AND [FullFileName] = :filename",
                database="ldr",
                parameters={"filename": filename, "idUsers": current_user.idUsers}
            )
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Server Error: Failed to retrieve file")
    
    file_row = result[0] if result else None
    if not file_row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    container_file_path = file_row.get("ContainerFilePath", None)

    if container_file_path is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Server Error")
    
    container_file_path = Path(container_file_path)
    if not container_file_path.exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    mimetype = guess_type(file_row["FullFileName"])[0] or "application/octet-stream"

    return FileResponse(
        path=container_file_path,
        status_code=200,
        filename=file_row["FullFileName"],
        media_type=mimetype
    )


@app.post("/file/export")
@catch("Error exporting files")
def export_files(idFiles: list[UUID], current_user: Users = Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT *
            FROM [usr].[File]
            WHERE [idUsers] = :idUsers
            AND [idFile] IN (SELECT CAST([value] AS UNIQUEIDENTIFIER) FROM OPENJSON(:idFiles))
        """,
        database="ldr",
        parameters={
            "idFiles": json.dumps(idFiles, default=str),
            "idUsers": current_user.idUsers,
        },
    )
    if not res:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No files found")

    files: list[File] = [File(**file) for file in res]

    temp_path = Path(mkdtemp())
    zip_path = temp_path / f"ledgr-export-{len(files)}-files-{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.zip"

    with ZipFile(zip_path, "w") as zipf:
        for file in files:
            zipf.write(file.ContainerFilePath, arcname=file.FullFileName)

    return FileResponse(
        zip_path,
        media_type="application/zip",
        filename=zip_path.name,
        background=BackgroundTask(rmtree, temp_path, ignore_errors=True),
    )

# @app.post("/file/export")
# @catch("Error exporting files")
# def get_user_file_tags(idFiles:list[UUID], current_user:Users=Depends(get_current_user)):
#     res = exec(
#         statement="""
#             SELECT *
#             FROM [usr].[File]
#             WHERE [idUsers] = :idUsers
#             AND [idFile] IN (SELECT CAST([value] AS UNIQUEIDENTIFIER) FROM OPENJSON(:idFiles))
#         """,
#         database="ldr",
#         parameters={
#             "idFiles": json.dumps(idFiles, default=str),
#             "idUsers": current_user.idUsers,
#         },
#     )

#     files:list[File] = [File(**file) for file in res]
#     # Collect and zip the files for export
#     temp_dir = TemporaryDirectory()
#     temp_path = Path(temp_dir.name)

#     for file in files:
#         dest_path = temp_path / file.FullFileName
#         dest_path.write_bytes(Path(file.ContainerFilePath).read_bytes())
    
#     # Create a zip file containing all the exported files
#     zip_path = temp_path / f"ledgr-export-{len(files)}-files-{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.zip"
#     with ZipFile(zip_path, "w") as zipf:
#         for file in files:
#             zipf.write(temp_path / file.FullFileName, arcname=file.FullFileName)

#     return FileResponse(
#         zip_path,
#         media_type="application/zip",
#         filename=zip_path.name,
#         background=BackgroundTask(rmtree, temp_path, ignore_errors=True),
#     )

##### DELETE

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


@app.post("/file/edit/allow/all")
@catch("")
def get_file_tags(idFile:str, current_user:Users=Depends(get_current_user)):
    return exec(
        statement="""
            SELECT *
            FROM [usr].[DocumentTag] 
            WHERE 1=2 
                OR [idUsers] = :idUsers 
                OR [isDefaultDocumentTag] = 1
        """, 
        database="ldr", 
        parameters={
            "idUsers": current_user.idUsers
        }
    )


