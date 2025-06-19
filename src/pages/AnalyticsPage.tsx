import React, { useState, useEffect, useMemo } from "react";
import Charts from "../components/Dashboard/Charts";
import type { CategoryData, TrendData, Transaction } from "../types";
import DateRangeControls from "../components/Analytics/DateRangeControls";
import { fetchTransactions } from "../services/transactionService";

// Helper to get the last six months in YYYY-MM format
const getLastSixMonths = (): string[] => {
  const months: string[] = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7));
  }
  return months;
};

const AnalyticsPage: React.FC = () => {
  // Date range and comparison state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [comparisonEnabled, setComparisonEnabled] = useState<boolean>(false);

  // Transactions for trend analysis
  const [trendTx, setTrendTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);

    // Default range: first day of current month to today
    setStartDate(`${currentMonth}-01`);
    setEndDate(today.toISOString().slice(0, 10));

    // Fetch transactions for each of the last 6 months
    const months = getLastSixMonths();
    setLoading(true);
    Promise.all(months.map((m) => fetchTransactions(m)))
      .then((arrays) => setTrendTx(arrays.flat()))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Error fetching transactions"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  // Filter out any null or undefined transactions
  const safeTrendTx = useMemo(
    () =>
      trendTx.filter(
        (tx): tx is Transaction => tx != null && tx.amount != null
      ),
    [trendTx]
  );

  // Filter transactions by selected date range
  const filteredTx = useMemo(() => {
    if (!startDate || !endDate) return [];
    return safeTrendTx.filter((tx) => {
      const date = tx.occurred_at.slice(0, 10);
      return date >= startDate && date <= endDate;
    });
  }, [safeTrendTx, startDate, endDate]);

  // Category breakdown from filtered transactions
  const categoryData: CategoryData[] = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredTx.forEach((tx) => {
      if (tx.category != null) {
        totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
      }
    });
    return Object.entries(totals).map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [filteredTx]);

  // Trend data grouped by each of the last 6 months (uses safeTrendTx)
  const trendData: TrendData[] = useMemo(() => {
    return getLastSixMonths().map((monthCode) => {
      const monthTx = safeTrendTx.filter(
        (tx) => tx.occurred_at.slice(0, 7) === monthCode
      );
      const spent = monthTx
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);
      const income = monthTx
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);
      const label = new Date(`${monthCode}-01`).toLocaleString("default", {
        month: "short",
      });
      return { month: label, spent, income };
    });
  }, [safeTrendTx]);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  console.log(trendData);

  return (
    <div>
      <h2 className="">Analytics</h2>

      <DateRangeControls
        initialStartDate={startDate}
        initialEndDate={endDate}
        comparisonEnabled={comparisonEnabled}
        onDateRangeChange={(s, e) => {
          setStartDate(s);
          setEndDate(e);
        }}
        onComparisonToggle={setComparisonEnabled}
      />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 space-y-8">
          <Charts categoryData={categoryData} trendData={trendData} />
          {/* Additional analytics widgets can go here */}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
