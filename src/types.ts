import type { User as SupabaseUser } from "@supabase/supabase-js";

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

export interface User extends SupabaseUser {
  user_metadata: {
    displayName?: string; // optional, since not every sign-in flow might set it
    [key: string]: unknown; // allow for any other metadata fields Supabase might send
  };
}

export interface AppUser {
  id: string;
  email: string;
  displayName: string; // make this required if you always collect it at signup
}

export interface Transaction {
  id: string;
  user_id: string;
  type: "income" | "expense"; // enum: income or expense
  amount: number; // stored as numeric(10,2)
  category: string | null; // free-text category
  occurred_at: string; // ISO timestamp of when it happened
  note: string | null; // optional notes
  created_at: string; // ISO timestamp of creation
}

/** Payload for creating a new transaction */
export type NewTransaction = Omit<Transaction, "id" | "user_id" | "created_at">;
