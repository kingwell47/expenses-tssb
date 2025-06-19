import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Transaction } from "../../types";

type SpendingByCategoryProps = {
  transactions: Transaction[];
};

const SpendingByCategory: React.FC<SpendingByCategoryProps> = ({
  transactions,
}) => {
  // 1. Aggregate totals per category (expenses only)
  const data = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const tx of transactions) {
      if (tx.type !== "expense") continue;
      const cat = tx.category || "Other";
      totals[cat] = (totals[cat] || 0) + tx.amount;
    }
    return Object.entries(totals).map(([category, total]) => ({
      category,
      total,
    }));
  }, [transactions]);

  if (data.length === 0) {
    return <div>No expense data in this range to chart.</div>;
  }

  return (
    <div style={{ width: "100%", height: 300, marginBottom: 24 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 16, right: 24, left: 0, bottom: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip formatter={(value: number) => value.toFixed(2)} />
          <Bar dataKey="total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingByCategory;
