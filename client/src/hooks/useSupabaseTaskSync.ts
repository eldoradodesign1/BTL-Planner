/**
 * Direction visuelle : Aquarelle de contrôle — la synchronisation est silencieuse et fiable,
 * avec maintien du fallback local lorsque la migration n’est pas encore appliquée.
 */
import { useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { usePlannerStore } from "@/store/usePlannerStore";
import type { PlannerTask, TaskPriority, TaskStatus } from "@/lib/types";

type SupabaseTask = { id: string; title: string; status: TaskStatus; priority: TaskPriority; start_at: string | null; end_at: string | null; estimated_minutes: number | null; spent_minutes: number | null; color: string | null; tags: string[] | null; starred: boolean | null; reminder_at?: string | null; assignee_id: string | null; projects?: { name: string; color: string } | { name: string; color: string }[] | null };

function toPlannerTask(row: SupabaseTask): PlannerTask {
  const project = Array.isArray(row.projects) ? row.projects[0] : row.projects;
  const date = row.start_at ? format(new Date(row.start_at), "yyyy-MM-dd") : undefined;
  const start = row.start_at ? format(new Date(row.start_at), "HH:mm") : "09:00";
  const end = row.end_at ? format(new Date(row.end_at), "HH:mm") : "10:00";
  const estimated = row.estimated_minutes ?? 60;
  const progress = row.status === "done" ? 100 : row.status === "in_progress" ? Math.min(92, Math.round(((row.spent_minutes ?? 0) / estimated) * 100)) : 0;
  return { id: row.id, title: row.title, project: project?.name ?? "Sans projet", projectColor: row.color ?? project?.color ?? "#69D2FF", category: "Planification", status: row.status, priority: row.priority, assigneeId: row.assignee_id ?? "self", start, end, estimate: estimated >= 60 ? `${Math.round(estimated / 60)}h` : `${estimated} min`, progress, tags: row.tags ?? [], date, starred: row.starred ?? false, reminderAt: row.reminder_at ?? undefined };
}

export function useSupabaseTaskSync() {
  const setTasks = usePlannerStore((state) => state.setTasks);
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let active = true;
    const load = async () => {
      const withReminder = await client.from("tasks").select("id,title,status,priority,start_at,end_at,estimated_minutes,spent_minutes,color,tags,starred,reminder_at,assignee_id,projects(name,color)").order("start_at", { ascending: true });
      let data = withReminder.data as unknown as SupabaseTask[] | null;
      let error = withReminder.error;
      if (error && error.message.includes("reminder_at")) {
        const withoutReminder = await client.from("tasks").select("id,title,status,priority,start_at,end_at,estimated_minutes,spent_minutes,color,tags,starred,assignee_id,projects(name,color)").order("start_at", { ascending: true });
        data = withoutReminder.data as unknown as SupabaseTask[] | null;
        error = withoutReminder.error;
      }
      if (!active) return;
      if (error) { console.info("ME Planner: migration Supabase non disponible, conservation du mode local."); return; }
      const nextTasks = ((data ?? []) as SupabaseTask[]).map(toPlannerTask);
      setTasks(nextTasks);
    };
    void load();
    const channel = client.channel("me-planner-tasks").on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => { void load(); }).subscribe();
    return () => { active = false; void client.removeChannel(channel); };
  }, [setTasks]);
}
