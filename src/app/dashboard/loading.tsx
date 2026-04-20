import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shape-match to the actual dashboard — no layout shift on load.
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="scroll-header sticky top-0 z-50 border-b border-border bg-background/90">
        <div className="mx-auto flex h-13 max-w-3xl items-center gap-6 px-4 py-2.5">
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="ml-auto flex gap-1">
            <Skeleton className="size-6" />
            <Skeleton className="size-6" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        <Skeleton className="h-3 w-40" />

        <ul className="mt-4 divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-2.5">
                <Skeleton className="mt-[9px] size-[6px] shrink-0 rounded-full" />
                <Skeleton className="h-5 w-full max-w-[560px]" />
              </div>
              <div className="pl-[14px]">
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-2/3" />
                <Skeleton className="mt-2 h-3 w-48" />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
