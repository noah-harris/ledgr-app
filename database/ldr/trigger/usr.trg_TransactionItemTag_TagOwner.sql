CREATE OR ALTER TRIGGER [usr].[trg_TransactionItemTag_TagOwner]
ON [usr].[TransactionItemTag]
AFTER INSERT, UPDATE
AS
IF EXISTS (
    SELECT 1
    FROM [inserted] i
    JOIN [usr].[BudgetTag] t ON t.[idBudgetTag] = i.[idBudgetTag]
    WHERE 1=1 
        AND t.[idUsers] IS NOT NULL
        AND t.[idUsers] <> i.[idUsers]
)
    THROW 50002, 'Budget tag belongs to another user.', 1;