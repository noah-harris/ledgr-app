CREATE TABLE [dim].[CurrencyExchange] (
    [idCurrencyFrom] UNIQUEIDENTIFIER NOT NULL,
    [idCurrencyTo] UNIQUEIDENTIFIER NOT NULL,
    [Date] DATE NOT NULL,
    [ExchangeRate] FLOAT NOT NULL,
    [Created] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    [Updated] DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY ([idCurrencyFrom], [idCurrencyTo], [Date]),
    CONSTRAINT [FK_CurrencyExchange_FromCurrency] FOREIGN KEY ([idCurrencyFrom]) REFERENCES [dim].[Currency]([idCurrency]),
    CONSTRAINT [FK_CurrencyExchange_ToCurrency] FOREIGN KEY ([idCurrencyTo]) REFERENCES [dim].[Currency]([idCurrency])
);