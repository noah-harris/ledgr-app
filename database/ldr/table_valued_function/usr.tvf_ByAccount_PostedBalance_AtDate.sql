CREATE FUNCTION [usr].[tvf_ByAccount_PostedBalance_AtDate](@idUsers UNIQUEIDENTIFIER, @Date DATE)
RETURNS TABLE AS RETURN (
    --DECLARE @idUsers UNIQUEIDENTIFIER = '40b6c17c-98e7-482c-ba22-e66603d4173c', @Date DATE = '2026-07-31'; 
    WITH
    [CTE_LatestStatement] AS (
        SELECT *
        FROM (
            SELECT 
                *,
                ROW_NUMBER() OVER (PARTITION BY [idUsers], [idAccount] ORDER BY [EndDate] DESC) AS [idx]
            FROM [usr].[Statement]
            WHERE 1=1 
                AND [idUsers] = @idUsers
                AND [StartDate] <= @Date
        ) AS s
        WHERE [idx] = 1
    ),
    [CTE_LatestPostTotal] AS (
        SELECT 
            t.[idUsers],
            t.[idAccount],
            SUM(t.[Amount]) AS [TotalAmount]
        FROM [usr].[Transaction] AS t
        WHERE 1=1
            AND t.[idUsers] = @idUsers
            AND t.[PostDate] <= @Date
            AND EXISTS (
                SELECT 1 
                FROM [CTE_LatestStatement] AS s
                WHERE 1=1
                    AND t.[idUsers] = s.[idUsers]
                    AND t.[idAccount] = s.[idAccount]
                    AND t.[idStatement] = s.[idStatement]
            )
        GROUP BY t.[idUsers], t.[idAccount]
    )
    SELECT 
        s.[idUsers], 
        s.[idAccount], 
        @Date AS [BalanceDate],
        s.[StartBalance] + ISNULL(t.[TotalAmount], 0) AS [BalanceAmount]
    FROM [CTE_LatestStatement] AS s
    LEFT JOIN [CTE_LatestPostTotal] AS t
    ON 1=1
        AND s.[idUsers] = t.[idUsers]
        AND s.[idAccount] = t.[idAccount]
)
