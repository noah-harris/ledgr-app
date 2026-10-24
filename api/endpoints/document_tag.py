from ._imports import *

@app.get("/document/tags")
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


@app.get("/document/tags/used")
@catch("Failed to get used document tags")
def get_used_document_tags(hasAttributeValue:bool=True, current_user:dict=Depends(get_current_user)):
    return exec(
        statement="""
            SELECT DISTINCT 
                [idDocumentTag],
                [DocumentTagName]
            FROM [usr].[v_DocumentTagLink] 
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [hasAttributeValue] = :hasAttributeValue
        """, 
        database="ldr", 
        parameters={
            "idUsers": current_user["idUsers"],
            "hasAttributeValue": hasAttributeValue
        }
    )

