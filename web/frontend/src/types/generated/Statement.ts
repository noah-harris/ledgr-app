export interface Statement {
  idUsers: string;
  idAccount: string;
  idStatement: string;
  idImage: string | null;
  StatementDate: string;
  StartDate: string;
  EndDate: string;
  StartBalance: number;
  EndBalance: number;
  hasImage: unknown;
  Created: string;
  Updated: string;
}
