CREATE TABLE [usr].[FileListStatementImage] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idFile] UNIQUEIDENTIFIER NOT NULL,
    [isSupportedImageExtension] BIT NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_FileListStatementImage] PRIMARY KEY ([idUsers], [idFile]),
    CONSTRAINT [FK_FileListStatementImage_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_FileListStatementImage_File] FOREIGN KEY ([idUsers], [idFile]) REFERENCES [usr].[File]([idUsers], [idFile], [isSupportedImageExtension])
);