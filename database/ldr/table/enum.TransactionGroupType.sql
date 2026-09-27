CREATE TABLE [enum].[TransactionGroupType] (
    [idTransactionGroupType] UNIQUEIDENTIFIER NOT NULL,
    [GroupName] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(500) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_TransactionGroupType] PRIMARY KEY ([idTransactionGroupType])
);


-- General: They group together for what ever reason
-- Refund: A refund was made for a purchase. The refund and its target go here
-- Transfer: The simple action of moving funds from one place to another. (Could be a credit payment too)
-- Pass Trough Payment: Used Paypal to buy something and money came from bank to paypal to payee
