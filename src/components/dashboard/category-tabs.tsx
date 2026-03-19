"use client";

import { type Category, CATEGORY_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Bot,
  Wrench,
  Lightbulb,
  TrendingUp,
  BookOpen,
  LayoutGrid,
} from "lucide-react";

const CATEGORY_ICONS: Record<Category | "all", React.ElementType> = {
  all: LayoutGrid,
  models_releases: Bot,
  tools_frameworks: Wrench,
  practices_approaches: Lightbulb,
  industry_trends: TrendingUp,
  research_papers: BookOpen,
};

const CATEGORY_COLORS: Record<Category, string> = {
  models_releases: "text-blue-400",
  tools_frameworks: "text-emerald-400",
  practices_approaches: "text-amber-400",
  industry_trends: "text-purple-400",
  research_papers: "text-rose-400",
};

export const CATEGORY_BADGE_COLORS: Record<Category, string> = {
  models_releases:
    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  tools_frameworks:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  practices_approaches:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  industry_trends:
    "bg-purple-500/10 text-purple-400 border-purple-500/20",
  research_papers:
    "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

interface CategoryTabsProps {
  selected: Category | "all";
  onSelect: (category: Category | "all") => void;
  counts?: Partial<Record<Category, number>>;
}

export function CategoryTabs({
  selected,
  onSelect,
  counts,
}: CategoryTabsProps) {
  const categories: Array<Category | "all"> = [
    "all",
    "models_releases",
    "tools_frameworks",
    "practices_approaches",
    "industry_trends",
    "research_papers",
  ];

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        const label = cat === "all" ? "All" : CATEGORY_LABELS[cat];
        const isSelected = selected === cat;
        const count =
          cat === "all"
            ? Object.values(counts ?? {}).reduce(
                (sum, c) => sum + (c ?? 0),
                0
              )
            : counts?.[cat];

        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "size-3.5",
                !isSelected && cat !== "all" && CATEGORY_COLORS[cat]
              )}
            />
            <span>{label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.5 text-xs",
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
