from ._imports import *

@app.get("/documents")
def get_documents(current_user:dict=Depends(get_current_user)):




    docs = exec(
        statement="""
        SELECT 
            [idDocument] AS [id],
            [idFile] AS [idFile],
            [FileName] AS [name],
            [FileExtension] AS [extension],
            [FileSizeBytes] AS [size],
            [DownloadEndpoint] AS [download],
            [isJunk] AS [isJunk],
            [Description] AS [description],
            [Created] AS [created],
            [Updated] AS [updated]
        FROM [usr].[v_Document]
        WHERE [idUsers] = :user_id
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user["idUsers"]
        }
    )


    tags = exec(
        statement="""
        SELECT 
            [idDocument] AS [id],
            [idFileTag] AS [idFileTag],
            [FileTagName] AS [name],
            [Value] AS [value],
            [isDefaultFileTag] AS [isDefaultFileTag],
            [Created] AS [created],
            [Updated] AS [updated]
        FROM [usr].[v_DocumentTag]
        WHERE [idUsers] = :user_id
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user["idUsers"]
        }
    )

    # Zip together
    result = []
    for doc in docs:
        doc_tags = [tag for tag in tags if tag["id"] == doc["id"]]
        result.append({**doc, "tags": doc_tags})

    return result
