/**
 * Direction visuelle : Aquarelle de contrôle — les raccourcis restent discrets,
 * explicites et modifiables sans interrompre le flux de planification.
 */
export type ShortcutAction = "command" | "newTask" | "dashboard" | "calendar" | "tasks" | "chat";
export type ShortcutConfig = Record<ShortcutAction, string>;

export const defaultShortcuts: ShortcutConfig = {
  command: "mod+k",
  newTask: "n",
  dashboard: "d",
  calendar: "m",
  tasks: "t",
  chat: "c",
};

const storageKey = "me-planner-shortcuts";

export function loadShortcuts(): ShortcutConfig {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "null") as Partial<ShortcutConfig> | null;
    return { ...defaultShortcuts, ...(parsed ?? {}) };
  } catch {
    return defaultShortcuts;
  }
}

export function saveShortcuts(shortcuts: ShortcutConfig) {
  localStorage.setItem(storageKey, JSON.stringify(shortcuts));
}

export function matchesShortcut(event: KeyboardEvent, shortcut: string) {
  const parts = shortcut.toLowerCase().split("+").map((part) => part.trim()).filter(Boolean);
  const key = parts.at(-1);
  if (!key) return false;
  const wantsMod = parts.includes("mod") || parts.includes("cmd") || parts.includes("ctrl");
  const wantsShift = parts.includes("shift");
  const wantsAlt = parts.includes("alt") || parts.includes("option");
  const hasMod = event.metaKey || event.ctrlKey;
  return event.key.toLowerCase() === key && hasMod === wantsMod && event.shiftKey === wantsShift && event.altKey === wantsAlt;
}

export function formatShortcut(shortcut: string) {
  return shortcut.split("+").map((part) => part === "mod" ? "⌘/Ctrl" : part.length === 1 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)).join(" + ");
}

