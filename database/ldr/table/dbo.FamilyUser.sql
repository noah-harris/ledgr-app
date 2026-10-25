CREATE TABLE [dbo].[FamilyUser] (
    [idFamily] UNIQUEIDENTIFIER NOT NULL,
    [idUser] UNIQUEIDENTIFIER NOT NULL,
    [idFamilyPermissionType] UNIQUEIDENTIFIER NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_FamilyUser] PRIMARY KEY ([idFamily], [idUser]),
    CONSTRAINT [FK_FamilyUser_Family] FOREIGN KEY ([idFamily]) REFERENCES [dbo].[Family]([idFamily]),
    CONSTRAINT [FK_FamilyUser_User] FOREIGN KEY ([idUser]) REFERENCES [dbo].[Users]([idUser]),
    CONSTRAINT [FK_FamilyUser_FamilyPermissionType] FOREIGN KEY ([idFamilyPermissionType]) REFERENCES [dbo].[FamilyPermissionType]([idFamilyPermissionType])
);