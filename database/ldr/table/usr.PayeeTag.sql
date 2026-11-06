CREATE TABLE [usr].[PayeeTag] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idPayee] UNIQUEIDENTIFIER NOT NULL,
    [idBudgetTag] UNIQUEIDENTIFIER NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),   
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_usr_PayeeTag] PRIMARY KEY ([idUsers], [idPayee], [idBudgetTag]),
    CONSTRAINT [FK_usr_PayeeTag_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_usr_PayeeTag_Payee] FOREIGN KEY ([idUsers], [idPayee]) REFERENCES [usr].[Payee]([idUsers], [idPayee]),
    CONSTRAINT [FK_usr_PayeeTag_BudgetTag] FOREIGN KEY ([idBudgetTag]) REFERENCES [usr].[BudgetTag]([idBudgetTag])
);