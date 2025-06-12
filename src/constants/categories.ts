export const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Other",
] as const;

export type CategoryName = (typeof CATEGORIES)[number];
