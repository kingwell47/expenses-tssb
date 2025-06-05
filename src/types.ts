export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  description: string | null;
  spent_at: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  // add extra fields if needed
}
