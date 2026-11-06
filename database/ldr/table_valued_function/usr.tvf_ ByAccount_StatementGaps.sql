CREATE FUNCTION [usr].[tvf_ByAccount_StatementGaps](@idUsers UNIQUEIDENTIFIER)
RETURNS TABLE
AS
RETURN
(   
    WITH CTE AS (
        SELECT 
            *, 
            [EndDate] AS [GapStartDate],
            LEAD([StartDate], 1, GETDATE()) OVER (PARTITION BY [idAccount] ORDER BY [StartDate]) AS [GapEndDate]
        FROM usr.[Statement] AS s

    )
    SELECT [idUsers], [idAccount], [GapStartDate], [GapEndDate]
    FROM CTE
    WHERE 1=1 
        AND [idUsers] = @idUsers
        AND DATEADD(SECOND, 1, [GapStartDate]) != [GapEndDate]
)