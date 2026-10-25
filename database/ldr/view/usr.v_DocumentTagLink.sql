CREATE VIEW [usr].[v_DocumentTagLink] 
    AS
SELECT 
	dtl.[idUsers],
	dtl.[idDocument],
	dtl.[idDocumentTag],
	dt.[DocumentTagName],
	dt.[isDefaultDocumentTag],
	dtl.[Created],
	dtl.[Updated]
FROM [usr].[DocumentTagLink] AS dtl
JOIN [usr].[DocumentTag] AS dt 
ON 1=1
    AND [dt].[idDocumentTag] = dtl.[idDocumentTag] 