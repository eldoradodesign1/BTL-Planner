import { describe, expect, it } from "vitest";
import { fallbackTeamMembers, isAdminRole, memberInitials } from "./team";

describe("team management helpers", () => {
  it("recognizes admin and director roles", () => {
    expect(isAdminRole("super_admin")).toBe(true);
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("director")).toBe(true);
    expect(isAdminRole("member")).toBe(false);
  });

  it("creates compact initials without empty fragments", () => {
    expect(memberInitials("Marie Curie")).toBe("MC");
    expect(memberInitials("  Eldo  ")).toBe("E");
    expect(memberInitials("")).toBe("ME");
  });

  it("keeps a usable local roster before Supabase profiles load", () => {
    expect(fallbackTeamMembers.length).toBeGreaterThan(1);
    expect(fallbackTeamMembers.some((member) => member.role === "super_admin")).toBe(true);
  });
});

