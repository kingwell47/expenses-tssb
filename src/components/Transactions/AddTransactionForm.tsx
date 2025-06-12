import React, { useState } from "react";
import { useTransactionStore } from "../../stores/transactionStore";
import { CATEGORIES } from "../../constants/categories";
import type { CategoryName } from "../../constants/categories";
import type { NewTransaction } from "../../types";

type AddTransactionFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { add, loading, error } = useTransactionStore();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [occurredAt, setOccurredAt] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [note, setNote] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (amount <= 0) {
      setLocalError("Amount must be greater than zero.");
      return;
    }
    if (!type) {
      setLocalError("Type is required.");
      return;
    }

    const tx: NewTransaction = {
      type,
      amount,
      category: category.trim() || null,
      occurred_at: occurredAt,
      note: note.trim() || null,
    };

    try {
      await add(tx);
      onSuccess();
      // reset form
      setType("expense");
      setAmount(0);
      setCategory("");
      setOccurredAt(new Date().toISOString().slice(0, 10));
      setNote("");
    } catch (err: unknown) {
      let message = "Failed to add transaction.";
      if (err instanceof Error) {
        message = err.message;
      }
      setLocalError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="outline">
      {localError && <div style={{ color: "red" }}>{localError}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <label htmlFor="tx-type">Type</label>
        <br />
        <select
          id="tx-type"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          required
          className="select"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label htmlFor="tx-amount">Amount</label>
        <br />
        <input
          id="tx-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
          step="0.01"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="tx-category">Category</label>
        <br />
        <select
          id="tx-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryName)}
          className="select"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tx-date">Date</label>
        <br />
        <input
          id="tx-date"
          type="date"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
          required
          className="input"
        />
      </div>

      <div>
        <label htmlFor="tx-note">Note</label>
        <br />
        <input
          id="tx-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input"
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Adding…" : "Add Transaction"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="btn btn-error"
      >
        Cancel
      </button>
    </form>
  );
};
export default AddTransactionForm;
