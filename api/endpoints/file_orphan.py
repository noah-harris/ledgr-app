from ._imports import *

@app.get("/file/orphan/statement")
@catch("Failed to get orphan file statements")
def get_orphan_file_statements(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
                AND [AllowStatementImage] = 1
                AND NOT EXISTS (
                    SELECT NULL
                    FROM [usr].[Statement] AS s
                    WHERE 1=1
                        AND s.[idUsers] = f.[idUsers]
                        AND s.[idImage] = f.[idFile]
                    )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]


@app.get("/file/orphan/document")
@catch("Failed to get orphan file documents")
def get_orphan_file_documents(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [AllowDocument] = 1
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
                AND NOT EXISTS (
                    SELECT NULL
                    FROM [usr].[Document] AS d
                    WHERE 1=1
                        AND d.[idUsers] = f.[idUsers]
                        AND d.[idFile] = f.[idFile]
                    )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]


@app.get("/file/orphan/transaction/invoice")
@catch("Failed to get orphan transaction invoice files")
def get_orphan_transaction_invoice_files(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [AllowTransactionInvoiceImage] = 1 AND [AllowTransactionReceiptImage] = 0
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
                AND NOT EXISTS (
                    SELECT NULL
                    FROM [usr].[Transaction] AS t
                    WHERE 1=1
                        AND t.[idUsers] = f.[idUsers]
                        AND t.[idImageInvoice] = f.[idFile]
                    )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]


@app.get("/file/orphan/transaction/receipt")
@catch("Failed to get orphan transaction receipt files")
def get_orphan_transaction_receipt_files(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [AllowTransactionInvoiceImage] = 0 AND [AllowTransactionReceiptImage] = 1
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
                AND NOT EXISTS (
                    SELECT NULL
                    FROM [usr].[Transaction] AS t
                    WHERE 1=1
                        AND t.[idUsers] = f.[idUsers]
                        AND t.[idImageReceipt] = f.[idFile]
                    )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]


@app.get("/file/orphan/transaction")
@catch("Failed to get orphan transaction files")
def get_orphan_transaction_invoice_files(current_user:Users=Depends(get_current_user)):

    resp = exec(
        statement="""
            SELECT *
            FROM [usr].[v_File] AS f
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [AllowTransactionInvoiceImage] = 1 AND [AllowTransactionReceiptImage] = 1
                AND f.[idFile] <> '00000000-0000-0000-0000-000000000000'
                AND (1=2
                    OR NOT EXISTS (
                        SELECT NULL
                        FROM [usr].[Transaction] AS t
                        WHERE 1=1
                            AND t.[idUsers] = f.[idUsers]
                            AND t.[idImageReceipt] = f.[idFile]
                            AND t.[idImageInvoice] = f.[idFile]
                    )
                    OR EXISTS (
                        SELECT NULL
                        FROM [usr].[Transaction] AS t
                        WHERE 1=1
                            AND t.[idUsers] = f.[idUsers]
                            AND (t.[idImageReceipt] = f.[idFile] OR t.[idImageInvoice] = f.[idFile])
                            AND NOT (t.[idImageReceipt] = f.[idFile] AND t.[idImageInvoice] = f.[idFile])
                    )
            )
        """,
        database="ldr",
        parameters={
            "idUsers": current_user.idUsers
        }
    )
    if not resp or len(resp) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")

    return [FileView(**file) for file in resp]

