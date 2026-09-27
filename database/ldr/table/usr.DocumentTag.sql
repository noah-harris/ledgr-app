CREATE TABLE [usr].[DocumentTag] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idDocument] UNIQUEIDENTIFIER NOT NULL,
    [idDocumentTagType] UNIQUEIDENTIFIER NOT NULL,
    [Value] NVARCHAR(200) NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),   
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_DocumentTag] PRIMARY KEY ([idUsers], [idDocument], [idDocumentTagType]),
    CONSTRAINT [FK_DocumentTag_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_DocumentTag_Document] FOREIGN KEY ([idUsers], [idDocument]) REFERENCES [usr].[Document]([idUsers], [idDocument]),
    CONSTRAINT [FK_DocumentTag_DocumentTagType] FOREIGN KEY ([idDocumentTagType]) REFERENCES [usr].[DocumentTagType]([idUsers], [idDocumentTagType])
);
