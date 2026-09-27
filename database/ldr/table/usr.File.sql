CREATE TABLE [usr].[File] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idFile] UNIQUEIDENTIFIER NOT NULL,
    [FileName] NVARCHAR(850) NOT NULL,
    [FileExtension] NVARCHAR(255) NOT NULL,
    [FullFileName] AS ([FileName] + '.' + [FileExtension]) PERSISTED,
    [FileSizeBytes] BIGINT NULL,
    [isSupportedImageExtension] BIT NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_File] PRIMARY KEY ([idUsers], [idFile]),
    CONSTRAINT [FK_File_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_File_FileExtension] FOREIGN KEY ([FileExtension], [isSupportedImageExtension]) REFERENCES [dim].[FileExtension]([FileExtension], [isSupportedImageExtension]) ON UPDATE CASCADE,
    CONSTRAINT [UQ_File_Image] UNIQUE ([idUsers], [idFile], [isSupportedImageExtension])
);