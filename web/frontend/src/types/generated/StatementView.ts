export interface StatementView {
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
  Created: string;
  Updated: string;
}
