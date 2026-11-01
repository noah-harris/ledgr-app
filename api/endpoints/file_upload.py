from ._imports import *


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
async def upload_file_endpoint(file:UploadFile, current_user:Users=Depends(get_current_user), filetype:str=""):

    match filetype:

        case "statement":
            file_allowance=FileAllowance(AllowStatementImage=True, AllowDocument=True)
        case "document":
            file_allowance=FileAllowance(AllowDocument=True)
        case "account":
            file_allowance=FileAllowance(AllowAccountImage=True)
        case "transaction":
            file_allowance=FileAllowance(AllowTransactionInvoiceImage=True, AllowTransactionReceiptImage=True)
        case "transaction/invoice":
            file_allowance=FileAllowance(AllowTransactionInvoiceImage=True)
        case "transaction/receipt":
            file_allowance=FileAllowance(AllowTransactionReceiptImage=True)
        case _:
            file_allowance=FileAllowance()


    return await upload_file(file, current_user, file_allowance)
