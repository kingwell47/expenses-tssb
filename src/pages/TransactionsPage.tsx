import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useTransactionStore } from "../stores/transactionStore";
import TransactionItem from "../components/Transactions/TransactionItem";
import AddTransactionForm from "../components/Transactions/AddTransactionForm";
import type { Transaction } from "../types";
import EditTransactionForm from "../components/Transactions/EditTransactionForm";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/categories";

const TransactionsPage: React.FC = () => {
  // Zustand states
  const { transactions, loading, error, load } = useTransactionStore();

  // Controls
  // default to current year‐month (e.g. "2025-06")
  const [month, setMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>(""); // '' = All
  const [searchTerm, setSearchTerm] = useState<string>(""); // for note search

  // Show/Hide add form:
  const [showAdd, setShowAdd] = useState(false);

  // Currently editing transaction (if any)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Load whenever month changes
  useEffect(() => {
    load(month);
  }, [load, month]);

  // build category options based on typeFilter
  const categoryOptions =
    typeFilter === "expense"
      ? EXPENSE_CATEGORIES
      : typeFilter === "income"
      ? INCOME_CATEGORIES
      : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  // filter out any nulls just in case
  const safeTransactions = transactions.filter(
    (tx): tx is NonNullable<typeof tx> => tx != null
  );

  // Client-side filtering by category AND searchTerm in note
  const filtered = safeTransactions
    .filter((tx) => (typeFilter === "all" ? true : tx.type === typeFilter))
    .filter((tx) => categoryFilter === "" || tx.category === categoryFilter)
    .filter(
      (tx) =>
        searchTerm === "" ||
        (tx.note?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );

  // Handlers
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(e.target.value);
  };
  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as "all" | "income" | "expense");
    setCategoryFilter(""); // reset category when type changes
  };
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setCategoryFilter(e.target.value);
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  // Show add transaction
  const handleAddClick = () => setShowAdd(true);
  const handleAddCancel = () => setShowAdd(false);
  const handleAddSuccess = async () => {
    setShowAdd(false);
    await load(month);
  };

  // Show Editing form
  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
  };
  const handleEditCancel = () => setEditingTx(null);
  const handleEditSaved = async () => {
    setEditingTx(null);
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
          className="input"
        />
        {/* Type filter */}
        <label htmlFor="type-filter" style={{ marginLeft: 16 }}>
          Type:
        </label>{" "}
        <select
          id="type-filter"
          value={typeFilter}
          onChange={handleTypeChange}
          className="select"
        >
          <option value="all">All</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {/* Category filter */}
        <label htmlFor="category-filter" style={{ marginLeft: 16 }}>
          Category:
        </label>{" "}
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="select"
        >
          <option value="">All</option>
          {categoryOptions.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {/* Search box for notes */}
        <label htmlFor="search" style={{ marginLeft: 16 }}>
          Search Notes:
        </label>{" "}
        <input
          id="search"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input"
        />
      </div>

      {/* Loading / error / empty state */}
      {loading && <div>Loading transactions…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && transactions.length === 0 && (
        <div>No transactions found.</div>
      )}

      <ul className="outline">
        {filtered.map((tx) => (
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
