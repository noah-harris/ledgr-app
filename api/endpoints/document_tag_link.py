from ._imports import *

from .document_ import get_documents as get_document

@app.put("/document/tag/link", status_code=204)
@catch("Failed to add tag to document")
def add_tag_to_document(idDocument:UUID, idDocumentTag:UUID, current_user:Users=Depends(get_current_user)):

    exec(
        statement="""
            INSERT INTO [usr].[DocumentTagLink] ([idUsers], [idDocument], [idDocumentTag])
            VALUES (:idUsers, :idDocument, :idDocumentTag)
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers,
            "idDocument": idDocument,
            "idDocumentTag": idDocumentTag,
        }
    )


@app.delete("/document/tag/link", status_code=204)
@catch("Failed to remove tag from document")
def remove_tag_from_document(idDocument:UUID, idDocumentTag:UUID, current_user:Users=Depends(get_current_user)):

    exec(
        statement="""
            DELETE FROM [usr].[DocumentTagLink]
            WHERE 1=1 
                AND [idUsers] = :idUsers
                AND [idDocument] = :idDocument
                AND [idDocumentTag] = :idDocumentTag
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers,
            "idDocument": idDocument,
            "idDocumentTag": idDocumentTag,
        }
    )
