import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/dashboard/header";

export default function ItemLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Skeleton className="mb-4 h-4 w-32" />
        <div className="space-y-4">
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </main>
    </div>
  );
}
