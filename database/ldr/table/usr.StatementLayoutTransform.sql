CREATE TABLE [usr].[StatementLayoutTransform] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idStatementLayout] UNIQUEIDENTIFIER NOT NULL,
    [idStatementTransform] UNIQUEIDENTIFIER NOT NULL,
    [Position] INT NOT NULL,
    [isEnabled] BIT NOT NULL DEFAULT 1,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_StatementLayoutTransform] PRIMARY KEY ([idUsers], [idStatementLayout], [idStatementTransform]),
    CONSTRAINT [FK_StatementLayoutTransform_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_StatementLayoutTransform_StatementLayout] FOREIGN KEY ([idUsers], [idStatementLayout]) REFERENCES [usr].[StatementLayout]([idUsers], [idStatementLayout]) ON DELETE CASCADE,
    CONSTRAINT [FK_StatementLayoutTransform_StatementTransform] FOREIGN KEY ([idUsers], [idStatementTransform]) REFERENCES [usr].[StatementTransform]([idUsers], [idStatementTransform]) ON DELETE CASCADE
);
