CREATE TABLE [enum].[TransactionGroupType] (
    [idTransactionGroupType] UNIQUEIDENTIFIER NOT NULL,
    [GroupName] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(500) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionGroupType] PRIMARY KEY ([idTransactionGroupType])
);