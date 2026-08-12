/**
 * Direction visuelle : Aquarelle de contrôle — microcopies courtes, vocabulaire stable
 * et changement de langue immédiat, sans déplacer l’utilisateur dans le produit.
 */
import { createContext, useContext, useMemo, useState } from "react";

export type Locale = "fr" | "en";
type Dictionary = Record<string, string>;
const dictionaries: Record<Locale, Dictionary> = {
  fr: { "nav.dashboard": "Vue d’ensemble", "nav.calendar": "Calendrier", "nav.tasks": "Mes tâches", "nav.projects": "Projets", "nav.inbox": "Boîte de réception", "nav.chat": "Conversations", "nav.team": "Équipe", "nav.settings": "Préférences", "profile": "Profil", "settings.title": "Configurer votre cadence.", "settings.language": "Langue", "settings.saved": "Préférences enregistrées", "today": "Aujourd’hui", "search": "Rechercher", "newTask": "Nouvelle tâche", "save": "Enregistrer" },
  en: { "nav.dashboard": "Overview", "nav.calendar": "Calendar", "nav.tasks": "My tasks", "nav.projects": "Projects", "nav.inbox": "Inbox", "nav.chat": "Conversations", "nav.team": "Team", "nav.settings": "Preferences", "profile": "Profile", "settings.title": "Set your cadence.", "settings.language": "Language", "settings.saved": "Preferences saved", "today": "Today", "search": "Search", "newTask": "New task", "save": "Save" },
};
type I18nContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: string) => string };
const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => (localStorage.getItem("me-planner-locale") as Locale) || "fr");
  const setLocale = (next: Locale) => { setLocaleState(next); localStorage.setItem("me-planner-locale", next); document.documentElement.lang = next; };
  const value = useMemo(() => ({ locale, setLocale, t: (key: string) => dictionaries[locale][key] ?? dictionaries.fr[key] ?? key }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n() { const value = useContext(I18nContext); if (!value) throw new Error("useI18n doit être utilisé dans I18nProvider"); return value; }
