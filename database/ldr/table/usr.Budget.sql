CREATE TABLE [usr].[Budget] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idBudget] UNIQUEIDENTIFIER NOT NULL,
    [BudgetName] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [StartDate] DATETIME2(0) NOT NULL,
    [EndDate] DATETIME2(0) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Budget] PRIMARY KEY ([idUsers], [idBudget]),
    CONSTRAINT [FK_Budget_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [UQ_Budget_nameBudget] UNIQUE ([idUsers], [BudgetName])
);