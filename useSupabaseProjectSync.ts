/**
 * Direction visuelle : Aquarelle de contrôle — création nette, sélection collective
 * explicite et feedback immédiat pour les responsables de portefeuille.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Check, FolderKanban, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AgentMultiSelect } from "@/components/AgentMultiSelect";
import { isAdminRole } from "@/lib/team";
import { supabase } from "@/lib/supabase";
import { usePlannerStore } from "@/store/usePlannerStore";
import type { PlannerProject } from "@/lib/types";

const colors = ["#69D2FF", "#B5A1FF", "#6FE3C1", "#F0B36D", "#FF8BA7"];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function NewProjectModal() {
  const store = usePlannerStore();
  const existing = store.projects.find((project) => project.id === store.selectedProjectId);
  const canManageProjects = isAdminRole(store.profile.role);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(existing?.name ?? "");
    setDescription(existing?.description ?? "");
    setColor(existing?.color ?? colors[0]);
    setSelectedIds(existing?.memberIds.length ? existing.memberIds : store.teamMembers.map((member) => member.id));
    setError("");
  }, [existing?.id, existing?.name, existing?.description, existing?.color, existing?.memberIds, store.teamMembers]);

  if (!store.projectModalOpen) return null;

  const toggle = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const save = async () => {
    if (!canManageProjects) { setError("Seuls les administrateurs et directeurs peuvent créer un projet."); return; }
    const cleanName = name.trim();
    if (!cleanName) { setError("Donnez un nom au projet avant de continuer."); return; }
    if (!selectedIds.length) { setError("Sélectionnez au moins un agent à affecter au projet."); return; }
    if (pending) return;
    setPending(true); setError("");
    try {
      const client = supabase;
      if (client) {
        const { data: auth } = await client.auth.getUser();
        if (auth.user) {
          const result = await client.from("projects").insert({ name: cleanName, description: description.trim() || null, color, created_by: auth.user.id }).select("id,name,description,color,created_by,created_at,archived").single();
          if (result.error || !result.data) throw result.error ?? new Error("Le projet n’a pas pu être créé.");
          const memberRows = selectedIds.filter((id) => uuidPattern.test(id)).map((profileId) => ({ project_id: result.data.id, profile_id: profileId }));
          let membershipPending = false;
          if (memberRows.length) {
            const memberResult = await client.from("project_members").insert(memberRows);
            if (memberResult.error) {
              membershipPending = true;
            }
          }
          const project: PlannerProject = { id: result.data.id, name: result.data.name, description: result.data.description ?? "Projet suivi par l’équipe.", color: result.data.color ?? color, memberIds: selectedIds, createdBy: result.data.created_by, createdAt: result.data.created_at ?? undefined, archived: result.data.archived ?? false };
          if (existing) store.updateProject(existing.id, project); else store.addProject(project);
          if (membershipPending) store.addNotification({ id: `project-members-${result.data.id}`, title: "Projet créé", description: "Les agents sont conservés localement. Appliquez supabase/project_members.sql pour synchroniser leurs affectations.", time: "À l’instant", unread: true, type: "system" });
        } else {
          store.addProject({ id: `project-${Date.now()}`, name: cleanName, description: description.trim() || "Projet suivi par l’équipe.", color, memberIds: selectedIds, createdBy: store.profile.id });
        }
      } else {
        store.addProject({ id: `project-${Date.now()}`, name: cleanName, description: description.trim() || "Projet suivi par l’équipe.", color, memberIds: selectedIds, createdBy: store.profile.id });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Le projet n’a pas pu être enregistré.");
      setPending(false);
      return;
    }
    setPending(false);
  };

  return <AnimatePresence><motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={store.closeProjectModal}><motion.div className="task-modal project-modal" initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">Portefeuille</span><h2>{existing ? "Modifier le projet" : "Nouveau projet"}</h2></div><button className="icon-button" onClick={store.closeProjectModal} aria-label="Fermer"><X size={18} /></button></div><div className="modal-field primary-field"><label htmlFor="project-name">Nom du projet</label><div className="project-name-input"><FolderKanban size={16} /><input id="project-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Refonte du portail client" /></div></div><div className="modal-field"><label htmlFor="project-description">Description</label><textarea id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Quel résultat l’équipe doit-elle obtenir ?" rows={3} /></div><div className="modal-field"><span className="modal-label">Couleur du projet</span><div className="project-color-picker" role="radiogroup" aria-label="Couleur du projet">{colors.map((item) => <button type="button" key={item} className={`project-color-choice ${color === item ? "is-selected" : ""}`} style={{ background: item }} onClick={() => setColor(item)} aria-label={`Choisir la couleur ${item}`} aria-pressed={color === item}>{color === item && <Check size={14} />}</button>)}</div></div><div className="project-members-field"><div><span className="modal-label">Agents affectés</span><small>{selectedIds.length} agent{selectedIds.length > 1 ? "s" : ""} sélectionné{selectedIds.length > 1 ? "s" : ""}</small></div><AgentMultiSelect members={store.teamMembers} selectedIds={selectedIds} onToggle={toggle} onSelectAll={() => setSelectedIds(store.teamMembers.map((member) => member.id))} onClear={() => setSelectedIds([])} label="Affecter" /></div><div className="modal-suggestion"><Sparkles size={16} /><span>Les administrateurs et directeurs peuvent créer le projet et modifier son périmètre d’agents.</span></div>{error && <div className="auth-feedback error task-error" role="alert">{error}</div>}<div className="modal-footer"><button className="secondary-button" onClick={store.closeProjectModal}>Annuler</button><button className="primary-button" onClick={() => void save()} disabled={!name.trim() || !selectedIds.length || pending}>{pending ? "Création…" : existing ? "Enregistrer" : "Créer le projet"}<span>↗</span></button></div></motion.div></motion.div></AnimatePresence>;
}
