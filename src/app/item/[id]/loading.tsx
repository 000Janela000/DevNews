import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/dashboard/header";

export default function ItemLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 pt-8 pb-24">
        <Skeleton className="h-3 w-16" />
        <div className="mt-8">
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="mt-3 h-7 w-full" />
          <Skeleton className="mt-1.5 h-7 w-4/5" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-5/6" />

          <div className="mt-6 border-y border-border py-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          <div className="mt-8 space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </main>
    </div>
  );
}
