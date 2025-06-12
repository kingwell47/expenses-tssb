import { supabase } from "./supabaseClient";
import type { Transaction, NewTransaction } from "../types";

/**
 * Fetch all transactions for a specific month (YYYY-MM).
 */

export async function fetchTransactions(month: string): Promise<Transaction[]> {
  // Get current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw new Error(sessionError.message);
  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;

  // Month-range filter
  const [year, mon] = month.split("-").map(Number);
  const monthStart = `${month}-01`;
  const nextMonth =
    mon === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(mon + 1).padStart(2, "0")}-01`;

  // Query Supabase
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .gte("occurred_at", monthStart)
    .lt("occurred_at", nextMonth)
    .order("occurred_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Add a new transaction for the signed-in user.
 */
export async function addTransaction(tx: NewTransaction): Promise<Transaction> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  if (!session) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...tx, user_id: session.user.id })
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Update an existing transaction.
 */
export async function updateTransaction(tx: Transaction): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      occurred_at: tx.occurred_at,
      note: tx.note,
    })
    .eq("id", tx.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Delete a transaction by ID.
 */
export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
