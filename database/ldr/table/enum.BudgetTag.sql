CREATE TABLE [enum].[BudgetTag] (
    [idBudgetTag] UNIQUEIDENTIFIER NOT NULL,
    [TagDisplayName] NVARCHAR(100) NOT NULL,
    [CategoryLevel1Name] NVARCHAR(100) NOT NULL,
    [CategoryLevel2Name] NVARCHAR(100) NULL,
    [CategoryLevel3Name] NVARCHAR(100) NULL,
    [Description] NVARCHAR(200) NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_BudgetTag] PRIMARY KEY NONCLUSTERED ([idBudgetTag]),
    CONSTRAINT [UQ_BudgetTag] UNIQUE ([CategoryLevel1Name], [CategoryLevel2Name], [CategoryLevel3Name]),
    CONSTRAINT [UQ_TagDisplayName] UNIQUE ([TagDisplayName])
);