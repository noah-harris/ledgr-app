CREATE TABLE [usr].[DocumentTagLink] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idDocument] UNIQUEIDENTIFIER NOT NULL,
    [idDocumentTag] UNIQUEIDENTIFIER NOT NULL,
    [Value] NVARCHAR(200) NULL,
    [hasAttributeValue] AS CAST(CASE WHEN [Value] IS NOT NULL THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),   
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_DocumentTagLink] PRIMARY KEY ([idUsers], [idDocument], [idDocumentTag]),
    CONSTRAINT [FK_DocumentTagLink_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_DocumentTagLink_Document] FOREIGN KEY ([idUsers], [idDocument]) REFERENCES [usr].[Document]([idUsers], [idDocument]),
    CONSTRAINT [FK_DocumentTagLink_DocumentTag] FOREIGN KEY ([idDocumentTag]) REFERENCES [usr].[DocumentTag]([idDocumentTag]),
    CONSTRAINT [FK_DocumentTagLink_DocumentTag_HasAttributeValue] FOREIGN KEY ([idDocumentTag], [hasAttributeValue]) REFERENCES [usr].[DocumentTag]([idDocumentTag], [hasAttributeValue])
);
