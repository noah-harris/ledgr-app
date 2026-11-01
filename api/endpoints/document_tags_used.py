from ._imports import *

@app.get("/document/tags/used", status_code=200, response_model=list[DocumentTag])
@catch("Failed to get used document tags")
def get_used_document_tags(current_user:Users=Depends(get_current_user)):
    return exec(
        statement="""
            SELECT * 
            FROM [usr].[DocumentTag]
            WHERE 1=1 
                AND [idDocumentTag] IN (
                    SELECT [idDocumentTag]
                    FROM [usr].[v_DocumentTagLink]
                    WHERE [idUsers] = :idUsers
                )
        """, 
        database="ldr", 
        parameters={"idUsers": current_user.idUsers}
    )