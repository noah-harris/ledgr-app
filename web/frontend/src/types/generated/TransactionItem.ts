export interface TransactionItem {
  idUsers: string;
  idAccount: string;
  idStatement: string;
  idTransaction: string;
  idTransactionItem: string;
  idTransactionItemType: string;
  idCurrency: string;
  idQuantityUnit: string | null;
  ItemName: string;
  ItemDescription: string | null;
  Amount: number;
  Quantity: number | null;
  Created: string;
  Updated: string;
}
