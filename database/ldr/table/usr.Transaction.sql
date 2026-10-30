CREATE TABLE [usr].[Transaction] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idAccount] UNIQUEIDENTIFIER NOT NULL,
    [idStatement] UNIQUEIDENTIFIER NOT NULL,
    [idTransaction] UNIQUEIDENTIFIER NOT NULL,
    [idTransactionGroup] UNIQUEIDENTIFIER NULL,
    [idTransactionParent] UNIQUEIDENTIFIER NULL,
    [idTransactionType] UNIQUEIDENTIFIER NOT NULL,
    [idPayee] UNIQUEIDENTIFIER NOT NULL,
    [idImageInvoice] UNIQUEIDENTIFIER NULL,
    [idImageReceipt] UNIQUEIDENTIFIER NULL,
    [TransactionDate] DATETIME2(0) NOT NULL,
    [PostDate] DATE NOT NULL,
    [InvoiceDate] DATETIME2(0) NULL,
    [DueDate] DATE NULL,
    [StartDate] DATETIME2(0) NULL,
    [EndDate] DATETIME2(0) NULL,
    [Amount] DECIMAL(18, 2) NOT NULL,
    [StatementText] NVARCHAR(200) NULL,
    [isValidated] BIT NULL,
    [isTransactionSplitChild] AS CAST(CASE WHEN [idTransactionParent] IS NOT NULL THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [hasInvoiceImage] AS CAST(CASE WHEN [idImageInvoice] IS NOT NULL THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [hasReceiptImage] AS CAST(CASE WHEN [idImageReceipt] IS NOT NULL THEN 1 ELSE 0 END AS BIT) PERSISTED ,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Transaction] PRIMARY KEY NONCLUSTERED ([idUsers], [idAccount], [idStatement], [idTransaction]),
    -- CONSTRAINT [UQ_Transaction_ImageInvoice] UNIQUE ([idUsers], [idImageInvoice], [hasInvoiceImage]),
    -- CONSTRAINT [UQ_Transaction_ImageReceipt] UNIQUE ([idUsers], [idImageReceipt], [hasReceiptImage]),
    -- INDEX [UQ_Transaction_ImageInvoice] UNIQUE ([idUsers], [idImageInvoice]) WHERE [idImageInvoice] IS NOT NULL AND [idImageInvoice] <> '00000000-0000-0000-0000-000000000000',
    -- INDEX [UQ_Transaction_ImageReceipt] UNIQUE ([idUsers], [idImageReceipt]) WHERE [idImageReceipt] IS NOT NULL AND [idImageReceipt] <> '00000000-0000-0000-0000-000000000000',
    CONSTRAINT [FK_Transaction_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_Transaction_Account] FOREIGN KEY ([idUsers], [idAccount]) REFERENCES [usr].[Account]([idUsers], [idAccount]),
    CONSTRAINT [FK_Transaction_Statement] FOREIGN KEY ([idUsers], [idAccount], [idStatement]) REFERENCES [usr].[Statement]([idUsers], [idAccount], [idStatement]),
    CONSTRAINT [FK_Transaction_Payee] FOREIGN KEY ([idUsers], [idPayee]) REFERENCES [usr].[Payee]([idUsers], [idPayee]),
    CONSTRAINT [FK_Transaction_TransactionType] FOREIGN KEY ([idTransactionType]) REFERENCES [enum].[TransactionType]([idTransactionType]),
    CONSTRAINT [FK_Transaction_TransactionGroup] FOREIGN KEY ([idUsers], [idTransactionGroup]) REFERENCES [usr].[TransactionGroup]([idUsers], [idTransactionGroup]),
    CONSTRAINT [FK_Transaction_Parent] FOREIGN KEY ([idUsers], [idAccount], [idStatement], [idTransactionParent]) REFERENCES [usr].[Transaction]([idUsers], [idAccount], [idStatement], [idTransaction]),
    CONSTRAINT [CK_Transaction_NotOwnParent] CHECK ([idTransactionParent] <> [idTransaction]),
    CONSTRAINT [CK_Transaction_TransactionDate_PostDate] CHECK ([TransactionDate] < DATEADD(DAY, 1, [PostDate])),
    CONSTRAINT [CK_Transaction_InvoiceDate_DueDate] CHECK (1=2 
        OR ([InvoiceDate] IS NULL AND [DueDate] IS NULL)
        OR ([InvoiceDate] IS NOT NULL AND [DueDate] IS NOT NULL AND CAST([InvoiceDate] AS DATE) <= [DueDate])
    ),
    CONSTRAINT [CK_Transaction_StartDate_EndDate] CHECK (1=2
        OR ([StartDate] IS NULL AND [EndDate] IS NULL)
        OR ([StartDate] IS NOT NULL AND [EndDate] IS NOT NULL AND [StartDate] < [EndDate])
    ),
    CONSTRAINT [CK_Transaction_Amount] CHECK ([Amount] <> 0),
)

ALTER TABLE [usr].[Transaction] ADD
    CONSTRAINT [FK_Transaction_ImageInvoice]
        FOREIGN KEY ([idUsers], [idImageInvoice], [hasInvoiceImage])
        REFERENCES [usr].[File]([idUsers], [idFile], [AllowTransactionInvoiceImage]),
    CONSTRAINT [FK_Transaction_ImageReceipt]
        FOREIGN KEY ([idUsers], [idImageReceipt], [hasReceiptImage])
        REFERENCES [usr].[File]([idUsers], [idFile], [AllowTransactionReceiptImage]);


