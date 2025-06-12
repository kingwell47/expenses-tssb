import React, { useEffect } from "react";
import { useExpenseStore } from "../stores/expenseStore";
import ExpenseList from "../components/Expenses/ExpenseList";
import AddExpenseForm from "../components/Expenses/AddExpenseForm";

const ExpensesPage: React.FC = () => {
  const { loadExpenses, loading, error } = useExpenseStore();

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return (
    <div>
      <h1>Expenses</h1>
      {loading && <div>Loading expenses…</div>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <ExpenseList />}
      <AddExpenseForm />
    </div>
  );
};

export default ExpensesPage;
