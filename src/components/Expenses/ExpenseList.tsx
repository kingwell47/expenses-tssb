import React from "react";
import ExpenseItem from "./ExpenseItem";
import { useExpenseStore } from "../../stores/expenseStore";

const ExpenseList: React.FC = () => {
  const { expenses } = useExpenseStore();

  if (expenses.length === 0) {
    return <div>No expenses found.</div>;
  }

  return (
    <ul>
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </ul>
  );
};

export default ExpenseList;
