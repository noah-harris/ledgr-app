CREATE VIEW [usr].[v_Account] 
    AS
SELECT
	a.[idUsers],
	a.[idAccount],
	t.[idAccountType],
	st.[idAccountSubType],
	c.[idCurrency],
	a.[idImage],
	a.[AccountName],
	a.[StartDate],
	a.[EndDate],
	a.[LoginPage],
	o.[OrganizationName],
	o.[Mcc],
	t.[AccountTypeName],
	st.[AccountSubTypeName],
	st.[Description],
	t.[isCredit],
	t.[isSpendable],
	c.[Symbol],
	c.[CurrencyName],
	c.[CurrencyNamePlural],
	f.[FullFileName],
	f.[DownloadEndpoint],
	f.[FileSizeBytes],
	a.[Created],
	a.[Updated]
FROM [usr].[Account] AS a
JOIN [enum].[AccountSubType] AS st ON a.[idAccountSubType] = st.[idAccountSubType]
JOIN [enum].[AccountType] AS t ON st.[idAccountType] = t.[idAccountType]
JOIN [usr].[Organization] AS o ON a.[idUsers] = o.[idUsers] AND a.[idOrganization] = o.[idOrganization] 
LEFT JOIN [usr].[File] AS f ON f.[idUsers] = a.[idUsers] AND f.[idFile] = a.[idImage]
JOIN [dim].[Currency] AS c ON a.[idCurrency] = c.[idCurrency]