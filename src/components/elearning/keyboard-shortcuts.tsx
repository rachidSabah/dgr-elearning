"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Brain,
  ListChecks,
  Keyboard,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ------------------------------------------------------------
// Shortcut definitions
// ------------------------------------------------------------
interface ShortcutDef {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  eventName: string;
}

const SHORTCUTS: ShortcutDef[] = [
  {
    key: "/",
    label: "Global Search",
    description: "Open the global search dialog to find any lesson, term, or flashcard.",
    icon: Search,
    eventName: "open-search",
  },
  {
    key: "J",
    label: "Next Lesson",
    description: "Jump to the next lesson in the current course.",
    icon: ArrowRight,
    eventName: "next-lesson",
  },
  {
    key: "K",
    label: "Previous Lesson",
    description: "Jump to the previous lesson in the current course.",
    icon: ArrowLeft,
    eventName: "prev-lesson",
  },
  {
    key: "Space",
    label: "Toggle Narration",
    description: "Start or pause voice narration of the current lesson.",
    icon: Volume2,
    eventName: "toggle-narration",
  },
  {
    key: "F",
    label: "Flashcards",
    description: "Go to the flashcards study view.",
    icon: Brain,
    eventName: "go-flashcards",
  },
  {
    key: "Q",
    label: "Quiz",
    description: "Jump to the quiz for the current lesson.",
    icon: ListChecks,
    eventName: "go-quiz",
  },
  {
    key: "?",
    label: "Keyboard Shortcuts",
    description: "Show this help dialog.",
    icon: HelpCircle,
    eventName: "show-shortcuts",
  },
];

// ------------------------------------------------------------
// Helper: detect if the user is typing in an input/textarea
// ------------------------------------------------------------
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  // Radix / shadcn dialog triggers and command items
  if (target.getAttribute("role") === "textbox") return true;
  return false;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------
export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  const dispatch = useCallback((eventName: string) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(eventName));
  }, []);

  // Listen for the "show-shortcuts" event so other components can open the help dialog too
  useEffect(() => {
    const handler = () => setShowHelp(true);
    window.addEventListener("show-shortcuts", handler);
    return () => window.removeEventListener("show-shortcuts", handler);
  }, []);

  // Global keydown listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Always allow Escape to close help (the Dialog component handles its own escape,
      // but we make sure focus returns cleanly).
      if (e.key === "Escape") {
        if (showHelp) setShowHelp(false);
        return;
      }

      // Ignore shortcuts while typing in any input/textarea/contenteditable element
      if (isEditableTarget(e.target)) return;

      // Also ignore when meta/ctrl is held (browser shortcuts like Cmd+F, Cmd+K)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;

      // "/" — open global search
      if (key === "/") {
        e.preventDefault();
        dispatch("open-search");
        return;
      }

      // "?" — show shortcuts (Shift + /) — key is "?" when shift is held
      if (key === "?") {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Letters — only treat as shortcuts when no shift modifier (so "j" not "J")
      if (e.shiftKey) return;

      const lower = key.toLowerCase();
      if (lower === "j") {
        e.preventDefault();
        dispatch("next-lesson");
      } else if (lower === "k") {
        e.preventDefault();
        dispatch("prev-lesson");
      } else if (lower === "f") {
        e.preventDefault();
        dispatch("go-flashcards");
      } else if (lower === "q") {
        e.preventDefault();
        dispatch("go-quiz");
      } else if (key === " ") {
        // Space — toggle narration
        e.preventDefault();
        dispatch("toggle-narration");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch, showHelp]);

  // Renders nothing visible — only attaches listeners + help dialog
  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate the platform faster. Shortcuts are disabled
            while typing in inputs or text areas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1.5">
          {SHORTCUTS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/50 transition-colors"
              >
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.description}</div>
                </div>
                <kbd
                  className="shrink-0 inline-flex min-w-[2rem] items-center justify-center rounded-md border border-border bg-muted px-2 py-1 text-xs font-semibold text-foreground shadow-sm"
                  aria-label={`Shortcut key: ${s.key}`}
                >
                  {s.key}
                </kbd>
              </div>
            );
          })}
        </div>

        <div className="mt-1 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Tip: press <kbd className="rounded border bg-background px-1 font-semibold">/</kbd>{" "}
          anywhere outside an input to start searching instantly.
        </div>
      </DialogContent>
    </Dialog>
  );
}
