/**
 * Direction visuelle : Aquarelle de contrôle — une préférence lisible, réversible
 * et immédiatement confirmée par l’affichage de la combinaison capturée.
 */
import { Keyboard, RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultShortcuts, formatShortcut, loadShortcuts, saveShortcuts, type ShortcutAction, type ShortcutConfig } from "@/lib/shortcuts";

const labels: Record<ShortcutAction, { title: string; description: string }> = {
  command: { title: "Palette de commandes", description: "Ouvrir la recherche et les actions rapides." },
  newTask: { title: "Nouvelle tâche", description: "Ouvrir directement le formulaire de tâche." },
  dashboard: { title: "Vue d’ensemble", description: "Revenir au cockpit principal." },
  calendar: { title: "Calendrier", description: "Ouvrir le planning." },
  tasks: { title: "Tâches", description: "Ouvrir la liste de tâches." },
  chat: { title: "Conversations", description: "Ouvrir le chat interne." },
};

function displayKey(key: string) { return key === " " ? "space" : key.toLowerCase() === "escape" ? "esc" : key.toLowerCase(); }

export function KeyboardShortcutsSettings({ onSaved }: { onSaved: () => void }) {
  const [shortcuts, setShortcuts] = useState<ShortcutConfig>(() => loadShortcuts());
  const [capturing, setCapturing] = useState<ShortcutAction | null>(null);

  useEffect(() => {
    const stop = () => setCapturing(null);
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, []);

  const capture = (event: React.KeyboardEvent<HTMLElement>, action: ShortcutAction) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.key === "Tab") return;
    const parts: string[] = [];
    if (event.metaKey || event.ctrlKey) parts.push("mod");
    if (event.shiftKey) parts.push("shift");
    if (event.altKey) parts.push("alt");
    if (!["Meta", "Control", "Shift", "Alt", "AltGraph"].includes(event.key)) parts.push(displayKey(event.key));
    if (!parts.length) return;
    setShortcuts((current) => ({ ...current, [action]: parts.join("+") }));
    setCapturing(null);
  };

  const persist = () => { saveShortcuts(shortcuts); onSaved(); };
  const reset = () => { setShortcuts(defaultShortcuts); saveShortcuts(defaultShortcuts); onSaved(); };

  return <section className="glass-panel shortcuts-settings-panel"><div className="settings-card-head"><div className="settings-icon"><Keyboard size={18} /></div><div><h3>Raccourcis clavier</h3><p>Adaptez les commandes rapides à votre manière de travailler.</p></div></div><div className="shortcut-list">{(Object.keys(labels) as ShortcutAction[]).map((action) => <div className="shortcut-row" key={action}><div><strong>{labels[action].title}</strong><span>{labels[action].description}</span></div><button className={`shortcut-capture ${capturing === action ? "is-capturing" : ""}`} onClick={() => setCapturing(action)} onKeyDown={(event) => capture(event, action)} onBlur={() => setCapturing(null)} aria-label={`Modifier le raccourci ${labels[action].title}`}>{capturing === action ? "Appuyez sur les touches…" : formatShortcut(shortcuts[action])}</button></div>)}</div><div className="shortcuts-footer"><span>Les raccourcis sont désactivés dans les champs de saisie.</span><div><button className="secondary-button compact" onClick={reset}><RotateCcw size={13} /> Réinitialiser</button><button className="primary-button compact" onClick={persist}><Save size={13} /> Enregistrer</button></div></div></section>;
}
