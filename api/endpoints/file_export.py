from ._imports import *

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
        background=BackgroundTask(shutil.rmtree, temp_path, ignore_errors=True),
    )
