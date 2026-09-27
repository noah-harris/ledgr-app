CREATE TABLE [enum].[AccountSubType] (
    [idAccountType] UNIQUEIDENTIFIER NOT NULL,
    [idAccountSubType] UNIQUEIDENTIFIER NOT NULL,
    [AccountSubTypeName] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(500) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_AccountSubType] PRIMARY KEY NONCLUSTERED ([idAccountSubType]),
    CONSTRAINT [UQ_AccountSubType_nameAccountSubType] UNIQUE ([AccountSubTypeName]),
    CONSTRAINT [FK_AccountSubType_AccountType] FOREIGN KEY ([idAccountType]) REFERENCES [enum].[AccountType]([idAccountType])
);