CREATE TABLE [usr].[Document] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idDocument] UNIQUEIDENTIFIER NOT NULL,
    [Description] NVARCHAR(4000) NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Document] PRIMARY KEY ([idUsers], [idDocument]),
    CONSTRAINT [FK_Document_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_Document_File] FOREIGN KEY ([idUsers], [idDocument]) REFERENCES [usr].[File]([idUsers], [idFile])
);