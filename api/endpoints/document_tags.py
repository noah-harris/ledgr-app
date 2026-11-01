from ._imports import *

@app.get("/document/tags", status_code=200, response_model=list[DocumentTag])
@catch("Failed to get document tags")
def get_document_tags(current_user:Users=Depends(get_current_user)):
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
            "idUsers": current_user.idUsers
        }
    )
