import React, { useEffect, useState } from "react";
import { useTransactionStore } from "../stores/transactionStore";
import TransactionItem from "../components/Transactions/TransactionItem";
import AddTransactionForm from "../components/Transactions/AddTransactionForm";

const TransactionsPage: React.FC = () => {
  const { transactions, loading, error, load } = useTransactionStore();

  // default to current year‐month (e.g. "2025-06")
  const [month, setMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

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
          <TransactionItem key={tx.id} transaction={tx} />
        ))}
      </ul>
      <AddTransactionForm />
    </div>
  );
};

export default TransactionsPage;
