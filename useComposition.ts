/**
 * Direction visuelle : Aquarelle de contrôle — rail asymétrique, ruban contextuel,
 * verre translucide, iconographie Mon Essentiel et interactions courtes, prévisibles.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CalendarDays, CheckCircle2, ChevronDown, CircleHelp, Command, FolderKanban, Inbox, LayoutDashboard, LogOut, Menu, MessageCircle, Plus, Search, Settings, Users, X, Sparkles, SlidersHorizontal, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePlannerStore } from "@/store/usePlannerStore";
import type { ThemeName, ViewName } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useTaskReminderNotifications } from "@/hooks/useTaskReminderNotifications";
import { loadShortcuts, matchesShortcut } from "@/lib/shortcuts";
import { supabase } from "@/lib/supabase";

const logoUrl = `${import.meta.env.BASE_URL}assets/me-planner-monochrome.png`;
const navItems: { id: ViewName; label: string; icon: typeof LayoutDashboard; shortcut?: string }[] = [
  { id: "dashboard", label: "Vue d’ensemble", icon: LayoutDashboard },
  { id: "calendar", label: "Calendrier", icon: CalendarDays, shortcut: "M" },
  { id: "tasks", label: "Mes tâches", icon: CheckCircle2, shortcut: "N" },
  { id: "projects", label: "Projets", icon: FolderKanban },
  { id: "inbox", label: "Boîte de réception", icon: Inbox },
  { id: "chat", label: "Conversations", icon: MessageCircle },
];
const themes: { id: ThemeName; label: string; swatch: string }[] = [
  { id: "dark", label: "Dark", swatch: "#162033" },
  { id: "light", label: "Light", swatch: "#F1F5F8" },
  { id: "bluesky", label: "BlueSky", swatch: "#C6EFFF" },
  { id: "aurora", label: "Aurora", swatch: "#78E0C0" },
];

export function PlannerShell({ children }: { children: React.ReactNode }) {
  const store = usePlannerStore();
  const [commandOpen, setCommandOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { profile } = store;
  const { t } = useI18n();
  useTaskReminderNotifications();
  const initials = (profile.fullName ?? "").split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "ME";
  const logoStyle = { "--logo-image": `url("${logoUrl}")` } as React.CSSProperties;

  useEffect(() => {
    document.documentElement.dataset.theme = store.theme;
    localStorage.setItem("me-planner-theme", store.theme);
    const favicon = document.querySelector<HTMLLinkElement>("link[data-me-favicon]");
    if (favicon) favicon.href = `${import.meta.env.BASE_URL}assets/${store.theme === "dark" ? "favicon-dark.svg" : "favicon-light.svg"}`;
  }, [store.theme]);

  useEffect(() => {
    const persistedTheme = localStorage.getItem("me-planner-theme") as ThemeName | null;
    if (persistedTheme && themes.some((theme) => theme.id === persistedTheme) && persistedTheme !== store.theme) store.setTheme(persistedTheme);
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = Boolean(target?.closest("input, textarea, select, [contenteditable='true'], [role='textbox']"));
      if (isTyping) return;
      const shortcuts = loadShortcuts();
      if (matchesShortcut(event, shortcuts.command)) { event.preventDefault(); setCommandOpen(true); return; }
      if (matchesShortcut(event, shortcuts.newTask)) { event.preventDefault(); store.openTaskModal(); return; }
      if (matchesShortcut(event, shortcuts.dashboard)) { event.preventDefault(); store.setView("dashboard"); return; }
      if (matchesShortcut(event, shortcuts.calendar)) { event.preventDefault(); store.setView("calendar"); return; }
      if (matchesShortcut(event, shortcuts.tasks)) { event.preventDefault(); store.setView("tasks"); return; }
      if (matchesShortcut(event, shortcuts.chat)) { event.preventDefault(); store.setView("chat"); return; }
      if (event.key === "?") { event.preventDefault(); setCommandOpen(true); return; }
      if (event.key.toLowerCase() === "escape") { setCommandOpen(false); setProfileOpen(false); setNotificationsOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);

  const pageTitle = useMemo(() => {
    if (store.activeView === "profile") return t("profile");
    if (store.activeView === "admin") return t("nav.team");
    return store.activeView === "dashboard" ? t("nav.dashboard") : store.activeView === "calendar" ? t("nav.calendar") : store.activeView === "tasks" ? t("nav.tasks") : store.activeView === "projects" ? t("nav.projects") : store.activeView === "inbox" ? t("nav.inbox") : store.activeView === "chat" ? t("nav.chat") : t("nav.settings");
  }, [store.activeView, t]);
  const go = (view: ViewName) => { store.setView(view); setProfileOpen(false); setNotificationsOpen(false); };

  return <div className="planner-app min-h-screen overflow-hidden"><div className="lava-blob lava-blob-one" /><div className="lava-blob lava-blob-two" /><div className="lava-blob lava-blob-three" /><div className="ambient-orb ambient-orb-one" /><div className="ambient-orb ambient-orb-two" />
    <aside className={`planner-sidebar ${store.sidebarOpen ? "is-open" : "is-collapsed"}`} aria-label="Navigation principale">
      <div className="brand-lockup"><div className="brand-symbol brand-logo" style={logoStyle} role="img" aria-label="Mon Essentiel" />{store.sidebarOpen && <div><div className="brand-name">ME<span>.</span></div><div className="brand-caption">mon essentiel</div></div>}</div>
      <div className="sidebar-section-label">Espace de travail</div>
      <nav className="nav-stack">{navItems.map((item) => { const Icon = item.icon; const label = item.id === "dashboard" ? t("nav.dashboard") : item.id === "calendar" ? t("nav.calendar") : item.id === "tasks" ? t("nav.tasks") : item.id === "projects" ? t("nav.projects") : item.id === "inbox" ? t("nav.inbox") : t("nav.chat"); return <button key={item.id} className={`nav-item ${store.activeView === item.id ? "is-active" : ""}`} onClick={() => go(item.id)} title={!store.sidebarOpen ? label : undefined}><Icon size={18} strokeWidth={1.8} />{store.sidebarOpen && <><span>{label}</span>{item.shortcut && <kbd>{item.shortcut}</kbd>}</>}</button>; })}</nav>
      {store.sidebarOpen && <><div className="sidebar-section-heading"><span>Projets suivis</span><button className="icon-button subtle" aria-label="Créer un projet" onClick={() => { store.setView("projects"); store.openProjectModal(); }}><Plus size={15} /></button></div><div className="project-list">{store.projects.slice(0, 4).map((project) => <button className="project-link" onClick={() => store.setView("projects")} key={project.id}><i style={{ background: project.color }} />{project.name}<span>{store.tasks.filter((task) => task.project === project.name).length}</span></button>)}<button className="project-link project-link-action" onClick={() => { store.setView("projects"); store.openProjectModal(); }}><Plus size={13} />Nouveau projet</button></div></>}
      <div className="sidebar-bottom">{store.sidebarOpen && <div className="focus-card"><div className="focus-card-top"><Sparkles size={16} /><span>Focus de la journée</span></div><strong>3h 42 restantes</strong><div className="focus-meter"><span style={{ width: "64%" }} /></div><small>64% de votre planning est organisé</small></div>}<button className={`nav-item ${store.activeView === "admin" ? "is-active" : ""}`} onClick={() => go("admin")}><Users size={18} strokeWidth={1.8} />{store.sidebarOpen && <span>Équipe</span>}</button><button className={`nav-item ${store.activeView === "settings" ? "is-active" : ""}`} onClick={() => go("settings")}><Settings size={18} strokeWidth={1.8} />{store.sidebarOpen && <span>Préférences</span>}</button><button className="profile-mini" onClick={() => { setProfileOpen((current) => !current); setNotificationsOpen(false); }} aria-expanded={profileOpen}><div className="avatar avatar-self">{initials}</div>{store.sidebarOpen && <div className="profile-copy"><strong>{profile.fullName}</strong><span>{profile.role === "super_admin" ? "Super Admin" : profile.role}</span></div>}{store.sidebarOpen && <ChevronDown size={15} className={`profile-chevron ${profileOpen ? "is-open" : ""}`} />}</button></div>
    </aside>
    <main className={`planner-main ${store.sidebarOpen ? "with-sidebar" : "sidebar-hidden"}`}><header className="topbar"><div className="topbar-leading"><button className="icon-button mobile-menu" onClick={() => store.setSidebarOpen(!store.sidebarOpen)} aria-label="Afficher la navigation"><Menu size={19} /></button><div className="topbar-brand"><span className="topbar-logo brand-logo" style={logoStyle} role="img" aria-label="Mon Essentiel" /><span>ME<span>.</span></span></div><div className="breadcrumb"><span>/</span><strong>{pageTitle}</strong></div></div><div className="topbar-actions"><button className="search-trigger" onClick={() => setCommandOpen(true)}><Search size={16} /><span>{t("search")}</span><kbd>⌘ K</kbd></button><button className="icon-button" aria-label="Aide" onClick={() => setCommandOpen(true)}><CircleHelp size={18} /></button><div className="relative-popover"><button className="icon-button notification-button" aria-label="Notifications" onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}><Bell size={18} /><i /></button>{notificationsOpen && <NotificationPopover notifications={store.notifications} onNavigate={go} onRead={store.markNotificationRead} />}</div><div className="relative-popover"><button className="profile-trigger" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }} aria-expanded={profileOpen}><div className="avatar avatar-self">{initials}</div><ChevronDown size={14} className={profileOpen ? "is-open" : ""} /></button>{profileOpen && <ProfilePopover theme={store.theme} setTheme={store.setTheme} profileName={profile.fullName} onNavigate={go} onSignOut={async () => { await supabase?.auth.signOut(); setProfileOpen(false); }} />}</div></div></header><div className="context-ribbon"><button className="ribbon-date" onClick={() => go("calendar")}><span className="eyebrow">{t("today")}</span><strong>11 août 2026</strong></button><button className="ribbon-pulse" onClick={() => go("dashboard")}><i /><span>Fil de planification actif</span></button><div className="ribbon-actions"><button className={`ribbon-chip ${store.activeView === "calendar" ? "active" : ""}`} onClick={() => go("calendar")}><CalendarDays size={14} /> Planning</button><button className={`ribbon-chip ${store.activeView === "admin" ? "active" : ""}`} onClick={() => go("admin")}><Users size={14} /> {t("nav.team")}</button><button className="ribbon-icon" onClick={() => go("settings")} aria-label="Ouvrir les préférences"><SlidersHorizontal size={15} /></button></div></div><div className="main-scroll">{children}</div></main><AnimatePresence>{commandOpen && <CommandPalette close={() => setCommandOpen(false)} />}</AnimatePresence></div>;
}

function NotificationPopover({ notifications, onNavigate, onRead }: { notifications: { id: string; title: string; description: string; time: string; unread: boolean; type: string }[]; onNavigate: (view: ViewName) => void; onRead: (id: string) => void }) { return <motion.div initial={{ opacity: 0, y: 8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="popover-panel notification-popover"><div className="popover-header"><div><span className="eyebrow">Centre de notifications</span><h3>À ne pas manquer</h3></div><span className="unread-count">{notifications.filter((item) => item.unread).length} nouvelles</span></div>{notifications.length ? notifications.slice(0, 5).map((notification) => <button className="notification-row notification-button-row" key={notification.id} onClick={() => { onRead(notification.id); onNavigate(notification.type === "task" ? "calendar" : "inbox"); }}><div className="notification-dot cyan" /><div><strong>{notification.title}</strong><span>{notification.description} · {notification.time}</span></div></button>) : <div className="notification-empty">Aucun rappel récent.</div>}<button className="text-button" onClick={() => onNavigate("inbox")}>Voir toutes les notifications <span>→</span></button></motion.div>; }

function ProfilePopover({ theme, setTheme, profileName, onNavigate, onSignOut }: { theme: ThemeName; setTheme: (theme: ThemeName) => void; profileName: string; onNavigate: (view: ViewName) => void; onSignOut: () => void | Promise<void> }) { return <motion.div initial={{ opacity: 0, y: 8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="popover-panel profile-popover"><div className="profile-popover-head"><div className="avatar avatar-self large">{profileName.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "ME"}</div><div><strong>{profileName || "Compte actif"}</strong><span>Mon Essentiel</span></div></div><div className="theme-label">Thème d’interface</div><div className="theme-grid">{themes.map((item) => <button key={item.id} className={`theme-chip ${theme === item.id ? "selected" : ""}`} onClick={() => setTheme(item.id)}><i style={{ background: item.swatch }} />{item.label}</button>)}</div><button className="popover-menu-item" onClick={() => onNavigate("profile")}><UserRound size={16} /> Mon profil</button><button className="popover-menu-item" onClick={() => onNavigate("settings")}><Settings size={16} /> Préférences</button><button className="popover-menu-item danger" onClick={() => void onSignOut()}><LogOut size={16} /> Se déconnecter</button></motion.div>; }

function CommandPalette({ close }: { close: () => void }) { const store = usePlannerStore(); const commands: { label: string; icon: typeof Plus; action: () => void }[] = [{ label: "Créer une nouvelle tâche", icon: Plus, action: () => { store.openTaskModal(); close(); } }, { label: "Ouvrir le calendrier", icon: CalendarDays, action: () => { store.setView("calendar"); close(); } }, { label: "Voir mes tâches", icon: CheckCircle2, action: () => { store.setView("tasks"); close(); } }, { label: "Voir mon profil", icon: UserRound, action: () => { store.setView("profile"); close(); } }, { label: "Ouvrir l’équipe", icon: Users, action: () => { store.setView("admin"); close(); } }]; return <motion.div className="command-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}><motion.div className="command-panel" initial={{ opacity: 0, y: -16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} onClick={(event) => event.stopPropagation()}><div className="command-input"><Command size={18} /><input autoFocus placeholder="Rechercher une tâche, un projet ou une commande…" /><button onClick={close}><X size={16} /></button></div><div className="command-section-label">Actions rapides</div>{commands.map((command) => { const Icon = command.icon; return <button key={command.label} className="command-item" onClick={command.action}><Icon size={17} /><span>{command.label}</span><span className="command-enter">↵</span></button>; })}<div className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span><span><kbd>↵</kbd> ouvrir</span><span><kbd>esc</kbd> fermer</span></div></motion.div></motion.div>; }
