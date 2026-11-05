CREATE VIEW [usr].[v_Statement] 
    AS
SELECT 
    s.[idUsers],
    s.[idAccount],
    s.[idStatement],
    s.[idImage],
    s.[StatementDate],
    s.[StartDate],
    s.[EndDate],
    DATEDIFF(DAY, s.[StartDate], s.[EndDate]) AS [PeriodLength],
    s.[StartBalance],
    s.[EndBalance],
    (s.[EndBalance] - s.[StartBalance]) AS [BalanceChange],
    s.[Created],
    s.[Updated]
FROM [usr].[Statement] AS s
JOIN [usr].[Account] AS a
ON 1=1 
    AND s.[idUsers] = a.[idUsers]
    AND s.[idAccount] = a.[idAccount]
JOIN [usr].[File] AS f
ON 1=1 
    AND s.[idUsers] = f.[idUsers]
    AND s.[idImage] = f.[idFile]
