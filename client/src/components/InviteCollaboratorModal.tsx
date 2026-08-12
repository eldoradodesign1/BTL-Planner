/**
 * Direction visuelle : Aquarelle de contrôle — modal courte, explicite et sûre,
 * qui prépare une invitation sans exiger de clé service-role côté navigateur.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail, Send, ShieldCheck, X } from "lucide-react";
import { useMemo, useState } from "react";

type InviteCollaboratorModalProps = { onClose: () => void };

export function InviteCollaboratorModal({ onClose }: InviteCollaboratorModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [feedback, setFeedback] = useState("");
  const validEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);
  const roleLabel = role === "director" ? "Directeur" : role === "admin" ? "Administrateur" : "Membre de l’équipe";
  const inviteMessage = `Bonjour,\n\nVous êtes invité(e) à rejoindre ME Planner — Mon Essentiel en tant que ${roleLabel}.\n\nOuvrez votre espace ME Planner pour finaliser votre accès.\n\nÀ bientôt.`;

  const copyMessage = async () => {
    await navigator.clipboard?.writeText(inviteMessage);
    setFeedback("Message d’invitation copié.");
  };
  const openMailClient = () => {
    if (!validEmail) return;
    window.location.href = `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent("Invitation à rejoindre ME Planner")}&body=${encodeURIComponent(inviteMessage)}`;
    setFeedback("Votre logiciel de messagerie a été ouvert avec le message prêt à envoyer.");
  };

  return <AnimatePresence><motion.div className="modal-backdrop invite-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.div className="invite-modal glass-panel" role="dialog" aria-modal="true" aria-labelledby="invite-title" initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">Équipe Mon Essentiel</span><h2 id="invite-title">Inviter un collaborateur</h2></div><button className="icon-button" onClick={onClose} aria-label="Fermer"><X size={18} /></button></div><div className="invite-security-note"><ShieldCheck size={16} /><span>L’invitation est préparée localement : aucune clé sensible n’est exposée dans le navigateur.</span></div><div className="modal-field primary-field"><label htmlFor="invite-email">Adresse email professionnelle</label><div className="invite-input"><Mail size={16} /><input id="invite-email" type="email" autoFocus value={email} onChange={(event) => { setEmail(event.target.value); setFeedback(""); }} placeholder="collaborateur@entreprise.com" /></div></div><div className="modal-field"><label htmlFor="invite-role">Rôle proposé</label><div className="custom-select"><ShieldCheck size={16} /><select id="invite-role" value={role} onChange={(event) => setRole(event.target.value)}><option value="member">Membre de l’équipe</option><option value="director">Directeur</option><option value="admin">Administrateur</option></select></div></div>{feedback && <div className="invite-feedback" role="status"><Check size={15} /> {feedback}</div>}<div className="modal-footer invite-footer"><button className="secondary-button compact" onClick={() => void copyMessage()}><Copy size={14} /> Copier le message</button><button className="primary-button compact" onClick={openMailClient} disabled={!validEmail}><Send size={14} /> Préparer l’email</button></div></motion.div></motion.div></AnimatePresence>;
}

