CREATE VIEW [usr].[v_Organization] 
    AS
SELECT 
	o.[idUsers],
	o.[idOrganization],
	o.[OrganizationName],
	o.[Mcc],
    mcc.[RangeStart],
    mcc.[RangeEnd],
    mcc.[RangeDescription],
    mcc.[IsReserved],
    mcc.[IsoDescription],
    mcc.[UsdaDescription],
    mcc.[StripeDescription],
    mcc.[StripeCode],
    mcc.[VisaDescription],
    mcc.[VisaReqClearingName],
    mcc.[AlipayDescription],
    mcc.[MastercardDescription],
    mcc.[MastercardAbbrAirlineName],
    mcc.[AmexDescription]
FROM [usr].[Organization] AS o
LEFT JOIN [dim].[MerchantCategoryCode] AS mcc ON o.[Mcc] = mcc.[Mcc]