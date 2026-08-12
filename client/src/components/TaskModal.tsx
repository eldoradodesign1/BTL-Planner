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
    const projectColor = project === "Northstar rebrand" ? "#69D2FF" : project === "Équipe produit" ? "#B5A1FF" : project === "Studio Aurora" ? "#6FE3C1" : "#F0B36D";
    const patch = { title: cleanTitle, project, priority, date, start, end, estimate: displayDuration(duration), reminderAt: reminderAt ? new Date(reminderAt).toISOString() : undefined, assigneeId };
    const isUuid = Boolean(existing?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing.id));
    try {
      if (supabase) {
        const { data: auth } = await supabase.auth.getUser();
        if (auth.user && existing && isUuid) {
          const result = await supabase.from("tasks").update({ title: cleanTitle, priority, assignee_id: assigneeId, start_at: toIso(date, start), end_at: toIso(date, end), estimated_minutes: duration, reminder_at: reminderAt ? new Date(reminderAt).toISOString() : null, color: projectColor }).eq("id", existing.id);
          if (result.error) throw result.error;
          store.updateTask(existing.id, { ...patch, projectColor });
        } else if (auth.user && !existing) {
          const result = await supabase.from("tasks").insert({ title: cleanTitle, creator_id: auth.user.id, assignee_id: canManageTeam ? assigneeId : auth.user.id, status: "todo", priority, start_at: toIso(date, start), end_at: toIso(date, end), estimated_minutes: duration, reminder_at: reminderAt ? new Date(reminderAt).toISOString() : null, color: projectColor, tags: ["Nouveau"] }).select("id").single();
          if (result.error || !result.data) throw result.error ?? new Error("La tâche n’a pas pu être enregistrée.");
          store.addTask({ id: result.data.id, ...patch, projectColor, category: "À organiser", status: "todo", assigneeId: canManageTeam ? assigneeId : auth.user.id, progress: 0, tags: ["Nouveau"] });
        } else if (existing) store.updateTask(existing.id, { ...patch, projectColor });
        else store.addTask({ id: `task-${Date.now()}`, ...patch, projectColor, category: "À organiser", status: "todo", assigneeId: canManageTeam ? assigneeId : "self", progress: 0, tags: ["Nouveau"] });
      } else if (existing) store.updateTask(existing.id, { ...patch, projectColor });
      else store.addTask({ id: `task-${Date.now()}`, ...patch, projectColor, category: "À organiser", status: "todo", assigneeId: canManageTeam ? assigneeId : "self", progress: 0, tags: ["Nouveau"] });
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "La tâche n’a pas pu être enregistrée."); setPending(false); return; }
    setPending(false);
  };

  return <AnimatePresence><motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={store.closeTaskModal}><motion.div className="task-modal" initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">{existing ? "Modifier la tâche" : "Nouvelle tâche"}</span><h2>{existing ? "Affiner le prochain mouvement" : "Planifier une tâche"}</h2></div><button className="icon-button" onClick={store.closeTaskModal} aria-label="Fermer"><X size={18} /></button></div><div className="modal-field primary-field"><label htmlFor="task-title">Titre de la tâche</label><input id="task-title" autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Préparer la revue client" /></div><div className="form-grid"><div className="modal-field"><label>Projet</label><div className="custom-select"><FolderKanban size={16} /><select value={project} onChange={(event) => setProject(event.target.value)}><option>Northstar rebrand</option><option>Équipe produit</option><option>Studio Aurora</option><option>Portail Mon Essentiel</option></select></div></div><div className="modal-field"><label>Responsable</label><div className="custom-select"><UserRound size={16} /><select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)} disabled={!canManageTeam}>{store.teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></div></div><div className="modal-field"><label>Priorité</label><div className="custom-select"><Flag size={16} /><select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></div><div className="modal-field"><label htmlFor="task-date">Date</label><div className="custom-select"><CalendarDays size={16} /><input id="task-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div></div><div className="modal-field"><label htmlFor="task-start">Début</label><div className="custom-select"><Clock3 size={16} /><input id="task-start" type="time" value={start} onChange={(event) => setStart(event.target.value)} /></div></div><div className="modal-field"><label htmlFor="task-end">Fin</label><div className="custom-select"><Clock3 size={16} /><input id="task-end" type="time" value={end} onChange={(event) => setEnd(event.target.value)} /></div></div><div className="modal-field"><label htmlFor="task-reminder">Rappel</label><div className="custom-select"><Clock3 size={16} /><input id="task-reminder" type="datetime-local" value={reminderAt} onChange={(event) => setReminderAt(event.target.value)} /></div></div></div><div className="modal-suggestion"><Sparkles size={16} /><span>La tâche sera positionnée dans le calendrier à la date et à l’heure choisies. Le rappel apparaîtra dans vos notifications.</span></div>{error && <div className="auth-feedback error task-error">{error}</div>}<div className="modal-footer"><button className="secondary-button" onClick={store.closeTaskModal}>Annuler</button><button className="primary-button" onClick={() => void save()} disabled={!title.trim() || pending || duration <= 0}>{pending ? "Enregistrement…" : existing ? "Enregistrer" : "Ajouter au planning"}<span>↗</span></button></div></motion.div></motion.div></AnimatePresence>;
}
