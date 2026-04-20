"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/dashboard/header";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");

  const handleGitHubLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  };

  return (
    <div className="mx-auto max-w-sm pt-20 text-center">
      <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-foreground">
        Sign in
      </h1>
      <p className="mt-2 text-[14px] text-muted-foreground">
        Save articles and track your reading. Browsing is free.
      </p>

      {error ? (
        <div className="mt-5 rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-[13px] text-destructive">
          Authentication failed. Try again.
        </div>
      ) : null}

      <button
        onClick={handleGitHubLogin}
        className="mt-6 inline-flex items-center gap-2 rounded-sm border border-border-strong bg-foreground px-4 py-2 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        Continue with GitHub
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-xl px-4 pt-4 pb-24">
        <Link
          href="/dashboard"
          className="meta inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <ArrowLeft className="size-3" strokeWidth={1.5} />
          Back
        </Link>
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
