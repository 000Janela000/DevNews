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
      <div className="max-w-sm text-center">
        <h1 className="text-[20px] font-semibold tracking-[-0.01em] text-foreground">
          Something went wrong.
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 text-[13px]">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border-strong bg-foreground px-3 py-1.5 font-medium text-background transition-opacity hover:opacity-90"
          >
            <RefreshCw className="size-3" strokeWidth={1.5} />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground"
          >
            Back to today
          </Link>
        </div>

        {error.digest ? (
          <div className="meta mt-8">
            Reference{" "}
            <span className="font-mono tabular">{error.digest}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
