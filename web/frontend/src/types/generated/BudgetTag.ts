export interface BudgetTag {
  idUsers: string | null;
  idBudgetTag: string;
  idBudgetCategory: string | null;
  BudgetTagName: string;
  hasAttributeValue: boolean;
  isIncludedInBudget: unknown;
  isDefaultBudgetTag: unknown | null;
  Created: string;
  Updated: string;
}
