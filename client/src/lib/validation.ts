/**
 * Direction visuelle : Aquarelle de contrôle — les règles métier sont nommées et testables
 * pour éviter qu’une interaction rapide ne dégrade le planning partagé.
 */
import { z } from "zod";
import type { TaskPriority, TaskStatus } from "@/lib/types";

export const taskInputSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis.").max(240, "Le titre est trop long."),
  project: z.string().trim().min(1, "Le projet est requis."),
  priority: z.enum(["urgent", "high", "medium", "low"]),
});

export function progressForStatus(status: TaskStatus, spentMinutes = 0, estimatedMinutes = 60) {
  if (status === "done") return 100;
  if (status === "todo") return 0;
  if (status === "blocked") return Math.min(99, Math.max(0, Math.round((spentMinutes / Math.max(1, estimatedMinutes)) * 100)));
  return Math.min(99, Math.max(1, Math.round((spentMinutes / Math.max(1, estimatedMinutes)) * 100)));
}

export function priorityWeight(priority: TaskPriority) {
  return { urgent: 4, high: 3, medium: 2, low: 1 }[priority];
}

