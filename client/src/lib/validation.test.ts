import { describe, expect, it } from "vitest";
import { priorityWeight, progressForStatus, taskInputSchema } from "@/lib/validation";

describe("taskInputSchema", () => {
  it("accepts a trimmed task payload", () => {
    expect(taskInputSchema.parse({ title: "  Revue client  ", project: "Northstar", priority: "high" })).toMatchObject({ title: "Revue client" });
  });
  it("rejects an empty task title", () => {
    expect(taskInputSchema.safeParse({ title: " ", project: "Northstar", priority: "medium" }).success).toBe(false);
  });
});

describe("planning helpers", () => {
  it("maps terminal status to complete progress", () => {
    expect(progressForStatus("done", 2, 60)).toBe(100);
    expect(progressForStatus("todo")).toBe(0);
  });
  it("keeps urgent work above medium work", () => {
    expect(priorityWeight("urgent")).toBeGreaterThan(priorityWeight("medium"));
  });
});
