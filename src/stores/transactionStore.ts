import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Transaction } from "../types";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

/**
 * NewTransaction is everything needed to create a Transaction
 * except the auto‐generated fields.
 */
type NewTransaction = Omit<Transaction, "id" | "user_id" | "created_at">;

interface TransactionSlice {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  /** Load all transactions for a given month (e.g. '2025-06') */
  load: (month: string) => Promise<void>;
  /** Add a new transaction */
  add: (tx: NewTransaction) => Promise<void>;
  /** Update an existing transaction */
  update: (tx: Transaction) => Promise<void>;
  /** Remove a transaction by its ID */
  remove: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionSlice>()(
  persist(
    immer((set) => ({
      transactions: [],
      loading: false,
      error: null,

      load: async (month) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });
        try {
          const data = await fetchTransactions(month);
          set((state) => {
            state.transactions = data;
            state.loading = false;
          });
        } catch (err: unknown) {
          let message = "Error loading transactions";
          if (err instanceof Error) {
            message = err.message;
          }
          set((state) => {
            state.error = message;
            state.loading = false;
          });
        }
      },

      add: async (tx) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });
        try {
          const created = await addTransaction(tx);
          set((state) => {
            state.transactions.unshift(created);
            state.loading = false;
          });
        } catch (err: unknown) {
          let message = "Error adding transaction";
          if (err instanceof Error) {
            message = err.message;
          }
          set((state) => {
            state.error = message;
            state.loading = false;
          });
        }
      },

      update: async (tx) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });
        try {
          const updated = await updateTransaction(tx);
          set((state) => {
            const idx: number = state.transactions.findIndex(
              (t: Transaction) => t.id === updated.id
            );
            if (idx !== -1) state.transactions[idx] = updated;
            state.loading = false;
          });
        } catch (err: unknown) {
          let message = "Error updating transaction";
          if (err instanceof Error) {
            message = err.message;
          }
          set((state) => {
            state.error = message;
            state.loading = false;
          });
        }
      },

      remove: async (id) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });
        try {
          await deleteTransaction(id);
          set((state) => {
            state.transactions = state.transactions.filter(
              (t: Transaction) => t.id !== id
            );
            state.loading = false;
          });
        } catch (err: unknown) {
          let message = "Error removing transaction";
          if (err instanceof Error) {
            message = err.message;
          }
          set((state) => {
            state.error = message;
            state.loading = false;
          });
        }
      },
    })),
    {
      name: "transaction-store", // localStorage key
      version: 2, // bump this whenever shape changes
      migrate: (state, ver) => {
        if (ver !== 2) {
          // drop old state
          return { transactions: [], loading: false, error: null };
        }
        return state;
      },
    }
  )
);
