"use client";

import { cn } from "@/lib/utils";

export type TimeRange = "today" | "week" | "month" | "all";

const TIME_LABELS: Record<TimeRange, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  all: "All Time",
};

interface TimeFilterProps {
  selected: TimeRange;
  onSelect: (range: TimeRange) => void;
}

export function TimeFilter({ selected, onSelect }: TimeFilterProps) {
  return (
    <div className="flex gap-1">
      {(Object.keys(TIME_LABELS) as TimeRange[]).map((range) => (
        <button
          key={range}
          onClick={() => onSelect(range)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            selected === range
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {TIME_LABELS[range]}
        </button>
      ))}
    </div>
  );
}
