// src/components/Transactions/EditTransactionForm.tsx

import React, { useState } from "react";
import { useTransactionStore } from "../../stores/transactionStore";
import type { Transaction } from "../../types";

type EditTransactionFormProps = {
  transaction: Transaction;
  onCancel?: () => void;
  onSaved?: () => void;
};

const EditTransactionForm: React.FC<EditTransactionFormProps> = ({
  transaction,
  onCancel,
  onSaved,
}) => {
  const { update, loading, error } = useTransactionStore();

  const [type, setType] = useState<"income" | "expense">(transaction.type);
  const [amount, setAmount] = useState<number>(transaction.amount);
  const [category, setCategory] = useState<string>(transaction.category ?? "");
  const [occurredAt, setOccurredAt] = useState<string>(
    transaction.occurred_at.slice(0, 10)
  );
  const [note, setNote] = useState<string>(transaction.note ?? "");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (amount <= 0) {
      setLocalError("Amount must be greater than zero.");
      return;
    }

    const updatedTx: Transaction = {
      ...transaction,
      type,
      amount,
      category: category.trim() || null,
      occurred_at: occurredAt,
      note: note.trim() || null,
    };

    try {
      await update(updatedTx);
      if (onSaved) onSaved();
    } catch (err: unknown) {
      let message = "Failed to update transaction.";
      if (err instanceof Error) {
        message = err.message;
      }
      setLocalError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {localError && <div style={{ color: "red" }}>{localError}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <label htmlFor="edit-tx-type">Type</label>
        <br />
        <select
          id="edit-tx-type"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label htmlFor="edit-tx-amount">Amount</label>
        <br />
        <input
          id="edit-tx-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor="edit-tx-category">Category</label>
        <br />
        <input
          id="edit-tx-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="edit-tx-date">Date</label>
        <br />
        <input
          id="edit-tx-date"
          type="date"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="edit-tx-note">Note</label>
        <br />
        <input
          id="edit-tx-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save Changes"}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default EditTransactionForm;
