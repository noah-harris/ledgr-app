CREATE TABLE [dim].[MerchantCategoryCodeTag] (
    [Mcc] CHAR(4) NOT NULL,
    [idBudgetTag] UNIQUEIDENTIFIER NOT NULL,
    [isDefaultBudgetTag] AS 1 PERSISTED,
    CONSTRAINT [PK_MerchantCategoryCodeTag] PRIMARY KEY ([Mcc], [idBudgetTag]),
    CONSTRAINT [FK_MerchantCategoryCodeTag_MerchantCategoryCode] FOREIGN KEY ([Mcc]) REFERENCES [dim].[MerchantCategoryCode]([Mcc]),
    CONSTRAINT [FK_MerchantCategoryCodeTag_BudgetTag] FOREIGN KEY ([idBudgetTag]) REFERENCES [usr].[BudgetTag]([idBudgetTag]),
    CONSTRAINT [FK_MerchantCategoryCodeTag_isDefaultBudgetTag] FOREIGN KEY ([idBudgetTag], [isDefaultBudgetTag]) REFERENCES [usr].[BudgetTag]([idBudgetTag], [isDefaultBudgetTag])
);