CREATE TABLE [dim].[MerchantCategoryCode] (
    [Mcc] CHAR(4) NOT NULL,
    [RangeStart] CHAR(4) NOT NULL,
    [RangeEnd] CHAR(4) NOT NULL,
    [RangeDescription] VARCHAR(200) NULL,
    [IsReserved] BIT NOT NULL,
    [IsoDescription] VARCHAR(400) NULL,
    [UsdaDescription] VARCHAR(400) NULL,
    [StripeDescription] VARCHAR(400) NULL,
    [StripeCode] VARCHAR(100) NULL,
    [VisaDescription] VARCHAR(400) NULL,
    [VisaReqClearingName] VARCHAR(200) NULL,
    [AlipayDescription] VARCHAR(400) NULL,
    [MastercardDescription] VARCHAR(400) NULL,
    [MastercardAbbrAirlineName] VARCHAR(200) NULL,
    [AmexDescription] VARCHAR(400) NULL,
    CONSTRAINT [PK_IsoMcc] PRIMARY KEY CLUSTERED ([Mcc])
);
