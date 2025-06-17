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

  // 1) Helper that returns exactly the last 6 month codes *and* labels
  const getLastSixMonths = (): { code: string; label: string }[] => {
    const now = new Date();
    const months: { code: string; label: string }[] = [];

    for (let i = 5; i >= 0; i--) {
      // Make a date for the 1st of that month
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

      // Build “YYYY-MM” without toISOString
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;
      const code = `${year}-${String(monthNum).padStart(2, "0")}`;

      // Build “Jun”, “Jul”, etc.
      const label = d.toLocaleString("default", { month: "short" });

      months.push({ code, label });
    }

    return months;
  };

  // 2) Plug that into your trendData mapping
  const trendData: TrendData[] = getLastSixMonths().map(({ code, label }) => {
    // Filter exactly this month
    const monthTx = transactions.filter(
      (tx) => tx.occurred_at.slice(0, 7) === code
    );

    const spent = monthTx
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const income = monthTx
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return { month: label, spent, income };
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
