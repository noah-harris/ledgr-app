CREATE TABLE [usr].[Organization] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idOrganization] UNIQUEIDENTIFIER NOT NULL,
    [Mcc] CHAR(4) NULL,
    [OrganizationName] NVARCHAR(200) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Organization] PRIMARY KEY ([idUsers], [idOrganization]),
    CONSTRAINT [FK_Organization_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [UQ_Organization_idUsers_OrganizationName] UNIQUE ([idUsers], [OrganizationName]),
    CONSTRAINT [FK_Organization_IsoMcc] FOREIGN KEY ([Mcc]) REFERENCES [dim].[MerchantCategoryCode]([Mcc])
); 