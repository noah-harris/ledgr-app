CREATE TABLE [usr].[TransactionTag] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idAccount] UNIQUEIDENTIFIER NOT NULL,
    [idStatement] UNIQUEIDENTIFIER NOT NULL,
    [idTransaction] UNIQUEIDENTIFIER NOT NULL,
    [idBudgetTag] UNIQUEIDENTIFIER NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionTag] PRIMARY KEY ([idUsers], [idAccount], [idStatement], [idTransaction], [idBudgetTag]),
    CONSTRAINT [FK_TransactionTag_BudgetTag] FOREIGN KEY ([idBudgetTag]) REFERENCES [usr].[BudgetTag]([idBudgetTag]),
    CONSTRAINT [FK_TransactionTag_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_TransactionTag_Account] FOREIGN KEY ([idUsers], [idAccount]) REFERENCES [usr].[Account]([idUsers], [idAccount]),
    CONSTRAINT [FK_TransactionTag_Statement] FOREIGN KEY ([idUsers], [idAccount], [idStatement]) REFERENCES [usr].[Statement]([idUsers], [idAccount], [idStatement]),
    CONSTRAINT [FK_TransactionTag_Transaction] FOREIGN KEY ([idUsers], [idAccount], [idStatement], [idTransaction]) REFERENCES [usr].[Transaction]([idUsers], [idAccount], [idStatement], [idTransaction])
);
