import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/dashboard/header";

export default function DigestLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-4 pb-24">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="mt-6 space-y-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <section key={i}>
              <div className="flex items-baseline gap-2 border-b border-border pb-2">
                <Skeleton className="size-[6px] rounded-full" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="ml-auto h-3 w-4" />
              </div>
              <ul className="divide-y divide-border">
                {Array.from({ length: 3 }).map((_, j) => (
                  <li key={j} className="py-3">
                    <Skeleton className="h-4 w-full max-w-[500px]" />
                    <Skeleton className="mt-1.5 h-3 w-full" />
                    <Skeleton className="mt-1 h-3 w-2/3" />
                    <Skeleton className="mt-2 h-3 w-40" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
