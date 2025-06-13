import React from "react";
import type { KPI } from "../../types";

interface SnapshotCardsProps {
  data: KPI[];
}

const SnapshotCards: React.FC<SnapshotCardsProps> = ({ data }) => {
  return (
    <div className="snapshot-kpi-cards flex flex-row gap-4">
      {data.map((kpi) => (
        <div key={kpi.label} className="kpi-card p-4 border rounded">
          <div className="kpi-label text-sm font-medium">{kpi.label}</div>
          <div className="kpi-value text-xl font-bold mt-1">{kpi.value}</div>
        </div>
      ))}
    </div>
  );
};

export default SnapshotCards;
