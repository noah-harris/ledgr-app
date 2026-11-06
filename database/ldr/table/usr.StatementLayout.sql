CREATE TABLE [usr].[StatementLayout] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idStatementLayout] UNIQUEIDENTIFIER NOT NULL,
    [LayoutName] NVARCHAR(200) NOT NULL,
    [Definition] NVARCHAR(MAX) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_StatementLayout] PRIMARY KEY ([idUsers], [idStatementLayout]),
    CONSTRAINT [UQ_StatementLayout_LayoutName] UNIQUE ([idUsers], [LayoutName]),
    CONSTRAINT [FK_StatementLayout_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [CK_StatementLayout_Definition] CHECK (ISJSON([Definition]) = 1)
);
