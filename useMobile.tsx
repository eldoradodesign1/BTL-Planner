/**
 * Direction visuelle : Aquarelle de contrôle — modal de planification concentré,
 * champs temporels explicites, validation immédiate et feedback sans ambiguïté.
 */
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock3, Flag, FolderKanban, Sparkles, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePlannerStore } from "@/store/usePlannerStore";
import { supabase } from "@/lib/supabase";
import type { PlannerTask, TaskPriority } from "@/lib/types";
import { isAdminRole } from "@/lib/team";
import { CustomDatePicker, CustomDateTimePicker, CustomSelect, CustomTimePicker } from "@/components/CustomControls";

const labels: Record<TaskPriority, string> = { urgent: "Urgente", high: "Haute", medium: "Moyenne", low: "Basse" };
const today = () => new Date().toISOString().slice(0, 10);
const minutesBetween = (start: string, end: string) => { const [sh, sm] = start.split(":").map(Number); const [eh, em] = end.split(":").map(Number); return (eh * 60 + em) - (sh * 60 + sm); };
const toIso = (date: string, time: string) => new Date(`${date}T${time}:00`).toISOString();
const displayDuration = (minutes: number) => minutes >= 60 ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ""}` : `${minutes} min`;

export function TaskModal() {
  const store = usePlannerStore();
  const existing = store.tasks.find((task) => task.id === store.selectedTaskId);
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("Northstar rebrand");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState("self");
  const [date, setDate] = useState(today);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [reminderAt, setReminderAt] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const duration = useMemo(() => minutesBetween(start, end), [start, end]);

  useEffect(() => {
    setTitle(existing?.title ?? ""); setProject(existing?.project ?? "Northstar rebrand"); setPriority(existing?.priority ?? "medium");
    setDate(existing?.date ?? today()); setStart(existing?.start ?? "09:00"); setEnd(existing?.end ?? "10:00"); setReminderAt(existing?.reminderAt ? existing.reminderAt.slice(0, 16) : ""); setAssigneeId(existing?.assigneeId ?? store.profile.id ?? "self"); setError("");
  }, [existing?.id, existing?.title, existing?.project, existing?.priority, existing?.date, existing?.start, existing?.end, existing?.reminderAt, existing?.assigneeId, store.profile.id]);

  if (!store.taskModalOpen) return null;
  const canManageTeam = isAdminRole(store.profile.role);

  const save = async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    if (duration <= 0) { setError("L’heure de fin doit être après l’heure de début."); return; }
    if (pending) return;
    setPending(true); setError("");
    const projectDefinition = store.projects.find((item) => item.name === project);
    const projectColor = projectDefinition?.color ?? "#69D2FF";
    const projectId = projectDefinition?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectDefinition.id) ? projectDefinition.id : null;
    const patch = { title: cleanTitle, project, priority, date, start, end, estimate: displayDuration(duration), reminderAt: reminderAt ? new Date(reminderAt).toISOString() : undefined, assigneeId };
    const isUuid = Boolean(existing?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing.id));
    try {
      if (supabase) {
        const { data: auth } = await supabase.auth.getUser();
        if (auth.user && existing && isUuid) {
          const result = await supabase.from("tasks").update({ title: cleanTitle, project_id: projectId, priority, assignee_id: assigneeId, start_at: toIso(date, start), end_at: toIso(date, end), estimated_minutes: duration, reminder_at: reminderAt ? new Date(reminderAt).toISOString() : null, color: projectColor }).eq("id", existing.id);
          if (result.error) throw result.error;
          store.updateTask(existing.id, { ...patch, projectColor });
        } else if (auth.user && !existing) {
          const result = await supabase.from("tasks").insert({ title: cleanTitle, project_id: projectId, creator_id: auth.user.id, assignee_id: canManageTeam ? assigneeId : auth.user.id, status: "todo", priority, start_at: toIso(date, start), end_at: toIso(date, end), estimated_minutes: duration, reminder_at: reminderAt ? new Date(reminderAt).toISOString() : null, color: projectColor, tags: ["Nouveau"] }).select("id").single();
          if (result.error || !result.data) throw result.error ?? new Error("La tâche n’a pas pu être enregistrée.");
          store.addTask({ id: result.data.id, ...patch, projectColor, category: "À organiser", status: "todo", assigneeId: canManageTeam ? assigneeId : auth.user.id, progress: 0, tags: ["Nouveau"] });
        } else if (existing) store.updateTask(existing.id, { ...patch, projectColor });
        else store.addTask({ id: `task-${Date.now()}`, ...patch, projectColor, category: "À organiser", status: "todo", assigneeId: canManageTeam ? assigneeId : "self", progress: 0, tags: ["Nouveau"] });
      } else if (existing) store.updateTask(existing.id, { ...patch, projectColor });
      else store.addTask({ id: `task-${Date.now()}`, ...patch, projectColor, category: "À organiser", status: "todo", assigneeId: canManageTeam ? assigneeId : "self", progress: 0, tags: ["Nouveau"] });
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "La tâche n’a pas pu être enregistrée."); setPending(false); return; }
    setPending(false);
  };

  return <AnimatePresence><motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={store.closeTaskModal}><motion.div className="task-modal" initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">{existing ? "Modifier la tâche" : "Nouvelle tâche"}</span><h2>{existing ? "Affiner le prochain mouvement" : "Planifier une tâche"}</h2></div><button className="icon-button" onClick={store.closeTaskModal} aria-label="Fermer"><X size={18} /></button></div><div className="modal-field primary-field"><label htmlFor="task-title">Titre de la tâche</label><input id="task-title" autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Préparer la revue client" /></div><div className="form-grid"><div className="modal-field"><label>Projet</label><CustomSelect icon={<FolderKanban size={16} />} value={project} onChange={setProject} options={store.projects.map((item) => ({ value: item.name, label: item.name }))} ariaLabel="Projet" /></div><div className="modal-field"><label>Responsable</label><CustomSelect icon={<UserRound size={16} />} value={assigneeId} onChange={setAssigneeId} disabled={!canManageTeam} options={store.teamMembers.map((member) => ({ value: member.id, label: member.name }))} ariaLabel="Responsable" /></div><div className="modal-field"><label>Priorité</label><CustomSelect icon={<Flag size={16} />} value={priority} onChange={(value) => setPriority(value as TaskPriority)} options={Object.entries(labels).map(([value, label]) => ({ value, label }))} ariaLabel="Priorité" /></div><div className="modal-field"><label htmlFor="task-date">Date</label><CustomDatePicker value={date} onChange={setDate} label="Date de la tâche" /></div><div className="modal-field"><label htmlFor="task-start">Début</label><CustomTimePicker value={start} onChange={setStart} label="Heure de début" /></div><div className="modal-field"><label htmlFor="task-end">Fin</label><CustomTimePicker value={end} onChange={setEnd} label="Heure de fin" /></div><div className="modal-field"><label htmlFor="task-reminder">Rappel</label><CustomDateTimePicker value={reminderAt} onChange={setReminderAt} label="Date du rappel" /></div></div><div className="modal-suggestion"><Sparkles size={16} /><span>La tâche sera positionnée dans le calendrier à la date et à l’heure choisies. Le rappel apparaîtra dans vos notifications.</span></div>{error && <div className="auth-feedback error task-error">{error}</div>}<div className="modal-footer"><button className="secondary-button" onClick={store.closeTaskModal}>Annuler</button><button className="primary-button" onClick={() => void save()} disabled={!title.trim() || pending || duration <= 0}>{pending ? "Enregistrement…" : existing ? "Enregistrer" : "Ajouter au planning"}<span>↗</span></button></div></motion.div></motion.div></AnimatePresence>;
}
