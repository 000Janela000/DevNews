import {
  Newspaper,
  Bot,
  Wrench,
  Lightbulb,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import type { Category } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  models_releases: Bot,
  tools_frameworks: Wrench,
  practices_approaches: Lightbulb,
  industry_trends: TrendingUp,
  research_papers: BookOpen,
};

const CATEGORY_STYLES: Record<Category, { color: string; bg: string }> = {
  models_releases: { color: "text-blue-500", bg: "bg-blue-500/10" },
  tools_frameworks: { color: "text-emerald-500", bg: "bg-emerald-500/10" },
  practices_approaches: { color: "text-amber-500", bg: "bg-amber-500/10" },
  industry_trends: { color: "text-purple-500", bg: "bg-purple-500/10" },
  research_papers: { color: "text-rose-500", bg: "bg-rose-500/10" },
};

interface StatsBarProps {
  counts: Array<{ category: string; count: number }>;
  totalItems: number;
}

export function StatsBar({ counts, totalItems }: StatsBarProps) {
  if (totalItems === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-muted p-1.5">
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">{totalItems}</p>
            <p className="text-[11px] text-muted-foreground">Total</p>
          </div>
        </div>
      </div>
      {(Object.keys(CATEGORY_ICONS) as Category[]).map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        const style = CATEGORY_STYLES[cat];
        const count = counts.find((c) => c.category === cat)?.count ?? 0;
        return (
          <div key={cat} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <div className={`rounded-md p-1.5 ${style.bg}`}>
                <Icon className={`h-4 w-4 ${style.color}`} />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">{count}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {CATEGORY_LABELS[cat].split(" ")[0]}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
