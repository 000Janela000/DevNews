import Link from "next/link";
import { Header } from "@/components/dashboard/header";
import { DashboardContent } from "./content";
import {
  getRecentItems,
  getRecentItemsExcludingRead,
} from "@/lib/db/queries";
import { getUser } from "@/lib/supabase/user";
import { selectBriefingItems } from "@/lib/briefing";
import { clusterItems } from "@/lib/clustering";

export const dynamic = "force-dynamic";

const DEFAULT_WINDOW_HOURS = 48;
const EXTENDED_WINDOW_HOURS = 168; // 7 days

interface DashboardPageProps {
  searchParams: Promise<{ window?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { window } = await searchParams;
  const isExtended = window === "extended";
  const windowHours = isExtended ? EXTENDED_WINDOW_HOURS : DEFAULT_WINDOW_HOURS;

  let items: Awaited<ReturnType<typeof getRecentItems>> = [];
  let dbError = false;

  try {
    let user = null;
    try {
      user = await getUser();
    } catch {
      // Auth not configured — continue without user
    }

    items = user
      ? await getRecentItemsExcludingRead(user.id, 200, windowHours)
      : await getRecentItems(200, windowHours);
  } catch {
    dbError = true;
  }

  const clustered = clusterItems(items);
  const { briefingItems, remainingItems, totalMinutes } =
    selectBriefingItems(clustered);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        {dbError && (
          <div className="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-400">
            Database not connected. Set <code>DATABASE_URL</code> and run{" "}
            <code>npm run db:push</code>.
          </div>
        )}
        <DashboardContent
          briefingItems={briefingItems}
          remainingItems={remainingItems}
          totalMinutes={totalMinutes}
        />
        <div className="mt-10 flex justify-center border-t border-border/40 pt-6 text-xs text-muted-foreground">
          {isExtended ? (
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              ← Show only last 48 hours
            </Link>
          ) : (
            <Link
              href="/dashboard?window=extended"
              className="hover:text-foreground transition-colors"
            >
              Show last 7 days →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
