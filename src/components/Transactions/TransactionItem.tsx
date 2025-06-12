import React, { useState } from "react";
import type { MouseEvent } from "react";
import type { Transaction } from "../../types";
import { useTransactionStore } from "../../stores/transactionStore";

type TransactionItemProps = {
  transaction: Transaction;
  onEdit?: () => void;
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
}) => {
  const { remove } = useTransactionStore();

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.confirm("Delete this transaction")) {
      remove(transaction.id);
    }
  };

  return (
    <div className="outline">
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
      {onEdit && (
        <button onClick={onEdit} className="btn">
          Edit
        </button>
      )}
    </div>
  );
};

export default TransactionItem;
