CREATE FUNCTION [usr].[tvf_ByUser_Statement_Coverage](@idUsers UNIQUEIDENTIFIER)
RETURNS TABLE AS RETURN (
    SELECT
        [idUsers], 
        SUM([isEntered]) AS [TotalDaysEntered],
        COUNT(*) - SUM([isEntered]) AS [TotalDaysNotEntered],
        COUNT(*) AS [TotalAccountDays]
    FROM [usr].[fn_ByDay_Statement_Coverage](@idUsers)
    GROUP BY [idUsers]
)

