CREATE VIEW [usr].[v_DocumentTag] 
    AS
SELECT 
	dt.[idUsers],
	dt.[idDocument],
	dt.[idFileTag],
	ft.[FileTagName],
	dt.[Value],
	ft.[isDefaultFileTag],
	dt.[Created],
	dt.[Updated]
FROM [usr].[DocumentTag] AS dt 
JOIN [usr].[FileTag] AS ft 
ON 1=1
    AND [ft].[idFileTag] = dt.[idFileTag] 
