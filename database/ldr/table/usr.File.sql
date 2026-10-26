CREATE TABLE [usr].[File] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idFile] UNIQUEIDENTIFIER NOT NULL,
    [FileName] NVARCHAR(850) NOT NULL,
    [FileExtension] NVARCHAR(255) NOT NULL,
    [FullFileName] AS CAST([FileName] + '.' + [FileExtension] AS NVARCHAR(1105)) PERSISTED,
	[ServerFilePath] AS CAST('D:\Repositories\!APPDATA\ledgr-app\' + CAST([idUsers] AS CHAR(36)) + '\FILES\' + [FileName] + '.' + [FileExtension] AS NVARCHAR(1184)) PERSISTED,
	[ContainerFilePath] AS CAST('/app/data/' + CAST([idUsers] AS CHAR(36)) + '/FILES/' + [FileName] + '.' + [FileExtension] AS NVARCHAR(1159)) PERSISTED,
    [DownloadEndpoint] AS CAST('/file/download?idFile=' + CAST([idFile] AS CHAR(36)) AS NVARCHAR(58)) PERSISTED,
    [FileSizeBytes] BIGINT NULL,
    [isSupportedImageExtension] AS CAST([dbo].[f_Check_isSupportedImageExtension]([FileExtension]) AS BIT),
    [isJunk] BIT NOT NULL DEFAULT 0,
    [AllowStatementImage] BIT NOT NULL DEFAULT 0,
    [AllowAccountImage] BIT NOT NULL DEFAULT 0,
    [AllowTransactionInvoiceImage] BIT NOT NULL DEFAULT 0,
    [AllowTransactionReceiptImage] BIT NOT NULL DEFAULT 0,
    [AllowDocument] BIT NOT NULL DEFAULT 0,

    [isAllowedAll] AS CAST(
        CASE 
            WHEN 1=1 
                AND [AllowStatementImage] = 0 
                AND [AllowAccountImage] = 0 
                AND [AllowTransactionInvoiceImage] = 0 
                AND [AllowTransactionReceiptImage] = 0 
                AND [AllowDocument] = 0 
                THEN 0
            ELSE 1 
        END AS BIT
    ) PERSISTED,

    [isAllowedAny] AS CAST(
        CASE 
            WHEN 1=2
                OR [AllowStatementImage] = 1
                OR [AllowAccountImage] = 1
                OR [AllowTransactionInvoiceImage] = 1
                OR [AllowTransactionReceiptImage] = 1
                OR [AllowDocument] = 1 
                THEN 1 
            ELSE 0
        END AS BIT
    ) PERSISTED,
    
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_File] PRIMARY KEY ([idUsers], [idFile]),
    CONSTRAINT [FK_File_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_File_FileExtension] FOREIGN KEY ([FileExtension]) REFERENCES [dim].[FileExtension]([FileExtension]),
    CONSTRAINT [UQ_File_AllowDocument] UNIQUE ([idUsers], [idFile], [AllowDocument]),
    CONSTRAINT [UQ_File_AllowStatementImage] UNIQUE ([idUsers], [idFile], [AllowStatementImage]),
    CONSTRAINT [UQ_File_AllowAccountImage] UNIQUE ([idUsers], [idFile], [AllowAccountImage]),
    CONSTRAINT [UQ_File_AllowTransactionInvoiceImage] UNIQUE ([idUsers], [idFile], [AllowTransactionInvoiceImage]),
    CONSTRAINT [UQ_File_AllowTransactionReceiptImage] UNIQUE ([idUsers], [idFile], [AllowTransactionReceiptImage])
);