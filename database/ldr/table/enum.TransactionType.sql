CREATE TABLE [enum].[TransactionType] (
    [idTransactionType] UNIQUEIDENTIFIER NOT NULL,
    [TransactionTypeName] NVARCHAR(255) NOT NULL,
    [Scope] VARCHAR(25) NOT NULL,
    [Cashflow] VARCHAR(25) NOT NULL,
    [isPositive] BIT NOT NULL,
    [isItemEntryRequired] BIT NULL,
    [Description] NVARCHAR(500) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionType] PRIMARY KEY ([idTransactionType])
);