export interface TransactionItemTag {
  idUsers: string;
  idAccount: string;
  idStatement: string;
  idTransaction: string;
  idTransactionItem: string;
  idBudgetTag: string;
  Value: string | null;
  hasAttributeValue: unknown;
  Created: string;
  Updated: string;
}
