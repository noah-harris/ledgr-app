CREATE TABLE [usr].[Document] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idDocument] UNIQUEIDENTIFIER NOT NULL,
    [idFile] UNIQUEIDENTIFIER NOT NULL,
    [Description] NVARCHAR(4000) NULL,
    [hasFile] AS CAST(CASE WHEN [idFile] IS NOT NULL THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Document] PRIMARY KEY ([idUsers], [idDocument]),
    CONSTRAINT [UQ_Document_idFile] UNIQUE ([idUsers], [idFile], [hasFile]),
    CONSTRAINT [FK_Document_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_Document_File] FOREIGN KEY ([idUsers], [idFile], [hasFile]) REFERENCES [usr].[File]([idUsers], [idFile], [AllowDocument])
);