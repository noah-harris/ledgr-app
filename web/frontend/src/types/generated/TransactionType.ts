export interface TransactionType {
  idTransactionType: string;
  Scope: string;
  Cashflow: string;
  isCashflowInName: boolean;
  Action: string;
  isActionInName: boolean;
  Target: string;
  isTargetInName: boolean;
  TransactionTypeName: string | null;
  requireTransactionItems: boolean;
  Description: string;
  Sign: number | null;
  Created: string;
  Updated: string;
}
