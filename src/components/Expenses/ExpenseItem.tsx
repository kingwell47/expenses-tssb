import React from "react";
import type { Expense } from "../../types";
import { useExpenseStore } from "../../stores/expenseStore";

interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  const removeExpense = useExpenseStore((state) => state.removeExpense);

  // If you have an edit modal, you can wire it up here.
  const handleDelete = () => {
    if (window.confirm("Delete this expense?")) {
      removeExpense(expense.id);
    }
  };

  return (
    <li>
      <div>
        <span>{new Date(expense.spent_at).toLocaleDateString()}</span>{" "}
        <span>{expense.amount.toFixed(2)}</span>
      </div>
      <div>Category: {expense.category_id ?? "Uncategorized"}</div>
      {expense.description && <div>Description: {expense.description}</div>}
      <button onClick={handleDelete}>Delete</button>
      <button
        onClick={() => {
          /* TODO: open edit modal */
        }}
      >
        Edit
      </button>
    </li>
  );
};

export default ExpenseItem;
