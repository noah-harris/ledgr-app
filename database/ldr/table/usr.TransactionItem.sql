CREATE TABLE [usr].[TransactionItem] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idAccount] UNIQUEIDENTIFIER NOT NULL,
    [idStatement] UNIQUEIDENTIFIER NOT NULL,
    [idTransaction] UNIQUEIDENTIFIER NOT NULL,
    [idTransactionItem] UNIQUEIDENTIFIER NOT NULL,
    [idTransactionItemType] UNIQUEIDENTIFIER NOT NULL,
    [idCurrency] UNIQUEIDENTIFIER NOT NULL,
    [idQuantityUnit] UNIQUEIDENTIFIER NULL, -- The unit must exist if quantity exists
    [ItemName] NVARCHAR(255) NOT NULL,
    [ItemDescription] NVARCHAR(200) NULL,
    [Amount] DECIMAL(18, 2) NOT NULL,
    [Quantity] DECIMAL(18, 4) NULL, -- The unit must exist if quantity exists
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionItem] PRIMARY KEY ([idUsers], [idAccount], [idStatement], [idTransaction], [idTransactionItem]),
    CONSTRAINT [FK_TransactionItem_Transaction] FOREIGN KEY ([idUsers], [idAccount], [idStatement], [idTransaction]) REFERENCES [usr].[Transaction]([idUsers], [idAccount], [idStatement], [idTransaction]),
    CONSTRAINT [FK_TransactionItem_TransactionItemType] FOREIGN KEY ([idTransactionItemType]) REFERENCES [dbo].[TransactionItemType]([idTransactionItemType]),
    CONSTRAINT [FK_TransactionItem_Currency] FOREIGN KEY ([idCurrency]) REFERENCES [dim].[Unit]([idUnit], [isCurrencyType]),
    CONSTRAINT [FK_TransactionItem_QuantityUnit] FOREIGN KEY ([idQuantityUnit]) REFERENCES [dim].[Unit]([idUnit])
);