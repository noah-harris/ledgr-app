from ._imports import *

@app.get("/document", status_code=200, response_model=List[DocumentView])
@catch("Failed to get documents")
def get_documents(idDocument:UUID, current_user:Users=Depends(get_current_user)):

    document_result = exec(
        statement="""
            SELECT *
            FROM [usr].[v_Document]
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [idDocument] = :idDocument
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers,
            "idDocument": idDocument
        }
    )
    if len(document_result) != 1:
        raise HTTPException(status_code=404, detail="Document not found")
    
    

    tags = exec(
        statement="""
            SELECT *
            FROM [usr].[v_DocumentTagLink]
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [idDocument] = :idDocument
        """, 
        database="ldr", 
        parameters={
            "idUsers": current_user.idUsers, 
            "idDocument": idDocument
        }
    )

    return DocumentView(**{**document_result[0], "Tags": [DocumentTag(**tag) for tag in tags]})

