import React from "react";

// Interface for activity items
interface Activity {
  id: string;
  title: string;
  category: string;
  amount: string;
  date: string;
}

interface RecentActivityListProps {
  data: Activity[];
}

// RecentActivityList component displays the last 5 transactions
const RecentActivityList: React.FC<RecentActivityListProps> = ({ data }) => {
  return (
    <div className="recent-activity p-4 border rounded">
      <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
      <ul className="activity-list flex flex-col gap-2">
        {data.map((tx) => (
          <li
            key={tx.id}
            className="activity-item flex justify-between items-center"
          >
            <div className="activity-info">
              <div className="activity-title font-medium">{tx.title}</div>
              <div className="activity-meta text-sm text-gray-500">
                {tx.category} • {tx.date}
              </div>
            </div>
            <div className="activity-amount font-bold">{tx.amount}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivityList;
