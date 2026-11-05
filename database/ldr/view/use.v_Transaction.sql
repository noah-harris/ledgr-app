CREATE VIEW [usr].[v_Transaction]
    AS
SELECT 
    t.[idUsers],
    t.[idAccount],
    t.[idStatement],
    t.[idTransaction],
    t.[idTransactionGroup],
    t.[idTransactionParent],
    t.[idTransactionType],
    t.[idPayee],
    t.[idImageInvoice],
    t.[idImageReceipt],
    tt.[TransactionTypeName],
    tt.[Scope],
    tt.[Cashflow],
    tt.[requireTransactionItems],
    tt.[Sign],
    t.[TransactionDate],
    t.[PostDate],
    t.[InvoiceDate],
    t.[DueDate],
    t.[StartDate],
    t.[EndDate],
    t.[Amount],
    t.[StatementText],
    t.[isValidated],
    t.[isTransactionSplitChild],
    t.[hasInvoiceImage],
    t.[hasReceiptImage],
    t.[Created],
    t.[Updated]
FROM [usr].[Transaction] AS t
JOIN [enum].[TransactionType] AS tt ON t.[idTransactionType] = tt.[idTransactionType]
JOIN [usr].[Payee] AS p ON t.[idUsers] = p.[idUsers] AND t.[idPayee] = p.[idPayee]
LEFT JOIN [usr].[File] AS fi ON t.[idUsers] = fi.[idUsers] AND t.[idImageInvoice] = fi.[idFile]
LEFT JOIN [usr].[File] AS fr ON t.[idUsers] = fr.[idUsers] AND t.[idImageReceipt] = fr.[idFile]
