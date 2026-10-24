CREATE TABLE [dbo].[FamilyPermissionType] (
    [idFamilyPermissionType] UNIQUEIDENTIFIER PRIMARY KEY,
    [PermissionName] NVARCHAR(255) NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE()
);