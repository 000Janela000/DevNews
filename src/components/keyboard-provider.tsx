"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { CommandPalette } from "./command-palette";
import { ShortcutOverlay } from "./shortcut-overlay";

/**
 * Global keyboard UX provider. Mounts once at the root layout.
 *
 * Handles:
 *   ⌘/Ctrl+K  → command palette
 *   ?         → shortcut overlay
 *   T         → toggle theme
 *   G + [D/W/S/L] → jump to dashboard / digest / saved / read-later
 *   J / K     → next / previous focusable article on current page
 *   Esc       → close overlays
 *
 * Respects text-input focus (doesn't hijack keystrokes while typing).
 */
export function KeyboardProvider() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [awaitingG, setAwaitingG] = useState(false);

  useEffect(() => {
    let gTimeout: ReturnType<typeof setTimeout> | null = null;

    const isTextInput = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const focusNextArticle = (direction: 1 | -1) => {
      const articles = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          "article a[href^='/item/']"
        )
      );
      if (articles.length === 0) return;

      const currentIndex = articles.findIndex(
        (a) => a === document.activeElement
      );
      const nextIndex =
        currentIndex === -1
          ? direction === 1
            ? 0
            : articles.length - 1
          : (currentIndex + direction + articles.length) % articles.length;

      articles[nextIndex].focus();
      articles[nextIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    const handler = (e: KeyboardEvent) => {
      // ⌘/Ctrl+K — always open palette, even from inputs
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }

      // Esc closes overlays
      if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        if (shortcutsOpen) setShortcutsOpen(false);
        setAwaitingG(false);
        return;
      }

      // The rest of the shortcuts should not hijack text fields
      if (isTextInput(e.target) || paletteOpen) return;

      // ? — shortcut overlay
      if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((o) => !o);
        return;
      }

      // T — toggle theme
      if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return;
      }

      // G + [letter] chord — vim/Gmail-style navigation
      if (awaitingG) {
        const key = e.key.toLowerCase();
        setAwaitingG(false);
        if (gTimeout) clearTimeout(gTimeout);
        const target =
          key === "d"
            ? "/dashboard"
            : key === "w"
              ? "/digest"
              : key === "s"
                ? "/saved"
                : key === "l"
                  ? "/read-later"
                  : null;
        if (target) {
          e.preventDefault();
          router.push(target);
        }
        return;
      }

      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setAwaitingG(true);
        gTimeout = setTimeout(() => setAwaitingG(false), 1200);
        return;
      }

      // J / K — next / previous article
      if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        focusNextArticle(1);
        return;
      }
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        focusNextArticle(-1);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (gTimeout) clearTimeout(gTimeout);
    };
  }, [paletteOpen, shortcutsOpen, awaitingG, resolvedTheme, setTheme, router]);

  return (
    <>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <ShortcutOverlay
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
      {/* G-chord indicator — floating hint */}
      {awaitingG ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-sm border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground shadow-lg">
          press <kbd className="font-mono">d</kbd>
          {" · "}
          <kbd className="font-mono">w</kbd>
          {" · "}
          <kbd className="font-mono">s</kbd>
          {" · "}
          <kbd className="font-mono">l</kbd>
        </div>
      ) : null}
    </>
  );
}
