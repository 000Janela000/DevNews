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
      { keys: "⌘ K", label: "Open command palette" },
      { keys: "?", label: "Show these shortcuts" },
      { keys: "T", label: "Toggle theme" },
      { keys: "Esc", label: "Close overlays" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { keys: "G D", label: "Go to today's briefing" },
      { keys: "G W", label: "Go to weekly digest" },
      { keys: "G S", label: "Go to saved" },
      { keys: "G L", label: "Go to read later" },
    ],
  },
  {
    group: "Feed",
    items: [
      { keys: "J", label: "Next article" },
      { keys: "K", label: "Previous article" },
      { keys: "↵", label: "Open focused article" },
      { keys: "S", label: "Save focused article" },
      { keys: "E", label: "Mark focused article read" },
    ],
  },
];

export function ShortcutOverlay({ open, onClose }: ShortcutOverlayProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-background shadow-2xl"
        role="dialog"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2
            id="shortcuts-title"
            className="font-serif text-base font-medium tracking-tight"
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

        <div className="space-y-6 p-5">
          {SHORTCUTS.map((group) => (
            <section key={group.group}>
              <h3 className="smallcaps mb-2 text-muted-foreground">
                {group.group}
              </h3>
              <div className="space-y-1.5">
                {group.items.map((s) => (
                  <div
                    key={s.keys}
                    className="flex items-center justify-between font-serif text-sm"
                  >
                    <span className="text-foreground">{s.label}</span>
                    <kbd className="smallcaps rounded-sm border border-border bg-muted/40 px-2 py-0.5 text-muted-foreground">
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
