/**
 * Direction visuelle : Aquarelle de contrôle — préférences concrètes, thèmes visibles,
 * contrôles réversibles et feedback immédiat plutôt que lignes décoratives.
 */
import { useState } from "react";
import { Check, Moon, Palette, Sparkles, Sun } from "lucide-react";
import { usePlannerStore } from "@/store/usePlannerStore";
import type { ThemeName } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { KeyboardShortcutsSettings } from "@/components/KeyboardShortcutsSettings";

const themeOptions: { id: ThemeName; label: string; description: string; icon: typeof Moon; swatch: string }[] = [
  { id: "dark", label: "Dark", description: "Bleu nuit pour les longues sessions.", icon: Moon, swatch: "#162033" },
  { id: "light", label: "Light", description: "Lumière douce et contrastée.", icon: Sun, swatch: "#EEF3F6" },
  { id: "bluesky", label: "BlueSky", description: "Un espace clair et aquatique.", icon: Palette, swatch: "#C6EFFF" },
  { id: "aurora", label: "Aurora", description: "Un accent menthe plus organique.", icon: Sparkles, swatch: "#78E0C0" },
];

export default function SettingsWorkspace() {
  const store = usePlannerStore();
  const { locale, setLocale, t } = useI18n();
  const [motionEnabled, setMotionEnabled] = useState(() => localStorage.getItem("me-planner-motion") !== "off");
  const [weekStart, setWeekStart] = useState("Lundi");
  const [saved, setSaved] = useState(false);
  const toggleMotion = () => { const next = !motionEnabled; setMotionEnabled(next); localStorage.setItem("me-planner-motion", next ? "on" : "off"); document.documentElement.dataset.motion = next ? "on" : "off"; setSaved(true); };
  return <div className="workspace-content"><div className="view-header"><div><span className="eyebrow">Préférences</span><h1>{locale === "en" ? "Set your " : "Configurer votre "}<em>cadence.</em></h1><p className="hero-subtitle">{locale === "en" ? "Choose an ambiance and rules that keep you in the flow." : "Choisissez une ambiance et des règles qui vous aident à rester dans le fil."}</p></div>{saved && <div className="settings-saved"><Check size={14} /> {t("settings.saved")}</div>}</div><section className="glass-panel theme-settings-panel"><div className="settings-card-head"><div className="settings-icon"><Palette size={18} /></div><div><h3>{locale === "en" ? "Interface theme" : "Thème d’interface"}</h3><p>{locale === "en" ? "Saved on this device and in your profile." : "Le choix est conservé sur cet appareil et dans votre profil."}</p></div></div><div className="theme-option-grid">{themeOptions.map((option) => { const Icon = option.icon; return <button key={option.id} className={`theme-option ${store.theme === option.id ? "selected" : ""}`} onClick={() => { store.setTheme(option.id); setSaved(true); }}><span className="theme-option-swatch" style={{ background: option.swatch }}><Icon size={16} /></span><span><strong>{option.label}</strong><small>{option.description}</small></span>{store.theme === option.id && <Check size={16} />}</button>; })}</div></section><div className="settings-grid"><section className="glass-panel settings-card"><div className="settings-card-head"><div className="settings-icon mint"><Sparkles size={18} /></div><div><h3>{locale === "en" ? "Interface rhythm" : "Rythme de l’interface"}</h3><p>{locale === "en" ? "Effects that support without distracting." : "Des effets qui accompagnent sans distraire."}</p></div></div><div className="settings-line"><span>Arrière-plan lava-lamp</span><button className={`toggle ${motionEnabled ? "active" : ""}`} onClick={toggleMotion} aria-pressed={motionEnabled}><i /></button></div><div className="settings-line"><span>Animations de transition</span><button className={`toggle ${motionEnabled ? "active" : ""}`} onClick={toggleMotion} aria-pressed={motionEnabled}><i /></button></div></section><section className="glass-panel settings-card"><div className="settings-card-head"><div className="settings-icon"><Moon size={18} /></div><div><h3>{locale === "en" ? "Organisation" : "Organisation"}</h3><p>{locale === "en" ? "Your planning reference points." : "Les repères de votre planning."}</p></div></div><div className="settings-line"><span>{locale === "en" ? "First day of the week" : "Premier jour de la semaine"}</span><select className="settings-select" value={weekStart} onChange={(event) => { setWeekStart(event.target.value); setSaved(true); }}><option value="Lundi">{locale === "en" ? "Monday" : "Lundi"}</option><option value="Dimanche">{locale === "en" ? "Sunday" : "Dimanche"}</option></select></div><div className="settings-line"><span>{t("settings.language")}</span><select className="settings-select" value={locale} onChange={(event) => { const next = event.target.value as "fr" | "en"; setLocale(next); store.setProfile({ locale: next }); setSaved(true); }}><option value="fr">Français</option><option value="en">English</option></select></div></section></div><KeyboardShortcutsSettings onSaved={() => setSaved(true)} /></div>;
}

