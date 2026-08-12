/**
 * Direction visuelle : Aquarelle de contrôle — agents lisibles, couleurs discrètes,
 * progression visible et sélection collective sans surcharge cognitive.
 */
import type { TeamMember } from "@/lib/types";

export const fallbackTeamMembers: TeamMember[] = [
  { id: "self", name: "Eldo", role: "super_admin", initials: "EL", color: "#69D2FF", status: "online" },
  { id: "sam", name: "Sam", role: "director", initials: "SA", color: "#69D2FF", status: "online" },
  { id: "michael", name: "Michael", role: "member", initials: "MI", color: "#B5A1FF", status: "online" },
  { id: "bradley", name: "Bradley", role: "member", initials: "BR", color: "#6FE3C1", status: "away" },
  { id: "daniel", name: "Daniel", role: "member", initials: "DA", color: "#F0B36D", status: "online" },
  { id: "herve", name: "Hervé", role: "member", initials: "HE", color: "#FF8BA7", status: "offline" },
];

export const adminRoles = new Set(["super_admin", "admin", "director"]);
export const isAdminRole = (role?: string) => adminRoles.has(role ?? "");

export function memberInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "ME";
}

