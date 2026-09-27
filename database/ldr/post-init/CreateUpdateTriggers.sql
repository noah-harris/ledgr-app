DECLARE @schema  SYSNAME,
        @table   SYSNAME,
        @cols    NVARCHAR(MAX),
        @sql     NVARCHAR(MAX);

DECLARE tbl_cursor CURSOR LOCAL FAST_FORWARD FOR
SELECT
    s.[name] AS schema_name,
    t.[name] AS table_name,
    key_join.cols
FROM [sys].[tables] AS t
JOIN [sys].[schemas] AS s
    ON s.[schema_id] = t.[schema_id]
CROSS APPLY (
    SELECT STRING_AGG(
        CAST(N'tbl.' + QUOTENAME(c.[name]) + N' = i.' + QUOTENAME(c.[name]) AS NVARCHAR(MAX)),
        N' AND '
    ) WITHIN GROUP (ORDER BY ic.[key_ordinal]) AS cols
    FROM [sys].[indexes] AS ix
    JOIN [sys].[index_columns] AS ic
        ON ic.[object_id] = ix.[object_id]
        AND ic.[index_id] = ix.[index_id]
    JOIN [sys].[columns] AS c
        ON c.[object_id] = ic.[object_id]
        AND c.[column_id] = ic.[column_id]
    WHERE ix.[object_id] = t.[object_id]
        AND ix.[is_primary_key] = 1
        AND ic.[key_ordinal] > 0
) AS key_join
WHERE 1 = 1
    AND EXISTS (
        SELECT NULL FROM [sys].[columns] AS c
        WHERE c.[object_id] = t.[object_id] AND c.[name] = 'Created'
    )
    AND EXISTS (
        SELECT NULL FROM [sys].[columns] AS c
        WHERE c.[object_id] = t.[object_id] AND c.[name] = 'Updated'
    )
    AND EXISTS (
        SELECT NULL FROM [sys].[indexes] AS ix
        WHERE ix.[object_id] = t.[object_id] AND ix.[is_primary_key] = 1
    );

OPEN tbl_cursor;
FETCH NEXT FROM tbl_cursor INTO @schema, @table, @cols;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @sql = N'
CREATE OR ALTER TRIGGER ' + QUOTENAME(@schema) + N'.' + QUOTENAME(N'trg_' + @table + N'_SetUpdated') + N'
ON ' + QUOTENAME(@schema) + N'.' + QUOTENAME(@table) + N'
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT UPDATE([Updated])
        UPDATE tbl
        SET tbl.[Updated] = SYSUTCDATETIME()
        FROM ' + QUOTENAME(@schema) + N'.' + QUOTENAME(@table) + N' AS tbl
        INNER JOIN inserted AS i ON ' + @cols + N';
END;';

    PRINT @sql;                         -- review output
    EXEC sys.sp_executesql @sql;        -- comment out to dry-run

    FETCH NEXT FROM tbl_cursor INTO @schema, @table, @cols;
END;

CLOSE tbl_cursor;
DEALLOCATE tbl_cursor;