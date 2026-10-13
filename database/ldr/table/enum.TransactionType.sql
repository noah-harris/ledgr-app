CREATE TABLE [enum].[TransactionType] (
    [idTransactionType] UNIQUEIDENTIFIER NOT NULL,
    [TransactionTypeName] NVARCHAR(255) NOT NULL,
    [Scope] VARCHAR(25) NOT NULL,
    [Cashflow] VARCHAR(25) NOT NULL,
    [isPositive] AS CAST(CASE WHEN [Cashflow] = 'DEPOSIT' THEN 0 ELSE 1 END AS BIT) PERSISTED,
    [isItemEntryRequired] BIT NULL,
    [Description] NVARCHAR(500) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionType] PRIMARY KEY ([idTransactionType]),
    CONSTRAINT [UQ_TransactionType_TransactionTypeName] UNIQUE ([TransactionTypeName]),
    CONSTRAINT [CK_TransactionType_Cashflow] CHECK ([Cashflow] IN ('DEPOSIT', 'WITHDRAW')),
    CONSTRAINT [CK_TransactionType_Scope] CHECK ([Scope] IN ('INTERNAL', 'EXTERNAL'))
);