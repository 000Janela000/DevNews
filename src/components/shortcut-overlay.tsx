"use client";

import { X } from "lucide-react";

interface ShortcutOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS: Array<{ group: string; items: Array<{ keys: string; label: string }> }> = [
  {
    group: "Global",
    items: [
      { keys: "⌘ k", label: "Open command palette" },
      { keys: "?", label: "Show these shortcuts" },
      { keys: "t", label: "Toggle theme" },
      { keys: "esc", label: "Close overlays" },
    ],
  },
  {
    group: "Navigate",
    items: [
      { keys: "g d", label: "Go to today" },
      { keys: "g w", label: "Go to this week" },
      { keys: "g s", label: "Go to saved" },
      { keys: "g l", label: "Go to read later" },
    ],
  },
  {
    group: "Feed",
    items: [
      { keys: "j", label: "Next article" },
      { keys: "k", label: "Previous article" },
      { keys: "↵", label: "Open focused article" },
    ],
  },
];

export function ShortcutOverlay({ open, onClose }: ShortcutOverlayProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-md border border-border bg-background shadow-xl"
        role="dialog"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <h2
            id="shortcuts-title"
            className="text-[14px] font-semibold tracking-[-0.005em]"
          >
            Keyboard shortcuts
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-5 p-4">
          {SHORTCUTS.map((group) => (
            <section key={group.group}>
              <h3 className="meta mb-1.5">{group.group}</h3>
              <div className="space-y-1">
                {group.items.map((s) => (
                  <div
                    key={s.keys}
                    className="flex items-center justify-between text-[13px]"
                  >
                    <span className="text-foreground">{s.label}</span>
                    <kbd className="rounded-sm border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {s.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
