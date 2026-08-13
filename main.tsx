/**
 * Direction visuelle : Aquarelle de contrôle — le portefeuille reste lisible,
 * synchronisé et utilisable immédiatement même si la migration des membres projet
 * n’a pas encore été appliquée.
 */
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePlannerStore } from "@/store/usePlannerStore";
import type { PlannerProject } from "@/lib/types";

type ProjectRow = { id: string; name: string; description: string | null; color: string | null; created_by: string; created_at: string | null; archived: boolean | null };
type ProjectMemberRow = { project_id: string; profile_id: string };

export function useSupabaseProjectSync() {
  const setProjects = usePlannerStore((state) => state.setProjects);
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let active = true;
    const load = async () => {
      const { data, error } = await client.from("projects").select("id,name,description,color,created_by,created_at,archived").order("created_at", { ascending: true });
      if (!active || error || !data?.length) {
        if (error) console.info("ME Planner: projets Supabase non disponibles, conservation du portefeuille local.");
        return;
      }
      const membership = await client.from("project_members").select("project_id,profile_id");
      const grouped = new Map<string, string[]>();
      const localProjects = new Map(usePlannerStore.getState().projects.map((project) => [project.id, project.memberIds]));
      if (!membership.error) {
        for (const row of (membership.data ?? []) as ProjectMemberRow[]) grouped.set(row.project_id, [...(grouped.get(row.project_id) ?? []), row.profile_id]);
      } else {
        console.info("ME Planner: project_members absent ou non accessible, les projets restent visibles sans roster.");
      }
      if (!active) return;
      const projects: PlannerProject[] = (data as ProjectRow[]).map((row) => ({ id: row.id, name: row.name, description: row.description ?? "Projet suivi par l’équipe.", color: row.color ?? "#69D2FF", memberIds: grouped.get(row.id) ?? localProjects.get(row.id) ?? [], createdBy: row.created_by, createdAt: row.created_at ?? undefined, archived: row.archived ?? false }));
      setProjects(projects);
    };
    void load();
    const channel = client.channel("me-planner-projects").on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => { void load(); }).subscribe();
    return () => { active = false; void client.removeChannel(channel); };
  }, [setProjects]);
}
