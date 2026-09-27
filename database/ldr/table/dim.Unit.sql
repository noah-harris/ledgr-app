CREATE TABLE [dim].[Unit] (
    [idUnit] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [UnitType] VARCHAR(100) NOT NULL,
    [Symbol] NVARCHAR(15) NOT NULL,
    [UnitAbbreviation] VARCHAR(10) NOT NULL,
    [UnitName] VARCHAR(50) NOT NULL,
    [UnitNamePlural] VARCHAR(50) NOT NULL,
    [ConversionFactor] FLOAT NOT NULL,
    [isBaseUnit] AS CAST(CASE WHEN [ConversionFactor] = 1 THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [isCurrency] AS CAST(CASE WHEN [UnitType] = 'CURRENCY' THEN 1 ELSE 0 END AS BIT) PERSISTED,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_unit_UnitType] FOREIGN KEY ([UnitType]) REFERENCES [dim].[UnitType]([UnitType]),
    CONSTRAINT [UQ_Unit_Symbol] UNIQUE ([Symbol]),
    CONSTRAINT [UQ_Unit_nameUnit] UNIQUE ([UnitName]),
    CONSTRAINT [UQ_BaseUnit] UNIQUE ([UnitType], [isBaseUnit])
)

