CREATE VIEW [usr].[v_File] 
    AS
SELECT 
    f.[idUsers],
    f.[idFile],
    f.[FileName],
    f.[FileExtension],
    f.[FullFileName],
    fe.[MimeType],
    f.[ServerFilePath],
    f.[ContainerFilePath],
    f.[DownloadEndpoint],
    f.[FileSizeBytes],
    f.[isSupportedImageExtension],
    f.[isJunk],
    f.[AllowStatementImage],
    f.[AllowAccountImage],
    f.[AllowTransactionInvoiceImage],
    f.[AllowTransactionReceiptImage],
    f.[AllowDocument],
    f.[isAllowedAll],
    f.[isAllowedAny],
    f.[Created],
    f.[Updated]
FROM [usr].[File] AS f
JOIN [dim].[FileExtension] AS fe ON f.[FileExtension] = fe.[FileExtension]