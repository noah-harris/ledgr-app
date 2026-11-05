export interface StatementSummaryView {
  idUsers: string;
  idAccount: string;
  idStatement: string;
  idImage: string | null;
  StatementDate: string;
  StartDate: string;
  EndDate: string;
  PeriodLength: number | null;
  StartBalance: number;
  EndBalance: number;
  BalanceChange: number | null;
  AmountWithdrawn: number | null;
  AmountDeposited: number | null;
  TotalWithdrawals: number | null;
  TotalDeposits: number | null;
  TotalTransactions: number | null;
  Created: string;
  Updated: string;
}
