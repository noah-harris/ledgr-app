CREATE OR ALTER TRIGGER [usr].[trg_BudgetTag_UniqueName]
ON [usr].[BudgetTag]
AFTER INSERT, UPDATE
AS
IF EXISTS (
    SELECT NULL
    FROM [inserted] AS i
    JOIN [usr].[BudgetTag] AS t
    ON 1=1
        AND t.[BudgetTagName] = i.[BudgetTagName]
        AND t.[idBudgetTag] <> i.[idBudgetTag]
        AND ISNULL(t.[idUsers], i.[idUsers]) = ISNULL(i.[idUsers], t.[idUsers])
    )
    THROW 50001, 'Tag name conflicts with a base tag.', 1;