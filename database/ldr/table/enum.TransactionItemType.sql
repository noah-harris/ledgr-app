CREATE TABLE [enum].[TransactionItemType] (
    [idTransactionItemType] UNIQUEIDENTIFIER NOT NULL,
    [TransactionItemTypeName] NVARCHAR(100) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionItemType] PRIMARY KEY ([idTransactionItemType])
);