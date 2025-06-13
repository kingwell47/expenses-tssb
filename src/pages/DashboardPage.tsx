import React, { useEffect } from "react";
import SnapshotCards from "../components/Dashboard/SnapshotCards";
import Charts from "../components/Dashboard/Charts";
import RecentActivityList from "../components/Dashboard/RecentActifivitesList";
import { useTransactionStore } from "../stores/transactionStore";
import type { KPI, CategoryData, TrendData } from "../types";

const DashboardPage: React.FC = () => {
  const { transactions, load, loading, error } = useTransactionStore();

  useEffect(() => {
    // Load current month (e.g. '2025-06')
    const month = new Date().toISOString().slice(0, 7);
    load(month);
  }, [load]);

  // Compute Snapshot KPI values
  const totalSpent = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const netBalance = totalIncome - totalSpent;
  const daysElapsed = new Date().getDate();
  const averageDailySpend = daysElapsed > 0 ? totalSpent / daysElapsed : 0;
  const unsyncedQueue = 0; // TODO: replace with real offline queue length

  const kpiData: KPI[] = [
    {
      label: "Total Spent (This Month)",
      value: `₱${totalSpent.toLocaleString()}`,
    },
    {
      label: "Total Income (This Month)",
      value: `₱${totalIncome.toLocaleString()}`,
    },
    { label: "Net Balance", value: `₱${netBalance.toLocaleString()}` },
    { label: "Average Daily Spend", value: `₱${averageDailySpend.toFixed(2)}` },
    { label: "Unsynced Queue", value: unsyncedQueue },
  ];

  // Prepare recent activities (last 5)
  const recentActivities = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)
    .map((tx) => ({
      id: tx.id,
      title: tx.note ?? tx.category ?? "",
      category: tx.category ?? "",
      amount: `₱${tx.amount.toLocaleString()}`,
      date: tx.created_at.slice(0, 10),
    }));

  // Category Data (for current month)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const rawCategoryTotals = transactions
    .filter(
      (tx) =>
        tx.created_at.slice(0, 7) === currentMonth &&
        tx.category !== null &&
        tx.category !== undefined
    )
    .reduce<Record<string, number>>((acc, tx) => {
      if (tx.category !== null && tx.category !== undefined) {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      }
      return acc;
    }, {});

  const categoryData: CategoryData[] = Object.entries(rawCategoryTotals).map(
    ([category, amount]) => ({ category, amount })
  );

  // Trend Data (last 6 months)
  const getLastSixMonths = (): string[] => {
    const months: string[] = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(d.toISOString().slice(0, 7));
    }
    return months;
  };

  const trendData: TrendData[] = getLastSixMonths().map((month) => {
    const monthTx = transactions.filter(
      (tx) => tx.created_at.slice(0, 7) === month
    );
    const spent = monthTx
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const income = monthTx
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    // Format month label, e.g. 'Jun'
    const monthLabel = new Date(`${month}-01`).toLocaleString("default", {
      month: "short",
    });
    return { month: monthLabel, spent, income };
  });

  return (
    <div>
      {loading && <p>Loading dashboard...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <SnapshotCards data={kpiData} />

          {/* TODO: Update VisualSummaries to accept real data props */}
          <Charts categoryData={categoryData} trendData={trendData} />

          {/* TODO: Update RecentActivityList to accept `transactions` prop */}
          <RecentActivityList data={recentActivities} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
