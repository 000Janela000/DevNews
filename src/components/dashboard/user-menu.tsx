"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const name = (user.user_metadata?.user_name as string) ?? "User";

  return (
    <div className="flex items-center gap-2">
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={name}
          className="size-6 rounded-full"
        />
      )}
      <form action="/auth/signout" method="POST">
        <button
          type="submit"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="size-3" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </form>
    </div>
  );
}
