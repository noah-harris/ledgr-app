CREATE FUNCTION [usr].[tvf_ByAccount_LatestStatement](@idUsers UNIQUEIDENTIFIER)
RETURNS TABLE
AS
RETURN
(   
    SELECT *
    FROM (
        SELECT 
            *,
            ROW_NUMBER() OVER (PARTITION BY [idUsers], [idAccount] ORDER BY [EndDate] DESC) AS [idx]
        FROM [usr].[v_Statement]
        WHERE [idUsers] = @idUsers
    ) AS s
    WHERE [idx] = 1
)