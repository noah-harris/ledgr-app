export interface TransactionType {
  idTransactionType: string;
  TransactionTypeName: string;
  Scope: string;
  Cashflow: string;
  isPositive: unknown | null;
  isItemEntryRequired: boolean | null;
  Description: string;
  Created: string;
  Updated: string;
}
