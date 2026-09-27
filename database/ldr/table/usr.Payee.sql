CREATE TABLE [usr].[Payee] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idPayee] UNIQUEIDENTIFIER NOT NULL,
    [PayeeType] NVARCHAR(50) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Payee] PRIMARY KEY ([idUsers], [idPayee]),
    CONSTRAINT [FK_Payee_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [CK_Payee_PayeeType] CHECK ([PayeeType] IN ('ORGANIZATION', 'CONTACT', 'ACCOUNT'))
);