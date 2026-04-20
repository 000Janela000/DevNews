import Link from "next/link";
import { formatDistanceToNow, format, startOfWeek, endOfWeek } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import {
  getWeeklyTopItems,
  getWeeklyCountsByCategory,
} from "@/lib/db/queries";
import type { ItemRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Week",
  description: "The week in AI for people who build software.",
};

const CATEGORY_COLOR: Record<Category, string> = {
  models_releases: "bg-[var(--cat-models)]",
  tools_frameworks: "bg-[var(--cat-tools)]",
  practices_approaches: "bg-[var(--cat-practices)]",
  industry_trends: "bg-[var(--cat-industry)]",
  research_papers: "bg-[var(--cat-research)]",
};

const CATEGORY_ORDER: Category[] = [
  "models_releases",
  "tools_frameworks",
  "practices_approaches",
  "industry_trends",
  "research_papers",
];

function groupByCategory(items: ItemRow[]): Record<string, ItemRow[]> {
  const grouped: Record<string, ItemRow[]> = {};
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  return grouped;
}

export default async function DigestPage() {
  let items: ItemRow[] = [];
  let counts: Array<{ category: string; count: number }> = [];
  let dbError = false;

  try {
    [items, counts] = await Promise.all([
      getWeeklyTopItems(30),
      getWeeklyCountsByCategory(),
    ]);
  } catch {
    dbError = true;
  }

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const grouped = groupByCategory(items);
  const totalItems = counts.reduce((s, c) => s + c.count, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-4 pb-24">
        <div className="meta flex items-center justify-between pb-2">
          <span>
            Week of{" "}
            <span className="font-mono tabular">
              {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d")}
            </span>
          </span>
          <span className="font-mono tabular">{totalItems} tracked</span>
        </div>

        {dbError ? (
          <div className="mt-6 rounded-sm border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            Database not connected.
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No items this week yet.
          </div>
        ) : (
          <div className="space-y-10">
            {CATEGORY_ORDER.map((cat) => {
              const catItems = grouped[cat];
              if (!catItems || catItems.length === 0) return null;

              return (
                <section key={cat}>
                  <div className="meta flex items-baseline gap-2 border-b border-border pb-2">
                    <span
                      aria-hidden
                      className={`inline-block size-[6px] rounded-full ${CATEGORY_COLOR[cat]}`}
                    />
                    <span className="text-foreground">
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <span className="ml-auto font-mono tabular">
                      {catItems.length}
                    </span>
                  </div>

                  <ul className="divide-y divide-border">
                    {catItems.map((item) => (
                      <li
                        key={item.id}
                        className="relative py-3 first:pt-3 last:pb-0"
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-0 top-3 z-10 inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"
                          aria-label={`Open original: ${item.title}`}
                        >
                          original
                          <ExternalLink
                            className="size-3"
                            strokeWidth={1.5}
                          />
                        </a>
                        <Link
                          href={`/item/${item.id}`}
                          className="block pr-20"
                          aria-label={item.title}
                        >
                          <h3 className="text-[16px] font-semibold leading-[1.35] text-foreground">
                            {item.title}
                            {item.importance && item.importance >= 4 ? (
                              <span className="ml-2 text-[11px] text-accent">
                                ★
                              </span>
                            ) : null}
                          </h3>

                          {item.summary ? (
                            <p className="mt-1 line-clamp-2 text-[13.5px] leading-[1.5] text-foreground/75">
                              {item.summary}
                            </p>
                          ) : null}

                          <div className="meta mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span>
                              {item.source
                                .replace("rss:", "")
                                .replace("github-release:", "")}
                            </span>
                            <span aria-hidden>·</span>
                            <time
                              dateTime={new Date(item.publishedAt).toISOString()}
                              className="font-mono tabular"
                            >
                              {formatDistanceToNow(
                                new Date(item.publishedAt),
                                { addSuffix: true }
                              )}
                            </time>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
