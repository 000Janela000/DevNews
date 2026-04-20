import Link from "next/link";
import { formatDistanceToNow, format, startOfWeek, endOfWeek } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { Masthead } from "@/components/masthead";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import {
  getWeeklyTopItems,
  getWeeklyCountsByCategory,
} from "@/lib/db/queries";
import type { ItemRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Weekly digest",
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
      <Masthead section="digest" />

      <main className="mx-auto max-w-3xl px-4 pb-32">
        <div className="smallcaps mb-1 flex items-baseline justify-between text-muted-foreground">
          <span>
            Week of{" "}
            <span className="font-mono tabular">
              {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d")}
            </span>
          </span>
          <span className="font-mono tabular">{totalItems} tracked</span>
        </div>

        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">
          What shipped across the week, by category.
        </h2>

        <div className="mt-2 h-px w-full bg-border" />

        {dbError ? (
          <div className="mt-6 rounded-sm border border-destructive/30 bg-destructive/5 p-4 font-serif italic text-destructive">
            Database not connected.
          </div>
        ) : null}

        {/* Category counts as editorial summary row */}
        {counts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
            {CATEGORY_ORDER.map((cat) => {
              const count = counts.find((c) => c.category === cat)?.count ?? 0;
              return (
                <div key={cat} className="flex flex-col">
                  <span className="font-mono text-2xl font-medium tabular text-foreground">
                    {count}
                  </span>
                  <span className="smallcaps mt-0.5 text-muted-foreground">
                    <span
                      aria-hidden
                      className={`mr-1.5 inline-block size-[7px] translate-y-[-1px] rounded-full ${CATEGORY_COLOR[cat]}`}
                    />
                    {CATEGORY_LABELS[cat]}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="py-24 text-center font-serif italic text-muted-foreground">
            No items this week yet — check back later.
          </div>
        ) : (
          <div className="mt-12 space-y-16">
            {CATEGORY_ORDER.map((cat) => {
              const catItems = grouped[cat];
              if (!catItems || catItems.length === 0) return null;

              return (
                <section key={cat}>
                  <div className="smallcaps flex items-baseline gap-3 text-accent">
                    <span
                      aria-hidden
                      className={`inline-block size-[7px] translate-y-[-1px] rounded-full ${CATEGORY_COLOR[cat]}`}
                    />
                    <span>{CATEGORY_LABELS[cat]}</span>
                    <span className="ml-auto font-mono text-muted-foreground tabular">
                      {catItems.length}
                    </span>
                  </div>
                  <div className="mt-1 h-px w-full bg-border" />

                  <ul className="divide-y divide-border">
                    {catItems.map((item) => (
                      <li
                        key={item.id}
                        className="py-5 first:pt-5 last:pb-0"
                      >
                        <Link href={`/item/${item.id}`} className="block">
                          <div className="smallcaps flex flex-wrap items-center gap-x-2.5 gap-y-1 text-muted-foreground">
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
                            {item.importance && item.importance >= 4 ? (
                              <>
                                <span aria-hidden>·</span>
                                <span className="text-accent">
                                  high impact
                                </span>
                              </>
                            ) : null}
                          </div>

                          <h3 className="mt-1 font-serif text-lg font-medium leading-snug tracking-tight text-foreground">
                            {item.title}
                          </h3>

                          {item.summary ? (
                            <p className="prose-body mt-1 text-[15px] text-muted-foreground">
                              {item.summary}
                            </p>
                          ) : null}
                        </Link>
                        <div className="mt-2 flex justify-end">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="smallcaps inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            Original
                            <ExternalLink
                              className="size-3"
                              strokeWidth={1.5}
                            />
                          </a>
                        </div>
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
