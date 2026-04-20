import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="smallcaps text-accent">404 · Not on the page</div>
        <h1 className="display mt-3 font-serif text-4xl font-medium text-foreground sm:text-[52px]">
          This page never ran.
        </h1>
        <p className="prose-body mx-auto mt-5 font-serif text-base italic leading-[1.55] text-muted-foreground">
          Either the link is stale, the article was pruned from the 14-day
          archive, or the edition you&apos;re looking for hasn&apos;t been
          printed.
        </p>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="smallcaps inline-flex items-center gap-2 rounded-sm border border-foreground bg-foreground px-5 py-2.5 text-background transition-opacity hover:opacity-90"
          >
            Back to today&apos;s briefing
          </Link>
        </div>
      </div>
    </div>
  );
}
