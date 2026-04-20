import { Skeleton } from "@/components/ui/skeleton";

/**
 * Matches the actual dashboard layout so there's no content-shift on load:
 * masthead wordmark + 8 article skeletons with the same vertical rhythm as
 * TrackedItemCard.
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header placeholder */}
      <div className="scroll-header sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-11 max-w-3xl items-center justify-between px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>

      {/* Masthead placeholder */}
      <div className="mx-auto max-w-3xl px-4 pt-10 pb-8 sm:pt-14">
        <div className="flex items-baseline justify-between">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="mt-3 h-14 w-64 sm:h-[72px]" />
        <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        <div className="masthead-rule mt-6" />
        <div className="mt-4 flex gap-5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Briefing skeletons */}
      <section className="mx-auto max-w-3xl px-4">
        <div className="flex items-baseline justify-between">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="mt-3 h-8 w-96 max-w-full" />
        <div className="mt-2 h-px w-full bg-border" />

        <ul className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="py-6 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2">
                <Skeleton className="size-[7px] rounded-full" />
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-2.5 w-20" />
              </div>
              <Skeleton className="mt-3 h-6 w-11/12" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-3/4" />
              <div className="mt-4 flex justify-between">
                <div className="flex gap-1">
                  <Skeleton className="size-8 rounded-sm" />
                  <Skeleton className="size-8 rounded-sm" />
                  <Skeleton className="size-8 rounded-sm" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
