import React, { useEffect } from "react";
import { useExpenseStore } from "../stores/expenseStore";
import ExpenseList from "../components/Expenses/ExpenseList";

const ExpensesPage: React.FC = () => {
  const { loadExpenses, expenses, loading, error } = useExpenseStore();

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return (
    <div>
      <h1>Expenses</h1>

      {loading && <p>Loading expenses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && <ExpenseList />}
    </div>
  );
};

export default ExpensesPage;
