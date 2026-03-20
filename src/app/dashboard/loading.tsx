import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Stats bar skeleton */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 flex-1 rounded-lg" />
          ))}
        </div>
        {/* Briefing skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <div className="grid gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
