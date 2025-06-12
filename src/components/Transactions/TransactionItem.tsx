import React from "react";
import type { MouseEvent } from "react";
import type { Transaction } from "../../types";
import { useTransactionStore } from "../../stores/transactionStore";

type TransactionItemProps = {
  transaction: Transaction;
};

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { remove } = useTransactionStore();

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.confirm("Delete this transaction")) {
      remove(transaction.id);
    }
  };

  return (
    <li className="outline">
      <div>
        <strong>{transaction.type.toUpperCase()}</strong> —{" "}
        {transaction.amount.toFixed(2)}
      </div>
      <div>Date: {new Date(transaction.occurred_at).toLocaleDateString()}</div>
      <div>Category: {transaction.category ?? "None"}</div>
      {transaction.note && <div>Note: {transaction.note}</div>}
      <button onClick={handleDelete} className="btn">
        Delete
      </button>
      <button
        className="btn"
        onClick={() => {
          /* TODO: open edit form/modal and call update */
        }}
      >
        Edit
      </button>
    </li>
  );
};

export default TransactionItem;
