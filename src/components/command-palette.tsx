"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Bookmark,
  Clock,
  FileText,
  LayoutList,
  Moon,
  Newspaper,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import type { ItemRow } from "@/lib/db";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced server-side search as user types
  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();
        setResults((data.items as ItemRow[])?.slice(0, 8) ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query, open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const toggleTheme = () => {
    onOpenChange(false);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-foreground/40 backdrop-blur-sm pt-[12vh] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.5}
          />
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Search articles, jump to sections, toggle settings…"
            className="h-12 w-full bg-transparent font-serif text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <kbd className="smallcaps hidden rounded-sm border border-border px-1.5 py-0.5 text-muted-foreground sm:inline-block">
            esc
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-10 text-center font-serif italic text-muted-foreground">
            {loading
              ? "Searching…"
              : query.length >= 2
                ? "Nothing matches that."
                : "Type to search the feed, or pick an action below."}
          </Command.Empty>

          {results.length > 0 ? (
            <Command.Group
              heading="Articles"
              className="[&_[cmdk-group-heading]]:smallcaps [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {results.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.title}
                  onSelect={() => go(`/item/${item.id}`)}
                  className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2.5 data-[selected=true]:bg-muted"
                >
                  <FileText
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-sm text-foreground">
                      {item.title}
                    </p>
                    <p className="smallcaps mt-0.5 text-muted-foreground">
                      {item.source
                        .replace("rss:", "")
                        .replace("github-release:", "")}
                    </p>
                  </div>
                  <ArrowRight
                    className="mt-1 size-3 shrink-0 opacity-0 transition-opacity data-[selected=true]:opacity-100"
                    strokeWidth={1.5}
                  />
                </Command.Item>
              ))}
            </Command.Group>
          ) : null}

          <Command.Group
            heading="Navigate"
            className="[&_[cmdk-group-heading]]:smallcaps [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <PaletteItem
              icon={Newspaper}
              label="Today's briefing"
              shortcut="G D"
              onSelect={() => go("/dashboard")}
            />
            <PaletteItem
              icon={Sparkles}
              label="Weekly digest"
              shortcut="G W"
              onSelect={() => go("/digest")}
            />
            <PaletteItem
              icon={Bookmark}
              label="Saved articles"
              shortcut="G S"
              onSelect={() => go("/saved")}
            />
            <PaletteItem
              icon={Clock}
              label="Read later"
              shortcut="G L"
              onSelect={() => go("/read-later")}
            />
            <PaletteItem
              icon={LayoutList}
              label="Extended view (last 7 days)"
              onSelect={() => go("/dashboard?window=extended")}
            />
            <PaletteItem
              icon={FileText}
              label="Colophon — design & engineering notes"
              onSelect={() => go("/colophon")}
            />
          </Command.Group>

          <Command.Group
            heading="Actions"
            className="[&_[cmdk-group-heading]]:smallcaps [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <PaletteItem
              icon={resolvedTheme === "dark" ? Sun : Moon}
              label={
                resolvedTheme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              onSelect={toggleTheme}
            />
          </Command.Group>
        </Command.List>

        <div className="smallcaps flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-muted-foreground">
          <span>Press ↑↓ to navigate · ↵ to select</span>
          <span>⌘K to toggle</span>
        </div>
      </div>
    </Command.Dialog>
  );
}

function PaletteItem({
  icon: Icon,
  label,
  shortcut,
  onSelect,
}: {
  icon: typeof Sun;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 data-[selected=true]:bg-muted"
    >
      <Icon
        className="size-4 shrink-0 text-muted-foreground"
        strokeWidth={1.5}
      />
      <span className="flex-1 font-serif text-sm text-foreground">{label}</span>
      {shortcut ? (
        <kbd className="smallcaps rounded-sm border border-border px-1.5 py-0.5 text-muted-foreground">
          {shortcut}
        </kbd>
      ) : null}
    </Command.Item>
  );
}
