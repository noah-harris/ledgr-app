CREATE TABLE [enum].[TransactionType] (
    [idTransactionType] UNIQUEIDENTIFIER NOT NULL,
    [Scope] VARCHAR(25) NOT NULL,
    [Cashflow] VARCHAR(25) NOT NULL,
    [isCashflowInName] BIT NOT NULL,
    [Action] VARCHAR(25) NOT NULL,
    [isActionInName] BIT NOT NULL,
    [Target] VARCHAR(25) NOT NULL,
    [isTargetInName] BIT NOT NULL,
    
    [TransactionTypeName] AS 
    CAST(
        CONCAT(
            CASE WHEN [isCashflowInName] = 1 THEN [Cashflow] + ' ' ELSE '' END,
            CASE WHEN [isActionInName] = 1 THEN [Action] + ' ' ELSE '' END,
            CASE WHEN [isTargetInName] = 1 THEN [Target] ELSE '' END
        ) AS NVARCHAR(77)
    ) PERSISTED,

    [requireTransactionItems] BIT NOT NULL,
    [Description] NVARCHAR(500) NOT NULL,
    [Sign] AS CAST(CASE WHEN [Cashflow] = 'DEPOSIT' THEN -1 ELSE 1 END AS INT) PERSISTED,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionType] PRIMARY KEY ([idTransactionType]),
    CONSTRAINT [UQ_TransactionType_TransactionTypeName] UNIQUE ([TransactionTypeName]),
    CONSTRAINT [CK_TransactionType_Cashflow] CHECK ([Cashflow] IN ('DEPOSIT', 'WITHDRAW')),
    CONSTRAINT [CK_TransactionType_Scope] CHECK ([Scope] IN ('INTERNAL', 'EXTERNAL'))
);