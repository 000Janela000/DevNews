import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-sm text-center">
        <div className="meta">404</div>
        <h1 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-foreground">
          Page not found.
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          This page doesn&apos;t exist, or the article was pruned from the
          14-day archive.
        </p>

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-sm border border-border-strong bg-foreground px-3 py-1.5 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
          >
            Back to today
          </Link>
        </div>
      </div>
    </div>
  );
}
