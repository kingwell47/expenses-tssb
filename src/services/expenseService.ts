import { supabase } from "./supabaseClient";
import type { Expense } from "../types";

export async function fetchExpenses(): Promise<Expense[]> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error getting session:", sessionError);
    throw new Error(sessionError.message);
  }
  if (!session) {
    throw new Error("Not authenticated");
  }

  const userId = session.user.id;
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("spent_at", { ascending: false });
  if (error) {
    console.error("Error fetching expenses:", error);
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function addExpense(
  expense: Omit<Expense, "id" | "created_at" | "user_id">
) {
  const { data, error } = await supabase
    .from("expenses")
    .insert({ ...expense })
    .single();
  if (error) throw error;
  return data;
}

export async function updateExpense(id: string, updates: Partial<Expense>) {
  const { data, error } = await supabase
    .from("expenses")
    .update(updates)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
  return true;
}
