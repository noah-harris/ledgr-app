export interface BudgetTag {
  idUsers: string | null;
  idBudgetTag: string;
  idBudgetCategory: string | null;
  BudgetTagName: string;
  isIncludedInBudget: boolean | null;
  isDefaultBudgetTag: boolean | null;
  Created: string;
  Updated: string;
}
