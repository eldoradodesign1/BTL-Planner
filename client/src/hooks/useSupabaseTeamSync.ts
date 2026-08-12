/**
 * Direction visuelle : Aquarelle de contrôle — synchronisation silencieuse des
 * profils visibles, avec repli local pour conserver un espace exploitable en démo.
 */
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePlannerStore } from "@/store/usePlannerStore";
import { fallbackTeamMembers, memberInitials } from "@/lib/team";
import type { TeamMember } from "@/lib/types";

type ProfileRow = { id: string; full_name: string; role: string; avatar_url: string | null };

function toTeamMember(row: ProfileRow, index: number): TeamMember {
  const colors = ["#69D2FF", "#B5A1FF", "#6FE3C1", "#F0B36D", "#FF8BA7"];
  return { id: row.id, name: row.full_name || "Agent", role: row.role, initials: memberInitials(row.full_name || "Agent"), color: colors[index % colors.length], status: "online", avatarUrl: row.avatar_url ?? undefined };
}

export function useSupabaseTeamSync() {
  const setTeamMembers = usePlannerStore((state) => state.setTeamMembers);
  useEffect(() => {
    const client = supabase;
    if (!client) { setTeamMembers(fallbackTeamMembers); return; }
    let active = true;
    const load = async () => {
      const { data, error } = await client.from("profiles").select("id,full_name,role,avatar_url").order("full_name", { ascending: true });
      if (!active) return;
      if (error || !data?.length) { if (error) console.info("ME Planner: profils d’équipe non disponibles, conservation du roster local."); return; }
      setTeamMembers((data as ProfileRow[]).map(toTeamMember));
    };
    void load();
    const channel = client.channel("me-planner-profiles").on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => { void load(); }).subscribe();
    return () => { active = false; void client.removeChannel(channel); };
  }, [setTeamMembers]);
}

