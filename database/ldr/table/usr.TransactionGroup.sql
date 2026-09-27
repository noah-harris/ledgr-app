CREATE TABLE [usr].[TransactionGroup] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idTransactionGroup] UNIQUEIDENTIFIER NOT NULL,
    [idTransactionGroupType] UNIQUEIDENTIFIER NOT NULL,
    [Description] NVARCHAR(4000) NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionGroup] PRIMARY KEY ([idUsers], [idTransactionGroup]),
    CONSTRAINT [FK_TransactionGroup_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_TransactionGroup_TransactionGroupType] FOREIGN KEY ([idTransactionGroupType]) REFERENCES [enum].[TransactionGroupType]([idTransactionGroupType])
);
