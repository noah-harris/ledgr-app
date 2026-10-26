CREATE VIEW [usr].[v_Payee]
    AS
SELECT 
    p.[idUsers],
    p.[idPayee],

    CAST(CASE
        WHEN p.[PayeeType] = 'ORGANIZATION' THEN o.[OrganizationName]
        WHEN p.[PayeeType] = 'ACCOUNT' THEN a.[OrganizationName] + ' '  + REPLACE(a.[AccountSubTypeName], '_', ' ') + ' ' + a.[AccountName]
        WHEN p.[PayeeType] = 'CONTACT' THEN c.[FirstName] + ' ' + c.[LastName]
    END AS NVARCHAR(MAX)) AS [PayeeName],

    p.[PayeeType],

    CAST(CASE
        WHEN p.[PayeeType] = 'ORGANIZATION' THEN o.[Created]
        WHEN p.[PayeeType] = 'ACCOUNT' THEN a.[Created]
        WHEN p.[PayeeType] = 'CONTACT' THEN c.[Created]
    END AS DATETIME2(0)) AS [Created],

    CAST(CASE
        WHEN p.[PayeeType] = 'ORGANIZATION' THEN o.[Updated]
        WHEN p.[PayeeType] = 'ACCOUNT' THEN a.[Updated]
        WHEN p.[PayeeType] = 'CONTACT' THEN c.[Updated]
    END AS DATETIME2(0)) AS [Updated]
FROM [usr].[Payee] AS p
LEFT JOIN [usr].[v_Account] AS a
ON 1=1 
    AND p.[idUsers] = a.[idUsers] 
    AND p.[idPayee] = a.[idAccount]
LEFT JOIN [usr].[Organization] AS o
ON 1=1 
    AND p.[idUsers] = o.[idUsers] 
    AND p.[idPayee] = o.[idOrganization]
LEFT JOIN [usr].[Contact] AS c
ON 1=1 
    AND p.[idUsers] = c.[idUsers] 
    AND p.[idPayee] = c.[idContact]
