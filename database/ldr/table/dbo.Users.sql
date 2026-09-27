CREATE TABLE [dbo].[Users] (
    [idUsers] UNIQUEIDENTIFIER DEFAULT NEWID() NOT NULL PRIMARY KEY,
    [Username] NVARCHAR(200) NOT NULL,
    [Password] NVARCHAR(255) NOT NULL,
    [FirstName] NVARCHAR(200) NOT NULL,
    [LastName] NVARCHAR(200) NOT NULL,
    [Email] VARCHAR(320) NULL,
    [Phone] CHAR(11) NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [UQ_Users_Username] UNIQUE ([Username]),
    CONSTRAINT [UQ_Users_Email] UNIQUE ([Email]),
    CONSTRAINT [UQ_Users_Phone] UNIQUE ([Phone])
);