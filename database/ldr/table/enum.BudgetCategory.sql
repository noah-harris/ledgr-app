CREATE TABLE [enum].[BudgetCategory] (
    [idBudgetCategory] UNIQUEIDENTIFIER NOT NULL,
    [CategoryLevel1Name] NVARCHAR(100) NOT NULL,
    [CategoryLevel2Name] NVARCHAR(100) NULL,
    [CategoryLevel3Name] NVARCHAR(100) NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_BudgetCategory] PRIMARY KEY NONCLUSTERED ([idBudgetCategory]),
    CONSTRAINT [UQ_BudgetCategory] UNIQUE ([CategoryLevel1Name], [CategoryLevel2Name], [CategoryLevel3Name]),
    INDEX [IX_BudgetCategory] CLUSTERED ([CategoryLevel1Name], [CategoryLevel2Name], [CategoryLevel3Name])
);