"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { HealthIndicator } from "./health-indicator";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Today" },
  { href: "/digest", label: "Week" },
  { href: "/saved", label: "Saved" },
  { href: "/read-later", label: "Later" },
];

/**
 * Single-band header. Holds the wordmark + a compact date line on the
 * left, a small nav in the middle, and account/system chrome on the
 * right. No separate masthead zone — feed content starts immediately
 * under this bar.
 */
export function Header() {
  const pathname = usePathname();
  const now = new Date();

  return (
    <header className="scroll-header sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-13 max-w-3xl items-center gap-6 px-4 py-2.5">
        <Link
          href="/dashboard"
          className="flex items-baseline gap-3 text-foreground transition-opacity hover:opacity-80"
        >
          <span className="text-[15px] font-semibold tracking-tight">
            DevNews
          </span>
          <span className="hidden font-mono text-[11px] text-muted-foreground tabular sm:inline">
            {format(now, "EEE, MMM d")}
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-[13px]">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-sm px-2 py-1 transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <HealthIndicator />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
