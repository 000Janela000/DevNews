import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/dashboard/header";
import { Masthead } from "@/components/masthead";

export default function DigestLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Masthead section="digest" />
      <main className="mx-auto max-w-3xl px-4 pb-32">
        <div className="flex items-baseline justify-between">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="mt-3 h-8 w-10/12" />
        <div className="mt-2 h-px w-full bg-border" />

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-8 w-10" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <section key={i}>
              <div className="flex items-baseline gap-3">
                <Skeleton className="size-[7px] rounded-full" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="ml-auto h-3 w-4" />
              </div>
              <div className="mt-1 h-px w-full bg-border" />
              <div className="space-y-5 divide-y divide-border pt-5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j}>
                    <Skeleton className="h-3 w-44" />
                    <Skeleton className="mt-2 h-5 w-11/12" />
                    <Skeleton className="mt-1 h-4 w-full" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
