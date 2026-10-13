CREATE TABLE [usr].[TransactionItemTag] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idAccount] UNIQUEIDENTIFIER NOT NULL,
    [idStatement] UNIQUEIDENTIFIER NOT NULL,
    [idTransaction] UNIQUEIDENTIFIER NOT NULL,
    [idTransactionItem] UNIQUEIDENTIFIER NOT NULL,
    [idBudgetTag] UNIQUEIDENTIFIER NOT NULL,
    [Value] NVARCHAR(200) NULL,
    [hasAttributeValue] AS CAST(CASE WHEN [Value] IS NOT NULL THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionItemTag] PRIMARY KEY ([idUsers], [idAccount], [idStatement], [idTransaction], [idTransactionItem], [idBudgetTag]),
    CONSTRAINT [FK_TransactionItemTag_TransactionItem] FOREIGN KEY ([idUsers], [idAccount], [idStatement], [idTransaction], [idTransactionItem]) REFERENCES [usr].[TransactionItem]([idUsers], [idAccount], [idStatement], [idTransaction], [idTransactionItem]),
    CONSTRAINT [FK_TransactionItemTag_TransactionItemTagType_hasAttributeValue] FOREIGN KEY ([idBudgetTag], [hasAttributeValue]) REFERENCES [usr].[BudgetTag]([idBudgetTag], [hasAttributeValue])
);
