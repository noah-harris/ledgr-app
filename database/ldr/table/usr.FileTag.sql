CREATE TABLE [usr].[FileTag] (
    [idUsers] UNIQUEIDENTIFIER NULL,
    [idFileTag] UNIQUEIDENTIFIER NOT NULL,
    [FileTagName] VARCHAR(200) NOT NULL,
    [hasAttributeValue] BIT NOT NULL DEFAULT 0,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),   
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_FileTag] PRIMARY KEY NONCLUSTERED ([idFileTag]),
    CONSTRAINT [FK_FileTag_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [UQ_FileTag_hasAttributeValue] UNIQUE ([idFileTag], [hasAttributeValue])
);