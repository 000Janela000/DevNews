import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/dashboard/header";

export default function DigestLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="mb-8 h-4 w-64" />
        <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </main>
    </div>
  );
}
