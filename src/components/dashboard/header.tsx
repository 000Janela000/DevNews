import { Activity } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="size-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            AI Dev Tracker
          </span>
        </Link>
        <p className="hidden text-sm text-muted-foreground sm:block">
          AI developments for software engineers
        </p>
      </div>
    </header>
  );
}
