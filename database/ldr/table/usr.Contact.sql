CREATE TABLE [usr].[Contact] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idContact] UNIQUEIDENTIFIER NOT NULL,
    [FirstName] VARCHAR(100) NOT NULL,
    [LastName] VARCHAR(100) NOT NULL,
    [Email] VARCHAR(320) NULL,
    [Phone] CHAR(11) NULL,
    [Address] NVARCHAR(1000) NULL,
    [Relationship] VARCHAR(200) NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Contact] PRIMARY KEY ([idUsers], [idContact]),
    CONSTRAINT [FK_Contact_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers])
);