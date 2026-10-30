CREATE FUNCTION [dbo].[tvf_Check_GetAllowImageColumns] ()
RETURNS 
@AllowImageColumns TABLE ([Name] NVARCHAR(255) NOT NULL)
AS
BEGIN
    INSERT INTO @AllowImageColumns ([Name])
    SELECT [NAME]
    FROM [sys].[columns] 
    WHERE 1=1 
        AND [NAME] LIKE '%Allow%Image%%'
        AND OBJECT_ID = OBJECT_ID('usr.File')

    RETURN
END


