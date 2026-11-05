from ._imports import *

@app.put("/file/allow")
def file_allow(entity:str, idFile:UUID, current_user:Users=Depends(get_current_user)):

    def get_args(cols):
        return {
            "statement": f"""
                UPDATE [usr].[File]
                SET {cols}
                WHERE 1=1 
                    AND [idUsers] = :idUsers
                    AND [idFile] = :idFile
                """, 
            "database": "ldr",
            "parameters": {"idFile": idFile, "idUsers": current_user.idUsers}
        }

    match entity:
        case "statement":
            exec(**get_args("[AllowStatementImage] = 1, [AllowDocument] = 1"))
            exec(
                statement="""
                    INSERT INTO [usr].[Document] ([idUsers], [idDocument], [idFile])
                    VALUES (:idUsers, :idDocument, :idFile)
                """,
                database="ldr",
                parameters={
                    "idUsers": current_user.idUsers, 
                    "idDocument": uuid4(), 
                    "idFile": idFile}
            )
            
        case "document":
            exec(**get_args("[AllowDocument] = 1"))
            exec(
                statement="""
                    INSERT INTO [usr].[Document] ([idUsers], [idDocument], [idFile])
                    VALUES (:idUsers, :idDocument, :idFile)
                """,
                database="ldr",
                parameters={
                    "idUsers": current_user.idUsers, 
                    "idDocument": uuid4(), 
                    "idFile": idFile}
            )

        case "invoice":
            exec(**get_args("[AllowTransactionInvoiceImage] = 1"))

        case "receipt":
            exec(**get_args("[AllowTransactionReceiptImage] = 1"))

        case "account":
            exec(**get_args("[AllowAccountImage] = 1"))

        case "transaction":
            exec(**get_args("[AllowTransactionInvoiceImage] = 1, [AllowTransactionReceiptImage] = 1"))

        case _:
            raise HTTPException(status_code=400, detail="Invalid entity")

    
