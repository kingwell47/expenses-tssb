import { create } from "zustand";
import type { Expense } from "../types";
import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;

  /**
   * Load all expenses for the current user
   */
  loadExpenses: () => Promise<void>;

  /**
   * Create a new expense
   * @param data – amount, description (optional), category_id (optional), spent_at (ISO string)
   */
  createExpense: (
    data: Omit<Expense, "id" | "created_at" | "user_id">
  ) => Promise<void>;

  /**
   * Edit an existing expense by ID
   * @param id – ID of the expense to update
   * @param updates – Partial fields to update
   */
  editExpense: (
    id: string,
    updates: Partial<Omit<Expense, "id" | "user_id" | "created_at">>
  ) => Promise<void>;

  /**
   * Remove an expense by ID
   * @param id – ID of the expense to delete
   */
  removeExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  loading: false,
  error: null,

  loadExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchExpenses();
      set({ expenses: data, loading: false });
    } catch (err: unknown) {
      let message = "Error loading expenses";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },

  createExpense: async (newExpense) => {
    set({ loading: true, error: null });
    try {
      const created = await addExpense(newExpense);
      set({ expenses: [created, ...get().expenses], loading: false });
    } catch (err: unknown) {
      let message = "Error creating expenses";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },

  editExpense: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateExpense(id, updates);
      set({
        expenses: get().expenses.map((e) => (e.id === id ? updated : e)),
        loading: false,
      });
    } catch (err: unknown) {
      let message = "Error editing expenses";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },

  removeExpense: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteExpense(id);
      set({
        expenses: get().expenses.filter((e) => e.id !== id),
        loading: false,
      });
    } catch (err: unknown) {
      let message = "Error editing expenses";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },
}));
