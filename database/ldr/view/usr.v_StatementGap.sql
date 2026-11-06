CREATE VIEW [usr].[v_StatementGap] 
    AS
WITH CTE AS (
    SELECT 
        *, 
        [EndDate] AS [GapStartDate],
        LEAD([StartDate], 1, DATEADD(DAY, -30, GETDATE())) OVER (PARTITION BY [idAccount] ORDER BY [StartDate]) AS [GapEndDate]
    FROM [usr].[Statement] AS s
)
SELECT 
    CAST(c.[idUsers] AS UNIQUEIDENTIFIER) AS [idUsers], 
    CAST(c.[idAccount] AS UNIQUEIDENTIFIER) AS [idAccount], 
    CAST(c.[GapStartDate] AS DATETIME2(0)) AS [GapStartDate], 
    CAST(c.[GapEndDate] AS DATETIME2(0)) AS [GapEndDate],
    CAST(DATEDIFF(DAY, c.[GapStartDate], c.[GapEndDate]) AS INT) AS [GapDurationDays]
FROM [usr].[Statement] AS s
JOIN CTE AS c 
ON 1=1 
    AND s.[idUsers] = c.[idUsers]
    AND s.[idAccount] = c.[idAccount] 
    AND s.[idStatement] = c.[idStatement]
WHERE CAST(DATEDIFF(DAY, c.[GapStartDate], c.[GapEndDate]) AS INT) > 30


