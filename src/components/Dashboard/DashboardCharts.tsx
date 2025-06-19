import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  Legend,
  LineChart,
  Line,
} from "recharts";
import type { CategoryData, TrendData } from "../../types";

interface DashboardChartsProps {
  categoryData: CategoryData[];
  trendData: TrendData[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  categoryData,
  trendData,
}) => {
  return (
    <div className="dashboard-charts grid gap-8">
      {/* Category Breakdown (Current Month) */}
      <div className="chart-container" style={{ width: "100%", height: 300 }}>
        <h3 className="text-lg font-medium mb-2">
          Category Breakdown (Current Month)
        </h3>
        <ResponsiveContainer>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" name="Amount (₱)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Spending Trend Line Chart */}
      <div className="chart-container" style={{ width: "100%", height: 300 }}>
        <h3 className="text-lg font-medium mb-2">
          Spending Trend (Last 6 Months)
        </h3>
        <ResponsiveContainer>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="spent" name="Spent (₱)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Expense Trend */}
      <div className="chart-container" style={{ height: 300 }}>
        <h3 className="text-lg font-medium mb-2">
          Income vs Expense (Last 6 Months)
        </h3>
        <ResponsiveContainer>
          <ComposedChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" name="Income (₱)" />
            <Bar dataKey="spent" name="Expense (₱)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
