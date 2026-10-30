CREATE FUNCTION [usr].[tvf_ByDay_Statement_Coverage](@idUsers UNIQUEIDENTIFIER)
RETURNS TABLE AS RETURN (
    --DECLARE @idUsers UNIQUEIDENTIFIER = '40b6c17c-98e7-482c-ba22-e66603d4173c';
    WITH [Timeline] AS (
        SELECT 
            a.[idUsers], 
            a.[idAccount], 
            c.[Date]
        FROM [usr].[Account] AS a
        JOIN [dim].[Calendar] AS c
        ON c.[Date] BETWEEN a.[StartDate] AND ISNULL(a.[EndDate], CAST(GETDATE() AS DATE))
        WHERE a.[idUsers] = @idUsers
    )
    SELECT 
        t.[idUsers], 
        t.[idAccount], 
        t.[Date],
        CASE WHEN s.[idStatement] IS NULL THEN 0 ELSE 1 END AS [isEntered]
    FROM [Timeline] AS t
    LEFT JOIN [usr].[Statement] AS s
    ON 1=1 
        AND s.[idUsers] = t.[idUsers]
        AND s.[idAccount] = t.[idAccount]
        AND t.[Date] BETWEEN s.[StartDate] AND s.[EndDate]
    WHERE 1=1
        AND t.[idUsers] = @idUsers
        AND t.[Date] <= GETDATE()
)
