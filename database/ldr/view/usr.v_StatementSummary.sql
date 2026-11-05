CREATE VIEW [usr].[v_StatementSummary] 
    AS
WITH [CTE_StatementSummary] AS (
    SELECT 
        s.[idUsers],
        s.[idAccount],
        s.[idStatement],
        SUM(CASE WHEN t.[Sign] = 1 THEN t.[Amount] ELSE 0.00 END) AS [AmountWithdrawn],
        SUM(CASE WHEN t.[Sign] = -1 THEN t.[Amount] ELSE 0.00 END) AS [AmountDeposited],
        SUM(CASE WHEN t.[Sign] = 1 THEN 1 ELSE 0 END) AS [TotalWithdrawals],
        SUM(CASE WHEN t.[Sign] = -1 THEN 1 ELSE 0 END) AS [TotalDeposits],
        COUNT(t.[idTransaction]) AS [TotalTransactions]
    FROM [usr].[v_Statement] AS s
    JOIN [usr].[v_Transaction] AS t
    ON 1=1 
        AND s.[idUsers] = t.[idUsers]
        AND s.[idAccount] = t.[idAccount]
        AND s.[idStatement] = t.[idStatement]
    GROUP BY s.[idUsers], s.[idAccount], s.[idStatement]
)
SELECT 
    s.[idUsers],
    s.[idAccount],
    s.[idStatement],
    s.[idImage],
    s.[StatementDate],
    s.[StartDate],
    s.[EndDate],
    s.[PeriodLength],
    s.[StartBalance],
    s.[EndBalance],
    s.[BalanceChange],
    CAST(ss.[AmountWithdrawn] AS DECIMAL(18, 2)) AS [AmountWithdrawn],
    CAST(ss.[AmountDeposited] AS DECIMAL(18, 2)) AS [AmountDeposited],
    CAST(ss.[TotalWithdrawals] AS INT) AS [TotalWithdrawals],
    CAST(ss.[TotalDeposits] AS INT) AS [TotalDeposits],
    CAST(ss.[TotalTransactions] AS INT) AS [TotalTransactions],
    s.[Created],
    s.[Updated]
FROM [usr].[v_Statement] AS s
JOIN [CTE_StatementSummary] AS ss
ON 1=1
    AND s.[idUsers] = ss.[idUsers]
    AND s.[idAccount] = ss.[idAccount]
    AND s.[idStatement] = ss.[idStatement]

