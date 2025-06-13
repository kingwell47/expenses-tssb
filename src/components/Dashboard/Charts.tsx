import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import type { CategoryData, TrendData } from "../../types";

// Props for Charts component
interface ChartsProps {
  categoryData: CategoryData[];
  trendData: TrendData[];
}

const Charts: React.FC<ChartsProps> = ({ categoryData, trendData }) => {
  return (
    <div className="visual-summaries grid gap-8">
      {/* Category Breakdown Bar Chart */}
      <div className="chart-container" style={{ width: "100%", height: 300 }}>
        <h3 className="text-lg font-medium mb-2">Category Breakdown</h3>
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

      {/* Income vs Expense Stacked Chart */}
      <div className="chart-container" style={{ width: "100%", height: 300 }}>
        <h3 className="text-lg font-medium mb-2">Income vs Expense</h3>
        <ResponsiveContainer>
          <ComposedChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" name="Income (₱)" />
            <Bar dataKey="spent" name="Spent (₱)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
