CREATE TABLE [dim].[FileExtension] (
    [FileExtension] NVARCHAR(255) NOT NULL,
    [MimeType] NVARCHAR(255) NOT NULL,
    [isSupportedImageExtension] BIT NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_FileExtension] PRIMARY KEY ([FileExtension]),
    CONSTRAINT [CK_FileExtension_FileExtension] CHECK ([FileExtension] = LOWER([FileExtension]) AND LEFT([FileExtension], 1) <> '.'),
    CONSTRAINT [UQ_FileExtension_Image] UNIQUE ([FileExtension], [isSupportedImageExtension])
);