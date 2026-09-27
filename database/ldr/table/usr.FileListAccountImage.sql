CREATE TABLE [usr].[FileListAccountImage] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idFile] UNIQUEIDENTIFIER NOT NULL,
    [isSupportedImageExtension] BIT NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_FileListAccountImage] PRIMARY KEY ([idUsers], [idFile]),
    CONSTRAINT [FK_FileListAccountImage_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_FileListAccountImage_File] FOREIGN KEY ([idUsers], [idFile], [isSupportedImageExtension]) REFERENCES [usr].[File]([idUsers], [idFile], [isSupportedImageExtension]) ON UPDATE CASCADE
);