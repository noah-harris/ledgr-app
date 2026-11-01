from ._imports import *

##### CREATE

async def upload_file(file:UploadFile, user:Users, file_allowance:FileAllowance) -> bool:
    """
    Upload a file for the given user, ensuring no duplicates exist in the database or on disk.
    The file metadata is inserted into the database after successful disk write.
    Raises HTTPException on conflicts or errors.
    """

    # Ensure the destination directory exists
    file_destination:Path = Path(user.ContainerDataPathRoot) / "FILES" / file.filename
    file_destination.parent.mkdir(parents=True, exist_ok=True)
    file_status:bool = False

    def _file_exists_database(file:UploadFile) -> bool:
        """Check if the file already exists in the database for the given user"""
        result = exec(
            statement="SELECT 1 FROM [usr].[File] WHERE [idUsers] = :idUsers AND [FullFileName] = :filename",
            database="ldr",
            parameters={"filename": file.filename, "idUsers": user.idUsers}
        )
        return bool(result)

   
    def _image_exists_disk() -> bool:
        """ Check if the file already exists on disk for the given user """
        return file_destination.exists()


    # Check for duplicates in the database and on disk before writing the file
    if _file_exists_database(file) or _image_exists_disk():
        raise HTTPException(status.HTTP_409_CONFLICT, f"Conflict Error: An image named '{file.filename}' already exists.")

    # Write the file to disk
    data = await file.read()
    file_destination.write_bytes(data)

    # Verify that the file was successfully written to disk
    if not _image_exists_disk():
        file_destination.unlink(missing_ok=True)
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Disk Error: Failed to write file to disk {file.filename}")

    # Insert the file metadata into the database
    try:
        exec(
            statement="""
                INSERT INTO [usr].[File] ([idUsers], [idFile], [FileName], [FileExtension], [FileSizeBytes], [AllowStatementImage], [AllowAccountImage], [AllowTransactionInvoiceImage], [AllowTransactionReceiptImage], [AllowDocument])
                VALUES (:idUsers, :idFile, :FileName, :FileExtension, :FileSizeBytes, :AllowStatementImage, :AllowAccountImage, :AllowTransactionInvoiceImage, :AllowTransactionReceiptImage, :AllowDocument)
            """,
            database="ldr",
            parameters={
                "idUsers": user.idUsers,
                "idFile": uuid4(),
                "FileName": Path(file.filename).stem,
                "FileExtension": Path(file.filename).suffix.lstrip("."),
                "FileSizeBytes": len(data),

                "AllowStatementImage": file_allowance.AllowStatementImage,
                "AllowAccountImage": file_allowance.AllowAccountImage,
                "AllowTransactionInvoiceImage": file_allowance.AllowTransactionInvoiceImage,
                "AllowTransactionReceiptImage": file_allowance.AllowTransactionReceiptImage,
                "AllowDocument": file_allowance.AllowDocument
            }
        )
    except Exception as e:
        file_destination.unlink(missing_ok=True)
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Database Error: Failed to upload file {file.filename}")

    # Final verification: ensure the file metadata exists in the database
    if not _file_exists_database(file):
        file_destination.unlink(missing_ok=True)
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Database Error: Failed to upload file {file.filename}")

    return {"message": f"Success: File uploaded successfully"}


@app.post("/file/upload")
@catch("Failed to get file upload")
async def upload_file_endpoint(file:UploadFile, current_user:Users=Depends(get_current_user)):
    file_allowance=FileAllowance()
    return await upload_file(file, current_user, file_allowance)


@app.post("/file/upload/statement")
@catch("Failed to get file upload statement")
async def upload_statement_image_file(file:UploadFile, current_user:Users=Depends(get_current_user)):
    file_allowance=FileAllowance(AllowStatementImage=True, AllowDocument=True)
    return await upload_file(file, current_user, file_allowance)


@app.post("/file/upload/document")
@catch("Failed to get file upload document")
async def upload_document_file(file:UploadFile, current_user:Users=Depends(get_current_user)):
    file_allowance=FileAllowance(AllowDocument=True)
    return await upload_file(file, current_user, file_allowance)


@app.post("/file/upload/account")
@catch("Failed to get file upload account")
async def upload_account_image_file(file:UploadFile, current_user:Users=Depends(get_current_user)):
    file_allowance=FileAllowance(AllowAccountImage=True)
    return await upload_file(file, current_user, file_allowance)


@app.post("/file/upload/transaction")
@catch("Failed to get file upload transaction")
async def upload_transaction_image_file(file:UploadFile, current_user:Users=Depends(get_current_user)):
    file_allowance=FileAllowance(AllowTransactionInvoiceImage=True, AllowTransactionReceiptImage=True)
    return await upload_file(file, current_user, file_allowance)


@app.post("/file/upload/transaction/invoice")
@catch("Failed to get file upload transaction invoice")
async def upload_transaction_invoice_image_file(file:UploadFile, current_user:Users=Depends(get_current_user)):
    file_allowance=FileAllowance(AllowTransactionInvoiceImage=True)
    return await upload_file(file, current_user, file_allowance)


@app.post("/file/upload/transaction/receipt")
@catch("Failed to get file upload transaction receipt")
async def upload_transaction_receipt_image_file(file:UploadFile, current_user:Users=Depends(get_current_user)):
    file_allowance=FileAllowance(AllowTransactionReceiptImage=True)
    return await upload_file(file, current_user, file_allowance)

    

##### READ

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


@app.post("/file/export")
@catch("Error exporting files")
def export_files(idFiles: list[UUID], current_user: Users = Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File]
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

    files: list[FileView] = [FileView(**file) for file in res]

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



####################################################################################################
# CHECKS
####################################################################################################

@app.get("/file/statement/orphan")
@catch("Failed to get orphan file statements")
def get_orphan_file_statements(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
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
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]


@app.get("/file/document/orphan")
@catch("Failed to get orphan file documents")
def get_orphan_file_documents(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [AllowDocument] = 1
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
                AND NOT EXISTS (
                    SELECT NULL
                    FROM [usr].[Document] AS d
                    WHERE 1=1
                        AND d.[idUsers] = f.[idUsers]
                        AND d.[idFile] = f.[idFile]
                    )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]


@app.get("/file/transaction/invoice/orphan")
@catch("Failed to get orphan transaction invoice files")
def get_orphan_transaction_invoice_files(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [AllowTransactionInvoiceImage] = 1 AND [AllowTransactionReceiptImage] = 0
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
                AND NOT EXISTS (
                    SELECT NULL
                    FROM [usr].[Transaction] AS t
                    WHERE 1=1
                        AND t.[idUsers] = f.[idUsers]
                        AND t.[idImageInvoice] = f.[idFile]
                    )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]


@app.get("/file/transaction/receipt/orphan")
@catch("Failed to get orphan transaction receipt files")
def get_orphan_transaction_receipt_files(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [AllowTransactionInvoiceImage] = 0 AND [AllowTransactionReceiptImage] = 1
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
                AND NOT EXISTS (
                    SELECT NULL
                    FROM [usr].[Transaction] AS t
                    WHERE 1=1
                        AND t.[idUsers] = f.[idUsers]
                        AND t.[idImageReceipt] = f.[idFile]
                    )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]


@app.get("/file/transaction/orphan")
@catch("Failed to get orphan transaction invoice files")
def get_orphan_transaction_invoice_files(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [AllowTransactionInvoiceImage] = 1 AND [AllowTransactionReceiptImage] = 1
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
                AND (1=2
                    OR NOT EXISTS (
                        SELECT NULL
                        FROM [usr].[Transaction] AS t
                        WHERE 1=1
                            AND t.[idUsers] = f.[idUsers]
                            AND t.[idImageReceipt] = f.[idFile]
                            AND t.[idImageInvoice] = f.[idFile]
                    )
                    OR EXISTS (
                        SELECT NULL
                        FROM [usr].[Transaction] AS t
                        WHERE 1=1
                            AND t.[idUsers] = f.[idUsers]
                            AND (t.[idImageReceipt] = f.[idFile] OR t.[idImageInvoice] = f.[idFile])
                            AND NOT (t.[idImageReceipt] = f.[idFile] AND t.[idImageInvoice] = f.[idFile])
                    )
            )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]

