"use client";

import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCallback } from "react";

/**
 * Hook that returns a function to check auth before an action.
 * If not authenticated, redirects to login with return URL.
 * If authenticated, executes the callback.
 */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const requireAuth = useCallback(
    async (onAuthenticated: () => void | Promise<void>) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      await onAuthenticated();
    },
    [router, pathname]
  );

  return requireAuth;
}
