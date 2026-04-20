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
const EXTENDED_WINDOW_HOURS = 168;

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
      <main className="pb-20">
        {dbError ? (
          <div className="mx-auto max-w-3xl px-4 pt-8">
            <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              Database not connected. Set <code className="font-mono text-xs">DATABASE_URL</code>
              {" "}and run <code className="font-mono text-xs">npm run db:push</code>.
            </div>
          </div>
        ) : (
          <>
            <DashboardContent
              briefingItems={briefingItems}
              remainingItems={remainingItems}
              totalMinutes={totalMinutes}
            />
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 text-[12px] text-muted-foreground">
              {isExtended ? (
                <Link href="/dashboard" className="hover:text-foreground">
                  ← last 48 hours
                </Link>
              ) : (
                <Link
                  href="/dashboard?window=extended"
                  className="hover:text-foreground"
                >
                  show last 7 days →
                </Link>
              )}
              <span aria-hidden>·</span>
              <Link href="/colophon" className="hover:text-foreground">
                colophon
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
