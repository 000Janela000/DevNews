import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/dashboard/header";

export default function ItemLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-10 pb-32 sm:pt-16">
        <Skeleton className="h-3 w-32" />
        <div className="mt-10 sm:mt-12">
          <div className="flex gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="mt-4 h-10 w-full" />
          <Skeleton className="mt-3 h-8 w-5/6" />
          <Skeleton className="mt-6 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-4/5" />

          <div className="mt-8 border-y border-border py-4">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </main>
    </div>
  );
}
