export interface BudgetTag {
  idUsers: string | null;
  idBudgetTag: string;
  idBudgetCategory: string | null;
  BudgetTagName: string;
  isIncludedInBudget: unknown;
  isDefaultBudgetTag: unknown | null;
  Created: string;
  Updated: string;
}
