from ._imports import *
from models import DocumentTag, DocumentView, DocumentTagLink

@app.get("/documents", status_code=200, response_model=list[DocumentView])
def get_documents(current_user:dict=Depends(get_current_user)):

    docs = exec(
        statement="SELECT * FROM [usr].[v_Document] WHERE [idUsers] = :idUsers", 
        database="ldr", 
        parameters={"idUsers": current_user["idUsers"]}
    )

    tags = exec(
        statement="SELECT * FROM [usr].[v_DocumentTagLink] WHERE [idUsers] = :idUsers", 
        database="ldr", 
        parameters={"idUsers": current_user["idUsers"]}
    )

    # Zip together
    result = []
    for doc in docs:
        doc_tags = [tag for tag in tags if tag["idDocument"] == doc["idDocument"]]
        result.append({**doc, "Tags": doc_tags})

    result = [DocumentView(**doc) for doc in result]
    return result


@app.get("/document/tags", status_code=200, response_model=list[DocumentTag])
@catch("Failed to get document tags")
def get_document_tags(current_user:dict=Depends(get_current_user)):
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
            "idUsers": current_user["idUsers"]
        }
    )


@app.get("/document/tags/used", status_code=200, response_model=list[DocumentTag])
@catch("Failed to get used document tags")
def get_used_document_tags(hasAttributeValue:bool=True, current_user:dict=Depends(get_current_user)):
    return exec(
        statement="""
            SELECT * 
            FROM [usr].[DocumentTag]
            WHERE 1=1 
                AND [idDocumentTag] IN (
                    SELECT [idDocumentTag]
                    FROM [usr].[v_DocumentTagLink]
                    WHERE 1=1
                        AND [idUsers] = :idUsers
                        AND [hasAttributeValue] = :hasAttributeValue
                )
        """, 
        database="ldr", 
        parameters={
            "idUsers": current_user["idUsers"],
            "hasAttributeValue": hasAttributeValue
        }
    )


@app.post("/document/tag", status_code=201)
@catch("Failed to create document tag")
def create_document_tag(documentTag:DocumentTag, current_user:dict=Depends(get_current_user)):
    exec(
        statement="""
            INSERT INTO [usr].[DocumentTag] ([idUsers], [idDocumentTag], [DocumentTagName], [hasAttributeValue])
            VALUES (:idUsers, :idDocumentTag, :DocumentTagName, :hasAttributeValue)
        """,
        database="ldr",
        parameters={
            "idUsers": current_user["idUsers"],
            "idDocumentTag": documentTag.idDocumentTag,
            "DocumentTagName": documentTag.DocumentTagName,
            "hasAttributeValue": documentTag.hasAttributeValue
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
            "idUsers": current_user["idUsers"]
        }
    )
    if not res:
        raise HTTPException(status_code=400, detail="Failed to create document tag")


@app.get("/document/tag", status_code=200, response_model=DocumentTag)
@catch("Failed to get document tag")
def get_document_tag(idDocumentTag:str, current_user:dict=Depends(get_current_user)):
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
            "idUsers": current_user["idUsers"]
        }
    )
    if res:
        return DocumentTag(**res[0])
    else:
        raise HTTPException(status_code=404, detail="Document tag not found")

    
@app.delete("/document/tag", status_code=204)
@catch("Failed to delete document tag")
def delete_document_tag(idDocumentTag:str, current_user:dict=Depends(get_current_user)):

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
            "idUsers": current_user["idUsers"]
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



@app.put("/document/tag/link", status_code=204)
@catch("Failed to add tag to document")
def add_tag_to_document(documentTagLink: DocumentTagLink, current_user:dict=Depends(get_current_user)):

    exec(
        statement="""
            INSERT INTO [usr].[DocumentTagLink] ([idUsers], [idDocument], [idDocumentTag], [Value])
            VALUES (:idUsers, :idDocument, :idDocumentTag, :Value)
        """,
        database="ldr",
        parameters={
            "idUsers": current_user["idUsers"],
            "idDocument": documentTagLink.idDocument,
            "idDocumentTag": documentTagLink.idDocumentTag,
            "Value": documentTagLink.Value
        }
    )

    # TODO: Verify that the tag was actually added to the document