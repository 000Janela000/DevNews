"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="smallcaps text-accent">An error interrupted reading</div>
        <h1 className="display mt-3 font-serif text-4xl font-medium text-foreground sm:text-[52px]">
          Something came loose.
        </h1>
        <p className="prose-body mx-auto mt-5 font-serif text-base italic leading-[1.55] text-muted-foreground">
          {error.message ||
            "An unexpected error occurred. Retry — and if it happens again, the digest page may still work."}
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="smallcaps inline-flex items-center gap-2 rounded-sm border border-foreground bg-foreground px-5 py-2.5 text-background transition-opacity hover:opacity-90"
          >
            <RefreshCw className="size-3.5" strokeWidth={1.5} />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="smallcaps text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to briefing
          </Link>
        </div>

        {error.digest ? (
          <div className="smallcaps mt-10 text-muted-foreground">
            Error reference{" "}
            <span className="font-mono tabular">{error.digest}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
