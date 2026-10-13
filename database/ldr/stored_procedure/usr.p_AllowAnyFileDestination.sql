CREATE PROCEDURE [usr].[p_AllowAnyFileDestination] (@idUsers UNIQUEIDENTIFIER, @idFile UNIQUEIDENTIFIER)
	AS
SET NOCOUNT ON
BEGIN

    DECLARE @ColumnName SYSNAME, @Sql NVARCHAR(MAX) = N'', @Statement NVARCHAR(MAX) = N'';

    DECLARE cur CURSOR LOCAL FAST_FORWARD FOR
        SELECT c.name
        FROM sys.columns c
        WHERE c.object_id = OBJECT_ID(N'usr.File')
          AND c.name LIKE N'Allow%'
        ORDER BY c.column_id;

    OPEN cur;
    FETCH NEXT FROM cur INTO @ColumnName;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @Sql += CASE WHEN @Sql = N'' THEN N'' ELSE N',' + CHAR(13) + CHAR(10) END
                  + QUOTENAME(@ColumnName) + N' = 1';

        FETCH NEXT FROM cur INTO @ColumnName;
    END

    CLOSE cur;
    DEALLOCATE cur;

    SET @Statement = '
    UPDATE [usr].[File]
    SET 
    '+
    @Sql
    +'
    WHERE [idUsers] = '+QUOTENAME(CAST(@idUsers AS VARCHAR(50)),'''')+'[idFile] = '+QUOTENAME(CAST(@idFile AS VARCHAR(50)),'''')
	
    EXEC sp_executesql @Statement

END