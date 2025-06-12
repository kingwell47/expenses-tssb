import React, { useEffect, useState } from "react";
import { useTransactionStore } from "../stores/transactionStore";
import TransactionItem from "../components/Transactions/TransactionItem";
import AddTransactionForm from "../components/Transactions/AddTransactionForm";
import type { Transaction } from "../types";
import EditTransactionForm from "../components/Transactions/EditTransactionForm";

const TransactionsPage: React.FC = () => {
  const { transactions, loading, error, load } = useTransactionStore();

  // default to current year‐month (e.g. "2025-06")
  const [month, setMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // Show/Hide add form:
  const [showAdd, setShowAdd] = useState(false);

  // Currently editing transaction (if any)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  useEffect(() => {
    load(month);
  }, [load, month]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(e.target.value);
  };

  // filter out any nulls just in case
  const safeTransactions = transactions.filter(
    (tx): tx is NonNullable<typeof tx> => tx != null
  );

  const handleAddClick = () => setShowAdd(true);
  const handleAddCancel = () => setShowAdd(false);
  const handleAddSuccess = async () => {
    setShowAdd(false);
    await load(month);
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
  };
  const handleEditCancel = () => setEditingTx(null);
  const handleEditSaved = async () => {
    setEditingTx(null);
    // store.update already updated the list, but if you want fresh:
    await load(month);
  };

  return (
    <div>
      <h1>Transactions for {month}</h1>

      <div>
        <label htmlFor="month">Month: </label>
        <input
          id="month"
          type="month"
          value={month}
          onChange={handleMonthChange}
        />
      </div>

      {loading && <div>Loading transactions…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && transactions.length === 0 && (
        <div>No transactions found.</div>
      )}

      <ul className="outline">
        {safeTransactions.map((tx) => (
          <li key={tx.id}>
            {editingTx?.id === tx.id ? (
              <EditTransactionForm
                transaction={tx}
                onCancel={handleEditCancel}
                onSaved={handleEditSaved}
              />
            ) : (
              <TransactionItem
                transaction={tx}
                onEdit={() => handleEditClick(tx)}
              />
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleAddClick} className="btn btn-primary">
        Add Transaction
      </button>
      {showAdd && (
        <AddTransactionForm
          onSuccess={handleAddSuccess}
          onCancel={handleAddCancel}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
