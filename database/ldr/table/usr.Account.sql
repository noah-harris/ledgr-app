CREATE TABLE [usr].[Account] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idAccount] UNIQUEIDENTIFIER NOT NULL,
    [idAccountType] UNIQUEIDENTIFIER NOT NULL,
    [idOrganization] UNIQUEIDENTIFIER NOT NULL,
    [idCurrency] UNIQUEIDENTIFIER NOT NULL,
    [AccountName] NVARCHAR(200) NOT NULL,
    [StartDate] DATETIME2(0) NOT NULL,
    [EndDate] DATETIME2(0) NOT NULL,
    [LoginPage] NVARCHAR(MAX) NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Account] PRIMARY KEY ([idUsers], [idAccount]),
    CONSTRAINT [FK_Account_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_Account_AccountType] FOREIGN KEY ([idAccountType]) REFERENCES [dbo].[AccountType]([idAccountType]),
    CONSTRAINT [FK_Account_Organization] FOREIGN KEY ([idUsers], [idOrganization]) REFERENCES [usr].[Organization]([idUsers], [idOrganization]),
    CONSTRAINT [FK_Account_Currency] FOREIGN KEY ([idCurrency]) REFERENCES [dim].[Unit]([idUnit]),
    CONSTRAINT [CK_Account_StartDate_EndDate] CHECK ([StartDate] < [EndDate])
);