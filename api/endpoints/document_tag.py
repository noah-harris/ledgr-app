from ._imports import *

@app.post("/document/tag", status_code=201)
@catch("Failed to create document tag")
def create_document_tag(documentTag:DocumentTag, current_user:Users=Depends(get_current_user)):
    try:
        exec(
            statement="""
                INSERT INTO [usr].[DocumentTag] ([idUsers], [idDocumentTag], [DocumentTagName])
                VALUES (:idUsers, :idDocumentTag, :DocumentTagName)
            """,
            database="ldr",
            parameters={
                "idUsers": current_user.idUsers,
                "idDocumentTag": documentTag.idDocumentTag,
                "DocumentTagName": documentTag.DocumentTagName,
            }
        )
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"{str(e)}")


@app.get("/document/tag", status_code=200, response_model=DocumentTag)
@catch("Failed to get document tag")
def get_document_tag(idDocumentTag:UUID, current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[DocumentTag]
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [idDocumentTag] = :idDocumentTag
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers,
            "idDocumentTag": idDocumentTag
        }
    )
    if len(result) != 1:
        raise HTTPException(status_code=404, detail="Document tag not found")
    else:
        return DocumentTag(**result[0])


@app.delete("/document/tag", status_code=204)
@catch("Failed to delete document tag")
def delete_document_tag(idDocumentTag:UUID, current_user:Users=Depends(get_current_user)):
    try:
        exec(
            statement="""
                DELETE FROM [usr].[DocumentTag]
                WHERE 1=1 
                    AND [idDocumentTag] = :idDocumentTag
                    AND [idUsers] = :idUsers
            """,
            database="ldr",
            parameters={
                "idDocumentTag": idDocumentTag,
                "idUsers": current_user.idUsers
            }
        )
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"{str(e)}")

