CREATE TABLE [dbo].[FamilyUser] (
    [idFamily] UNIQUEIDENTIFIER NOT NULL,
    [idUsers] UNIQUEIDENTIFIER NOT NULL,
    [idFamilyPermissionType] UNIQUEIDENTIFIER NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_FamilyUser] PRIMARY KEY ([idFamily], [idUsers]),
    CONSTRAINT [FK_FamilyUser_Family] FOREIGN KEY ([idFamily]) REFERENCES [dbo].[Family]([idFamily]),
    CONSTRAINT [FK_FamilyUser_User] FOREIGN KEY ([idUsers]) REFERENCES [dbo].[Users]([idUsers]),
    CONSTRAINT [FK_FamilyUser_FamilyPermissionType] FOREIGN KEY ([idFamilyPermissionType]) REFERENCES [dbo].[FamilyPermissionType]([idFamilyPermissionType])
);