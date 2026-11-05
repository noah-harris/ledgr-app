from ._imports import *

@app.put("/file/allow")
def file_allow(entity:str, idFile:UUID, current_user:Users=Depends(get_current_user)):


    match entity:
        case "statement":
            column = "[AllowStatementImage]"
        case "document":
            column = "[AllowDocument]"
        case "invoice":
            column = "[AllowTransactionInvoiceImage]"
        case "receipt":
            column = "[AllowTransactionReceiptImage]"
        case "account":
            column = "[AllowAccountImage]"
        case "transaction":
            pass
        case _:
            raise HTTPException(status_code=400, detail="Invalid entity")

    if entity != "transaction":
        exec(
            statement=f"""
            UPDATE [usr].[File]
            SET {column} = 1
            WHERE 1=1 
                AND [idUsers] = :idUsers
                AND [idFile] = :idFile
            """,
            database="ldr",
            parameters={
                "idFile": idFile,
                "idUsers": current_user.idUsers,
            },
        )
    elif entity == "transaction":
        exec(
            statement=f"""
            UPDATE [usr].[File]
            SET [AllowTransactionInvoiceImage] = 1, 
                [AllowTransactionReceiptImage] = 1
            WHERE 1=1 
                AND [idUsers] = :idUsers
                AND [idFile] = :idFile
            """,
            database="ldr",
            parameters={
                "idFile": idFile,
                "idUsers": current_user.idUsers,
            },
        )