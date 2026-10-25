CREATE TABLE [usr].[TransactionItemTag] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idAccount] UNIQUEIDENTIFIER NOT NULL,
    [idStatement] UNIQUEIDENTIFIER NOT NULL,
    [idTransaction] UNIQUEIDENTIFIER NOT NULL,
    [idTransactionItem] UNIQUEIDENTIFIER NOT NULL,
    [idBudgetTag] UNIQUEIDENTIFIER NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionItemTag] PRIMARY KEY ([idUsers], [idAccount], [idStatement], [idTransaction], [idTransactionItem], [idBudgetTag]),
    CONSTRAINT [FK_TransactionItemTag_TransactionItem] FOREIGN KEY ([idUsers], [idAccount], [idStatement], [idTransaction], [idTransactionItem]) REFERENCES [usr].[TransactionItem]([idUsers], [idAccount], [idStatement], [idTransaction], [idTransactionItem]),
    CONSTRAINT [FK_TransactionItemTag_BudgetTag] FOREIGN KEY ([idBudgetTag]) REFERENCES [usr].[BudgetTag]([idBudgetTag])
);
