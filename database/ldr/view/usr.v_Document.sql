CREATE VIEW [usr].[v_Document]
    AS
SELECT 
    d.[idUsers],
    d.[idFile],
    d.[idDocument],
    f.[FileName],
    f.[FileExtension],
    f.[FullFileName],
    f.[ServerFilePath],
    f.[ContainerFilePath],
    f.[DownloadEndpoint],
    f.[FileSizeBytes],
    f.[isSupportedImageExtension],
    f.[isJunk],
    d.[Description],
    d.[Created],
    d.[Updated]
FROM [usr].[Document] AS d 
JOIN [usr].[File] AS f 
ON 1=1 
    AND d.[idUsers] = f.[idUsers]
    AND d.[idFile] = f.[idFile]
