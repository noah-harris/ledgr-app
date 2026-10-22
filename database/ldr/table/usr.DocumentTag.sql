CREATE TABLE [usr].[DocumentTag] (
    [idUsers] UNIQUEIDENTIFIER NULL,
    [idDocumentTag] UNIQUEIDENTIFIER NOT NULL,
    [DocumentTagName] VARCHAR(200) NOT NULL,
    [hasAttributeValue] BIT NOT NULL DEFAULT 0,
    [isDefaultDocumentTag] AS CASE WHEN [idUsers] IS NULL THEN 1 ELSE 0 END PERSISTED,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),   
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_DocumentTag] PRIMARY KEY NONCLUSTERED ([idDocumentTag]),
    CONSTRAINT [FK_DocumentTag_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [UQ_DocumentTag_hasAttributeValue] UNIQUE ([idDocumentTag], [hasAttributeValue])
);