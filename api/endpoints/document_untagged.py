from ._imports import *

@app.get("/document/untagged", response_model=List[DocumentView])
@catch("Failed to fetch untagged documents")
def get_untagged_documents(current_user:Users=Depends(get_current_user)) -> List[DocumentView]:
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[v_Document] AS d
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND NOT EXISTS (
                    SELECT NULL
                    FROM [usr].[DocumentTagLink] AS dtl
                    WHERE 1=1
                        AND d.[idUsers] = dtl.[idUsers]
                        AND d.[idDocument] = dtl.[idDocument]
                )
            ORDER BY [Updated] ASC
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )

    return [DocumentView(**doc) for doc in result]
