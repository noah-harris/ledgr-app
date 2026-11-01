from ._imports import *

@app.post("/document/tag", status_code=201)
@catch("Failed to create document tag")
def create_document_tag(documentTag:DocumentTag, current_user:Users=Depends(get_current_user)):
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

    # Check if the document tag was actually created
    res = exec(
        statement="""
            SELECT * FROM [usr].[DocumentTag]
            WHERE 1=1 
                AND [DocumentTagName] = :DocumentTagName
                AND [idUsers] = :idUsers
        """,
        database="ldr",
        parameters={
            "DocumentTagName": documentTag.DocumentTagName,
            "idUsers": current_user.idUsers
        }
    )
    if not res:
        raise HTTPException(status_code=400, detail="Failed to create document tag")


@app.get("/document/tag", status_code=200, response_model=DocumentTag)
@catch("Failed to get document tag")
def get_document_tag(idDocumentTag:UUID, current_user:Users=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT *
            FROM [usr].[DocumentTag]
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
    if res:
        return DocumentTag(**res[0])
    else:
        raise HTTPException(status_code=404, detail="Document tag not found")


@app.delete("/document/tag", status_code=204)
@catch("Failed to delete document tag")
def delete_document_tag(idDocumentTag:UUID, current_user:Users=Depends(get_current_user)):

    ## TODO: Add any necessary pre-deletion checks or logging here ##
    ## So what needs to happen is this needs to tell the user why it cant be removed.
    ## like linked documents or other dependencies that prevent deletion.

    get_document_tag(idDocumentTag=idDocumentTag, current_user=current_user)

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

    # Check if the document tag was actually deleted
    try:
        doc = get_document_tag(idDocumentTag=idDocumentTag, current_user=current_user)
    except HTTPException as e:
        if e.status_code == 404:
            return
    else:
        raise HTTPException(status_code=400, detail="Failed to delete document tag")
