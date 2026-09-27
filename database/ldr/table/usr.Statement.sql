CREATE TABLE [usr].[Statement] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idAccount] UNIQUEIDENTIFIER NOT NULL,
    [idStatement] UNIQUEIDENTIFIER NOT NULL,
    [idImage] UNIQUEIDENTIFIER NULL,
    [StatementDate] DATE NOT NULL,
    [StartDate] DATETIME2(0) NOT NULL,
    [EndDate] DATETIME2(0) NOT NULL,
    [StartBalance] DECIMAL(18, 2) NOT NULL,
    [EndBalance] DECIMAL(18, 2) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Statement] PRIMARY KEY NONCLUSTERED ([idUsers], [idAccount], [idStatement]),
    CONSTRAINT [FK_Statement_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_Statement_Account] FOREIGN KEY ([idUsers], [idAccount]) REFERENCES [usr].[Account]([idUsers], [idAccount]),
    CONSTRAINT [FK_Statement_Image] FOREIGN KEY ([idUsers], [idImage]) REFERENCES [usr].[FileListAccountImage]([idUsers], [idFile])
);