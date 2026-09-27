CREATE TABLE [usr].[FileListDocument] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idFile] UNIQUEIDENTIFIER NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_FileListDocument] PRIMARY KEY ([idUsers], [idFile]),
    CONSTRAINT [FK_FileListDocument_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_FileListDocument_File] FOREIGN KEY ([idUsers], [idFile]) REFERENCES [usr].[File]([idUsers], [idFile])
);