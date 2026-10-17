CREATE TABLE [usr].[FileTag] (
    [idUsers] UNIQUEIDENTIFIER NULL,
    [idFileTag] UNIQUEIDENTIFIER NOT NULL,
    [FileTagName] VARCHAR(200) NOT NULL,
    [hasAttributeValue] BIT NOT NULL DEFAULT 0,
    [isDefaultFileTag] AS CASE WHEN [idUsers] IS NULL THEN 1 ELSE 0 END PERSISTED,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),   
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_FileTag] PRIMARY KEY NONCLUSTERED ([idFileTag]),
    CONSTRAINT [FK_FileTag_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [UQ_FileTag_hasAttributeValue] UNIQUE ([idFileTag], [hasAttributeValue])
);