import React, { useMemo } from "react";
import type { Transaction } from "../../types";

type KpiCardsProps = {
  transactions: Transaction[];
};

type Stat = {
  title: string;
  value: string | number;
};

const KPICards: React.FC<KpiCardsProps> = ({ transactions }) => {
  // currency formatter (change 'en-US'/'USD' as needed)
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      }),
    []
  );
  const stats: Stat[] = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of transactions) {
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }
    }

    const net = totalIncome - totalExpense;
    const count = transactions.length;

    return [
      {
        title: "Total Income",
        value: currencyFormatter.format(totalIncome),
      },
      {
        title: "Total Expense",
        value: currencyFormatter.format(totalExpense),
      },
      {
        title: "Net Balance",
        value: currencyFormatter.format(net),
      },
      {
        title: "Transactions",
        value: count,
      },
    ];
  }, [transactions, currencyFormatter]);

  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      {stats.map((stat) => (
        <div
          key={stat.title}
          style={{
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <div style={{ fontSize: "14px", marginBottom: "8px" }}>
            {stat.title}
          </div>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
