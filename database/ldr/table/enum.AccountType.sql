CREATE TABLE [enum].[AccountType] (
    [idAccountType] UNIQUEIDENTIFIER NOT NULL,
    [AccountTypeName] NVARCHAR(255) NOT NULL,
    [isCredit] BIT NOT NULL,
    [isSpendable] BIT NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_AccountType] PRIMARY KEY NONCLUSTERED ([idAccountType])
);