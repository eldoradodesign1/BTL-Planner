/**
 * Direction visuelle : Aquarelle de contrôle — le filtre multi-agents expose la
 * sélection d’équipe comme une commande calme, réversible et immédiatement lisible.
 */
import { Check, ChevronDown, UsersRound, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { TeamMember } from "@/lib/types";

type AgentMultiSelectProps = {
  members: TeamMember[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
  label?: string;
};

export function AgentMultiSelect({ members, selectedIds, onToggle, onSelectAll, onClear, label = "Agents" }: AgentMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedCount = members.filter((member) => selectedSet.has(member.id)).length;
  const allSelected = members.length > 0 && selectedCount === members.length;

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, []);

  return <div className="agent-multi-select" ref={ref}><button className={`agent-select-button ${open ? "is-open" : ""}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="listbox"><UsersRound size={14} /><span>{label}</span><strong>{selectedCount === members.length && members.length > 0 ? "Tous" : `${selectedCount}/${members.length}`}</strong><ChevronDown size={14} /></button>{open && <div className="agent-select-panel" role="listbox" aria-label={`Sélectionner ${label.toLowerCase()}`} aria-multiselectable="true"><div className="agent-select-actions"><button onClick={onSelectAll} disabled={allSelected}>Tout sélectionner</button><button onClick={onClear} disabled={selectedCount === 0}>Tout désélectionner</button></div>{members.length ? members.map((member) => { const selected = selectedSet.has(member.id); return <button className={`agent-option ${selected ? "is-selected" : ""}`} key={member.id} onClick={() => onToggle(member.id)} role="option" aria-selected={selected}><span className="agent-option-avatar" style={{ color: member.color, background: `${member.color}20` }}>{member.initials}</span><span className="agent-option-copy"><strong>{member.name}</strong><small>{member.role === "super_admin" ? "Super Admin" : member.role === "director" ? "Directeur" : "Équipe"}</small></span>{selected && <Check size={15} />}</button>; }) : <div className="agent-select-empty">Aucun agent disponible.</div>}<button className="agent-select-close" onClick={() => setOpen(false)}><X size={13} /> Fermer</button></div>}</div>;
}

