import { supabase } from "./supabaseClient";
import type { Category } from "../types";

/**
 * Helper: fetch the currently authenticated user via getUser()
 */
async function getCurrentUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Auth error: ${userError.message}`);
  }
  if (!user) {
    throw new Error("Not authenticated");
  }

  return user;
}

/**
 * Fetch all categories for the current user (assuming you added a `user_id` column).
 * If you kept categories global (no user_id), remove the `eq('user_id', user.id)` filter.
 */
export async function fetchCategories(): Promise<Category[]> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
  return data ?? [];
}

/**
 * Insert a new category for the current user.
 * @param name – The name of the new category (e.g. "Groceries", "Transport").
 */
export async function addCategory(name: string): Promise<Category> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      user_id: user.id, // remove this line if your categories are global
    })
    .single();

  if (error) {
    throw new Error(`Failed to add category: ${error.message}`);
  }
  return data;
}

/**
 * Update an existing category’s name.
 * @param id – The UUID of the category to update.
 * @param name – The new name to set.
 */
export async function updateCategory(
  id: string,
  name: string
): Promise<Category> {
  // RLS will ensure the user can only update their own category
  const { data, error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }
  return data;
}

/**
 * Delete a category by its ID.
 * @param id – The UUID of the category to delete.
 */
export async function deleteCategory(id: string): Promise<boolean> {
  // RLS will ensure the user can only delete their own category
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }
  return true;
}
