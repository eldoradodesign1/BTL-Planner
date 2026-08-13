import { describe, expect, it } from "vitest";
import { defaultShortcuts, formatShortcut, matchesShortcut } from "./shortcuts";

describe("keyboard shortcuts", () => {
  it("ships stable defaults and readable labels", () => {
    expect(defaultShortcuts.command).toBe("mod+k");
    expect(formatShortcut("mod+k")).toContain("K");
  });

  it("matches the platform modifier without matching plain keys", () => {
    const event = (key: string, ctrlKey = false) => ({ key, ctrlKey, metaKey: false, shiftKey: false, altKey: false } as KeyboardEvent);
    expect(matchesShortcut(event("k", true), "mod+k")).toBe(true);
    expect(matchesShortcut(event("k"), "mod+k")).toBe(false);
    expect(matchesShortcut(event("N"), "n")).toBe(true);
  });
});
