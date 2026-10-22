CREATE VIEW [usr].[v_DocumentTagLink] 
    AS
SELECT 
	dtl.[idUsers],
	dtl.[idDocument],
	dtl.[idDocumentTag],
	dt.[DocumentTagName],
	dtl.[Value],
	dt.[isDefaultDocumentTag],
	dt.[hasAttributeValue],
	dtl.[Created],
	dtl.[Updated]
FROM [usr].[DocumentTagLink] AS dtl
JOIN [usr].[DocumentTag] AS dt 
ON 1=1
    AND [dt].[idDocumentTag] = dtl.[idDocumentTag] 