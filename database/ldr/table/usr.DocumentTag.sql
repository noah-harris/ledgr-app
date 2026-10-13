CREATE TABLE [usr].[DocumentTag] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idDocument] UNIQUEIDENTIFIER NOT NULL,
    [idFileTag] UNIQUEIDENTIFIER NOT NULL,
    [Value] NVARCHAR(200) NULL,
    [hasAttributeValue] AS CAST(CASE WHEN [Value] IS NOT NULL THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),   
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_DocumentTag] PRIMARY KEY ([idUsers], [idDocument], [idFileTag]),
    CONSTRAINT [FK_DocumentTag_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_DocumentTag_Document] FOREIGN KEY ([idUsers], [idDocument]) REFERENCES [usr].[Document]([idUsers], [idDocument]),
    CONSTRAINT [FK_DocumentTag_FileTag] FOREIGN KEY ([idFileTag]) REFERENCES [usr].[FileTag]([idFileTag]),
    CONSTRAINT [FK_DocumentTag_BudgetTag] FOREIGN KEY ([idFileTag], [hasAttributeValue]) REFERENCES [usr].[FileTag]([idFileTag], [hasAttributeValue])
);
