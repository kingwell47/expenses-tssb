import React, { useEffect, useMemo } from "react";
import SnapshotCards from "../components/Dashboard/SnapshotCards";
import RecentActivityList from "../components/Dashboard/RecentActifivitesList";
import { useTransactionStore } from "../stores/transactionStore";
import type { KPI } from "../types";
import DashboardCharts from "../components/Dashboard/DashboardCharts";

// Helper: get last six month codes ['YYYY-MM']
const getLastSixMonths = (): string[] => {
  const months: string[] = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(dt.toISOString().slice(0, 7));
  }
  return months;
};

const DashboardPage: React.FC = () => {
  const { transactions, loadRange, loading, error } = useTransactionStore();

  // Load all transactions for the last 6 months on mount
  useEffect(() => {
    const today = new Date();
    const endDate = today.toISOString().slice(0, 10); // YYYY-MM-DD
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const startDate = sixMonthsAgo.toISOString().slice(0, 10);
    loadRange(startDate, endDate);
  }, [loadRange]);

  // Filter transactions for current month
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const monthTx = useMemo(
    () =>
      transactions.filter((tx) => tx.occurred_at.slice(0, 7) === currentMonth),
    [transactions, currentMonth]
  );

  console.log(monthTx);

  // Compute KPI metrics
  const totalSpent = useMemo(
    () =>
      monthTx
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [monthTx]
  );
  const totalIncome = useMemo(
    () =>
      monthTx
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [monthTx]
  );
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

  // Data for Category Breakdown
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    monthTx
      .filter((tx) => tx.category !== null)
      .forEach((tx) => {
        // TypeScript now knows tx.category is not null
        totals[tx.category as string] =
          (totals[tx.category as string] || 0) + tx.amount;
      });
    return Object.entries(totals).map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [monthTx]);

  // Income vs Expense trend for last 6 months
  const trendData = useMemo(() => {
    const months = getLastSixMonths();
    return months.map((monthCode) => {
      const label = new Date(`${monthCode}-01`).toLocaleString("default", {
        month: "short",
      });
      const monthTxs = transactions.filter(
        (tx) => tx.occurred_at.slice(0, 7) === monthCode
      );
      const spent = monthTxs
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);
      const income = monthTxs
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);
      return { month: label, spent, income };
    });
  }, [transactions]);

  // Prepare recent activities (last 5)
  const recentActivities = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
    )
    .slice(0, 5)
    .map((tx) => ({
      id: tx.id,
      title: tx.note ?? tx.category ?? "",
      category: tx.category ?? "",
      amount: `₱${tx.amount.toLocaleString()}`,
      date: tx.occurred_at.slice(0, 10),
    }));

  return (
    <div>
      {loading && <p>Loading dashboard...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <SnapshotCards data={kpiData} />
          <DashboardCharts categoryData={categoryData} trendData={trendData} />
          <RecentActivityList data={recentActivities} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
