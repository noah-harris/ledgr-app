CREATE TABLE [usr].[StatementTransform] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idStatementTransform] UNIQUEIDENTIFIER NOT NULL,
    [TransformName] NVARCHAR(200) NOT NULL,
    [TargetColumn] NVARCHAR(200) NOT NULL,
    [Code] NVARCHAR(MAX) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_StatementTransform] PRIMARY KEY ([idUsers], [idStatementTransform]),
    CONSTRAINT [FK_StatementTransform_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers])
);
