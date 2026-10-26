CREATE TABLE [usr].[BudgetTag] (
    [idUsers] UNIQUEIDENTIFIER NULL,
    [idBudgetTag] UNIQUEIDENTIFIER NOT NULL,
    [idBudgetCategory] UNIQUEIDENTIFIER NULL,
    [BudgetTagName] NVARCHAR(100) NOT NULL,
    [isIncludedInBudget] AS CAST(CASE WHEN [idBudgetCategory] IS NOT NULL THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [isDefaultBudgetTag] AS CAST(CASE WHEN [idUsers] IS NULL THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_BudgetTag] PRIMARY KEY NONCLUSTERED ([idBudgetTag]),
    CONSTRAINT [FK_BudgetTag_BudgetCategory] FOREIGN KEY ([idBudgetCategory]) REFERENCES [enum].[BudgetCategory]([idBudgetCategory]),
    CONSTRAINT [UQ_BudgetTag_isDefaultBudgetTag] UNIQUE ([idBudgetTag], [isDefaultBudgetTag]),
    CONSTRAINT [FK_BudgetTag_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers])
);