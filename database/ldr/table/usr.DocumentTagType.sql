CREATE TABLE [usr].[DocumentTagType] (
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idDocumentTagType] UNIQUEIDENTIFIER NOT NULL,
    [TagName] VARCHAR(200) NOT NULL,
    [hasValue] BIT NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),   
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_DocumentTagType] PRIMARY KEY ([idUsers], [idDocumentTagType]),
    CONSTRAINT [FK_DocumentTagType_Users] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers])
);