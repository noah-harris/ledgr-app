from ._imports import *

@app.get("/documents", status_code=200, response_model=list[DocumentView])
@catch("Failed to get documents")
def get_documents(current_user:Users=Depends(get_current_user)):

    docs = exec(
        statement="SELECT * FROM [usr].[v_Document] WHERE [idUsers] = :idUsers", 
        database="ldr", 
        parameters={"idUsers": current_user.idUsers}
    )

    tags = exec(
        statement="SELECT * FROM [usr].[v_DocumentTagLink] WHERE [idUsers] = :idUsers", 
        database="ldr", 
        parameters={"idUsers": current_user.idUsers}
    )

    # Zip together
    result = []
    for doc in docs:
        doc_tags = [tag for tag in tags if tag["idDocument"] == doc["idDocument"]]
        result.append({**doc, "Tags": doc_tags})

    result = [DocumentView(**doc) for doc in result]
    return result