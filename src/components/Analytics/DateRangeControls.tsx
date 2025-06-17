import React, { useState, useEffect } from "react";

// Props for DateRangeControls
interface DateRangeControlsProps {
  /** Initial start date in YYYY-MM-DD format */
  initialStartDate?: string;
  /** Initial end date in YYYY-MM-DD format */
  initialEndDate?: string;
  /** Callback when date range changes */
  onDateRangeChange: (startDate: string, endDate: string) => void;
  /** Whether comparison mode is enabled */
  comparisonEnabled?: boolean;
  /** Callback when comparison toggle changes */
  onComparisonToggle?: (enabled: boolean) => void;
}

// Preset options
const PRESETS = [
  {
    label: "Last 7 Days",
    getRange: (): [string, string] => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
    },
  },
  {
    label: "This Quarter",
    getRange: (): [string, string] => {
      const now = new Date();
      const month = now.getMonth();
      const quarterStartMonth = Math.floor(month / 3) * 3;
      const start = new Date(now.getFullYear(), quarterStartMonth, 1);
      const end = now;
      return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
    },
  },
  {
    label: "Year to Date",
    getRange: (): [string, string] => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = now;
      return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
    },
  },
];

const DateRangeControls: React.FC<DateRangeControlsProps> = ({
  initialStartDate,
  initialEndDate,
  onDateRangeChange,
  comparisonEnabled = false,
  onComparisonToggle,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate || "");
  const [endDate, setEndDate] = useState(initialEndDate || "");
  const [activePreset, setActivePreset] = useState<string>("");
  const [isComparisonOn, setIsComparisonOn] = useState(comparisonEnabled);

  // Handle manual date input change
  useEffect(() => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  }, [startDate, endDate, onDateRangeChange]);

  // Handle preset click
  const applyPreset = (presetLabel: string) => {
    const preset = PRESETS.find((p) => p.label === presetLabel);
    if (!preset) return;
    const [newStart, newEnd] = preset.getRange();
    setStartDate(newStart);
    setEndDate(newEnd);
    setActivePreset(presetLabel);
  };

  // Handle comparison toggle
  const toggleComparison = () => {
    const newVal = !isComparisonOn;
    setIsComparisonOn(newVal);
    if (onComparisonToggle) {
      onComparisonToggle(newVal);
    }
  };

  return (
    <div className="date-range-controls flex flex-col gap-4">
      {/* Preset Buttons */}
      <div className="presets flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className={`preset-button px-3 py-1 border rounded ${
              activePreset === p.label ? "font-bold" : ""
            }`}
            onClick={() => applyPreset(p.label)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom Range Inputs */}
      <div className="custom-range flex items-center gap-2">
        <label>
          From:
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setActivePreset("");
            }}
            className="ml-1"
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setActivePreset("");
            }}
            className="ml-1"
          />
        </label>
      </div>

      {/* Comparison Toggle */}
      <div className="comparison-toggle flex items-center gap-2">
        <input
          type="checkbox"
          id="comparisonToggle"
          checked={isComparisonOn}
          onChange={toggleComparison}
        />
        <label htmlFor="comparisonToggle">Enable Period Comparison</label>
      </div>
    </div>
  );
};

export default DateRangeControls;
