import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useTransactionStore } from "../stores/transactionStore";
import TransactionItem from "../components/Transactions/TransactionItem";
import AddTransactionForm from "../components/Transactions/AddTransactionForm";
import type { Transaction } from "../types";
import EditTransactionForm from "../components/Transactions/EditTransactionForm";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/categories";

// Helpers to compute first/last day of current month
const today = new Date();
const YYYY = today.getFullYear();
const MM = String(today.getMonth() + 1).padStart(2, "0");
const firstOfMonth = `${YYYY}-${MM}-01`;
const lastOfMonth = new Date(YYYY, today.getMonth() + 1, 0)
  .toISOString()
  .slice(0, 10);

const TransactionsPage: React.FC = () => {
  // Zustand states
  const { transactions, loading, error, loadRange } = useTransactionStore();

  // Controls
  const [startDate, setStartDate] = useState<string>(firstOfMonth);
  const [endDate, setEndDate] = useState<string>(lastOfMonth);
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
    if (startDate && endDate) {
      loadRange(startDate, endDate);
    }
  }, [loadRange, startDate, endDate]);

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
  const onStartChange = (e: ChangeEvent<HTMLInputElement>) =>
    setStartDate(e.target.value);
  const onEndChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEndDate(e.target.value);
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
    await loadRange(startDate, endDate);
  };

  // Show Editing form
  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
  };
  const handleEditCancel = () => setEditingTx(null);
  const handleEditSaved = async () => {
    setEditingTx(null);
    await loadRange(startDate, endDate);
  };

  return (
    <div>
      <h1>
        Transactions from {startDate} to {endDate}
      </h1>

      <div>
        {/* Date-range filters */}
        <label>From: </label>
        <input
          type="date"
          value={startDate}
          onChange={onStartChange}
          className="input"
        />
        <label style={{ marginLeft: 16 }}>To: </label>
        <input
          type="date"
          value={endDate}
          onChange={onEndChange}
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
