export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Bonus",
  "Investment",
  "Gift",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type CategoryName = ExpenseCategory | IncomeCategory;
