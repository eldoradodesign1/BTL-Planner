/*
 * Direction visuelle : Aquarelle de contrôle. Fond bleu nuit doux, cyan #69D2FF,
 * surfaces translucides, ombres diffuses, Space Grotesk + DM Sans et mouvements calmes.
 */
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
@theme inline { --radius-sm: calc(var(--radius) - 4px); --radius-md: calc(var(--radius) - 2px); --radius-lg: var(--radius); --radius-xl: calc(var(--radius) + 4px); --color-background: var(--background); --color-foreground: var(--foreground); --color-card: var(--card); --color-card-foreground: var(--card-foreground); --color-popover: var(--popover); --color-popover-foreground: var(--popover-foreground); --color-primary: var(--primary); --color-primary-foreground: var(--primary-foreground); --color-secondary: var(--secondary); --color-secondary-foreground: var(--secondary-foreground); --color-muted: var(--muted); --color-muted-foreground: var(--muted-foreground); --color-accent: var(--accent); --color-accent-foreground: var(--accent-foreground); --color-border: var(--border); --color-input: var(--input); --color-ring: var(--ring); }
:root { --radius: 1rem; --background: #0F1117; --foreground: #F6F8FB; --card: rgba(22,32,51,.76); --card-foreground: #F6F8FB; --popover: #182337; --popover-foreground: #F6F8FB; --primary: #69D2FF; --primary-foreground: #071018; --secondary: rgba(255,255,255,.06); --secondary-foreground: #E5EDF6; --muted: rgba(224,237,250,.58); --muted-foreground: rgba(224,237,250,.58); --accent: rgba(105,210,255,.12); --accent-foreground: #BFEFFF; --destructive: #FF8BA7; --destructive-foreground: #1C0911; --border: rgba(197,226,250,.12); --input: rgba(197,226,250,.1); --ring: #69D2FF; }
html[data-theme="light"] { --background: #EEF3F6; --foreground: #13202A; --card: rgba(255,255,255,.72); --card-foreground: #13202A; --popover: #fff; --popover-foreground: #13202A; --secondary: rgba(19,32,42,.06); --secondary-foreground: #274052; --muted: rgba(39,64,82,.6); --muted-foreground: rgba(39,64,82,.6); --accent: rgba(42,159,205,.1); --accent-foreground: #16769D; --border: rgba(24,61,83,.1); --input: rgba(24,61,83,.1); }
html[data-theme="bluesky"] { --background: #DDF2FB; --foreground: #102A3A; --card: rgba(255,255,255,.62); --card-foreground: #102A3A; --popover: #F7FDFF; --popover-foreground: #102A3A; --primary: #16769D; --primary-foreground: #E9FAFF; --secondary: rgba(16,42,58,.08); --secondary-foreground: #224A60; --muted: rgba(34,74,96,.6); --muted-foreground: rgba(34,74,96,.6); --accent: rgba(22,118,157,.11); --accent-foreground: #0F6D92; --border: rgba(16,42,58,.1); --input: rgba(16,42,58,.1); }
html[data-theme="aurora"] { --background: #101C25; --foreground: #F2FBF7; --card: rgba(28,53,56,.74); --card-foreground: #F2FBF7; --popover: #1B3438; --popover-foreground: #F2FBF7; --primary: #6FE3C1; --primary-foreground: #072017; --secondary: rgba(242,251,247,.07); --secondary-foreground: #E5FAF2; --muted: rgba(229,250,242,.58); --muted-foreground: rgba(229,250,242,.58); --accent: rgba(111,227,193,.12); --accent-foreground: #A2F4D9; --border: rgba(229,250,242,.12); --input: rgba(229,250,242,.1); }
* { box-sizing: border-box; } html { min-width: 320px; background: var(--background); } body { margin: 0; min-width: 320px; background: var(--background); color: var(--foreground); font-family: "DM Sans", sans-serif; -webkit-font-smoothing: antialiased; } button,input,select { font: inherit; } button { border: 0; } button:focus-visible,input:focus-visible,select:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
.planner-app { position: relative; isolation: isolate; min-height: 100vh; background: radial-gradient(circle at 80% -10%, rgba(105,210,255,.12), transparent 34%), var(--background); color: var(--foreground); } .planner-app::before { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: -2; background: linear-gradient(135deg, rgba(255,255,255,.02), transparent 28%, rgba(105,210,255,.025) 60%, transparent); } .ambient-orb { position: fixed; width: 30rem; height: 30rem; border-radius: 50%; filter: blur(70px); opacity: .14; pointer-events: none; z-index: -1; animation: drift 18s ease-in-out infinite alternate; } .ambient-orb-one { top: -15rem; right: 5rem; background: #69D2FF; } .ambient-orb-two { bottom: -20rem; left: 20rem; background: #B5A1FF; animation-delay: -8s; } @keyframes drift { from { transform: translate3d(-2%,-1%,0) scale(.96); } to { transform: translate3d(3%,2%,0) scale(1.03); } }
.planner-sidebar { position: fixed; inset: 0 auto 0 0; z-index: 20; width: 252px; display: flex; flex-direction: column; padding: 25px 14px 18px; border-right: 1px solid var(--border); background: rgba(10,16,26,.64); backdrop-filter: blur(26px); transition: width .22s ease, transform .22s ease; } [data-theme="light"] .planner-sidebar,[data-theme="bluesky"] .planner-sidebar { background: rgba(245,250,253,.7); } .planner-sidebar.is-collapsed { width: 80px; }
.brand-lockup { display: flex; align-items: center; gap: 11px; padding: 0 9px 33px; } .brand-symbol { width: 32px; height: 32px; display: grid; place-items: center; overflow: hidden; border-radius: 10px; background: linear-gradient(145deg, rgba(105,210,255,.35), rgba(181,161,255,.2)); box-shadow: 0 8px 24px rgba(105,210,255,.14); } .brand-symbol img { width: 24px; height: 24px; object-fit: contain; } .brand-name { font: 700 18px/1 "Space Grotesk",sans-serif; letter-spacing: -.04em; } .brand-name span { color: var(--primary); } .brand-caption { margin-top: 4px; color: var(--muted); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; }
.sidebar-section-label,.sidebar-section-heading { padding: 0 12px 10px; color: var(--muted); font-size: 10px; font-weight: 600; letter-spacing: .13em; text-transform: uppercase; } .sidebar-section-heading { display: flex; align-items: center; justify-content: space-between; margin-top: 30px; padding-bottom: 8px; } .nav-stack,.project-list { display: grid; gap: 4px; } .nav-item { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; color: var(--muted); background: transparent; text-align: left; cursor: pointer; transition: background .18s ease,color .18s ease,transform .18s ease; } .nav-item:hover { color: var(--foreground); background: rgba(255,255,255,.05); transform: translateX(2px); } .nav-item.is-active { color: var(--primary); background: linear-gradient(90deg,rgba(105,210,255,.13),rgba(105,210,255,.035)); box-shadow: inset 2px 0 var(--primary); } .nav-item span { flex: 1; font-size: 13px; font-weight: 500; } kbd { padding: 2px 5px; border: 1px solid var(--border); border-radius: 5px; color: var(--muted); background: rgba(255,255,255,.04); font: 10px "DM Sans",sans-serif; } .project-link { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 9px; color: var(--muted); background: none; text-align: left; font-size: 12px; cursor: pointer; } .project-link:hover { color: var(--foreground); background: rgba(255,255,255,.04); } .project-link i { width: 7px; height: 7px; border-radius: 50%; box-shadow: 0 0 10px currentColor; } .project-link span { margin-left: auto; font-size: 10px; opacity: .7; } .sidebar-bottom { display: grid; gap: 12px; margin-top: auto; }
.focus-card { padding: 13px 14px; border: 1px solid rgba(105,210,255,.16); border-radius: 15px; background: linear-gradient(145deg,rgba(105,210,255,.1),rgba(181,161,255,.04)); } .focus-card-top { display: flex; align-items: center; gap: 8px; color: var(--primary); font-size: 11px; } .focus-card strong { display: block; margin: 16px 0 9px; font: 600 16px "Space Grotesk",sans-serif; } .focus-card small { display: block; margin-top: 8px; color: var(--muted); font-size: 10px; } .focus-meter,.bar-track,.project-progress,.mini-progress { height: 5px; overflow: hidden; border-radius: 99px; background: rgba(255,255,255,.09); } .focus-meter span,.bar-track i,.project-progress i,.mini-progress i { display: block; height: 100%; border-radius: inherit; } .profile-mini,.profile-trigger { display: flex; align-items: center; gap: 10px; } .profile-mini { padding: 10px 9px 0; border-top: 1px solid var(--border); } .profile-copy { display: grid; flex: 1; gap: 2px; } .profile-copy strong { font-size: 12px; } .profile-copy span { color: var(--muted); font-size: 10px; } .profile-chevron { color: var(--muted); }
.avatar { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 9px; font-size: 9px; font-weight: 700; } .avatar.large { width: 38px; height: 38px; border-radius: 12px; } .avatar.tiny { width: 21px; height: 21px; border-radius: 7px; font-size: 8px; } .avatar-self { color: var(--primary); background: rgba(105,210,255,.14); } .avatar-lavender { color: #B5A1FF; background: rgba(181,161,255,.14); } .avatar-mint { color: #6FE3C1; background: rgba(111,227,193,.14); } .avatar-peach { color: #F0B36D; background: rgba(240,179,109,.14); }
.planner-main { min-height: 100vh; margin-left: 252px; transition: margin-left .22s ease; } .planner-main.sidebar-hidden { margin-left: 80px; } .topbar { position: sticky; top: 0; z-index: 10; height: 76px; display: flex; align-items: center; justify-content: space-between; padding: 0 38px; border-bottom: 1px solid var(--border); background: rgba(15,17,23,.66); backdrop-filter: blur(24px); } [data-theme="light"] .topbar,[data-theme="bluesky"] .topbar { background: rgba(238,243,246,.72); } .topbar-leading,.topbar-actions,.breadcrumb,.hero-actions,.eyebrow-row,.toolbar-actions,.filter-actions { display: flex; align-items: center; } .topbar-leading { gap: 14px; } .breadcrumb { gap: 10px; color: var(--muted); font-size: 12px; } .breadcrumb strong { color: var(--foreground); font-weight: 600; } .breadcrumb-divider { opacity: .35; } .topbar-actions { gap: 8px; } .search-trigger { height: 34px; min-width: 224px; display: flex; align-items: center; gap: 9px; padding: 0 10px; border: 1px solid var(--border); border-radius: 9px; color: var(--muted); background: rgba(255,255,255,.035); text-align: left; font-size: 12px; cursor: pointer; } .search-trigger kbd { margin-left: auto; font-size: 9px; }
.icon-button { width: 34px; height: 34px; display: inline-grid; place-items: center; border-radius: 9px; color: var(--muted); background: transparent; cursor: pointer; transition: color .18s ease,background .18s ease,transform .18s ease; } .icon-button:hover { color: var(--foreground); background: rgba(255,255,255,.07); } .icon-button:active,.primary-button:active,.secondary-button:active { transform: scale(.97); } .icon-button.subtle { width: 27px; height: 27px; } .notification-button { position: relative; } .notification-button i { position: absolute; top: 7px; right: 7px; width: 5px; height: 5px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 9px var(--primary); } .profile-trigger { padding: 4px 4px 4px 7px; border-radius: 10px; color: var(--muted); background: transparent; cursor: pointer; } .profile-trigger:hover { color: var(--foreground); background: rgba(255,255,255,.06); } .mobile-menu { display: none; } .relative-popover { position: relative; } .popover-panel { position: absolute; top: calc(100% + 12px); right: 0; z-index: 30; padding: 15px; border: 1px solid var(--border); border-radius: 17px; background: rgba(23,34,53,.94); box-shadow: 0 24px 60px rgba(0,0,0,.28); backdrop-filter: blur(26px); } [data-theme="light"] .popover-panel,[data-theme="bluesky"] .popover-panel { background: rgba(255,255,255,.95); } .notification-popover { width: 340px; } .popover-header,.profile-popover-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border); } .popover-header h3 { margin: 5px 0 0; font: 600 17px "Space Grotesk",sans-serif; } .unread-count { padding-top: 5px; color: var(--primary); font-size: 10px; } .notification-row { display: flex; gap: 11px; padding: 14px 3px; border-bottom: 1px solid var(--border); } .notification-row strong,.notification-row span { display: block; } .notification-row strong { font-size: 12px; font-weight: 600; } .notification-row span { margin-top: 4px; color: var(--muted); font-size: 10px; } .notification-dot { width: 8px; height: 8px; flex: 0 0 auto; margin-top: 4px; border-radius: 50%; } .notification-dot.cyan,.legend-dot.cyan { background: #69D2FF; box-shadow: 0 0 12px rgba(105,210,255,.6); } .notification-dot.mint,.legend-dot.mint { background: #6FE3C1; box-shadow: 0 0 12px rgba(111,227,193,.6); } .notification-dot.lavender,.legend-dot.lavender { background: #B5A1FF; box-shadow: 0 0 12px rgba(181,161,255,.6); } .notification-dot.peach,.legend-dot.peach { background: #F0B36D; box-shadow: 0 0 12px rgba(240,179,109,.6); } .profile-popover { width: 254px; } .profile-popover-head { align-items: center; justify-content: flex-start; } .profile-popover-head div:last-child { display: grid; gap: 3px; } .profile-popover-head span { color: var(--muted); font-size: 10px; } .theme-label { margin: 16px 0 8px; color: var(--muted); font-size: 10px; } .theme-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; } .theme-chip { display: inline-flex; align-items: center; gap: 7px; padding: 7px 8px; border: 1px solid transparent; border-radius: 8px; color: var(--muted); background: rgba(255,255,255,.04); font-size: 10px; cursor: pointer; } .theme-chip:hover,.theme-chip.selected { border-color: rgba(105,210,255,.35); color: var(--foreground); background: rgba(105,210,255,.08); } .theme-chip i { width: 10px; height: 10px; border: 1px solid rgba(255,255,255,.25); border-radius: 50%; } .popover-menu-item { width: 100%; display: flex; align-items: center; gap: 9px; padding: 10px 3px 0; color: var(--muted); background: none; text-align: left; font-size: 11px; cursor: pointer; }
.main-scroll { min-height: calc(100vh - 76px); padding: 34px 38px 48px; } .workspace-content { max-width: 1440px; margin: 0 auto; } .hero-row,.view-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 30px; } .eyebrow-row { gap: 11px; } .eyebrow { color: var(--muted); font-size: 10px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; } .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 8px; border: 1px solid rgba(111,227,193,.18); border-radius: 99px; color: #6FE3C1; background: rgba(111,227,193,.06); font-size: 9px; } .status-pill i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; box-shadow: 0 0 8px currentColor; } h1,h2,h3,p { margin: 0; } h1 { margin-top: 12px; font: 600 clamp(32px,4vw,48px)/1.05 "Space Grotesk",sans-serif; letter-spacing: -.05em; } h1 em { color: var(--primary); font-style: normal; } .hero-subtitle { margin-top: 10px; color: var(--muted); font-size: 13px; } .hero-actions { gap: 8px; } .primary-button,.secondary-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 15px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; transition: transform .18s ease,background .18s ease,box-shadow .18s ease; } .primary-button { color: var(--primary-foreground); background: var(--primary); box-shadow: 0 8px 22px rgba(105,210,255,.16); } .primary-button:hover { box-shadow: 0 11px 30px rgba(105,210,255,.27); } .primary-button:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; } .secondary-button { border: 1px solid var(--border); color: var(--foreground); background: rgba(255,255,255,.045); } .secondary-button:hover { background: rgba(255,255,255,.09); } .compact { padding: 9px 12px; font-size: 11px; } .glass-panel { border: 1px solid var(--border); background: linear-gradient(145deg,rgba(25,39,61,.66),rgba(18,26,40,.53)); box-shadow: 0 14px 42px rgba(0,0,0,.12),inset 0 1px rgba(255,255,255,.03); backdrop-filter: blur(20px); } [data-theme="light"] .glass-panel,[data-theme="bluesky"] .glass-panel { background: linear-gradient(145deg,rgba(255,255,255,.74),rgba(242,249,252,.6)); box-shadow: 0 12px 34px rgba(54,92,112,.08),inset 0 1px rgba(255,255,255,.6); }
.metrics-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; margin-bottom: 14px; } .metric-card { position: relative; min-height: 140px; overflow: hidden; padding: 17px 18px 15px; border-radius: 15px; } .metric-card::after { content: ""; position: absolute; right: -30px; bottom: -42px; width: 110px; height: 110px; border-radius: 50%; background: var(--metric-color); opacity: .08; filter: blur(9px); } .accent-cyan { --metric-color: #69D2FF; } .accent-mint { --metric-color: #6FE3C1; } .accent-lavender { --metric-color: #B5A1FF; } .accent-peach { --metric-color: #F0B36D; } .metric-head,.metric-foot { display: flex; align-items: center; justify-content: space-between; } .metric-head span,.metric-foot small { color: var(--muted); font-size: 11px; } .metric-icon { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 8px; color: var(--metric-color); background: color-mix(in srgb,var(--metric-color) 12%,transparent); } .metric-value { display: flex; align-items: baseline; gap: 7px; margin-top: 16px; } .metric-value strong { font: 600 29px/1 "Space Grotesk",sans-serif; letter-spacing: -.06em; } .metric-value span { color: var(--muted); font-size: 10px; } .metric-foot { justify-content: flex-start; gap: 8px; margin-top: 13px; } .metric-foot small { font-size: 10px; } .trend,.trend-up { color: var(--metric-color); font-size: 10px; font-weight: 700; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0,1.55fr) minmax(320px,.85fr); gap: 14px; } .calendar-panel,.workload-panel,.activity-panel,.admin-table,.settings-card,.task-list-panel,.calendar-shell,.calendar-toolbar,.inbox-panel { border-radius: 17px; padding: 20px; } .panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 15px; } .panel-header h2 { margin-top: 5px; font: 600 19px "Space Grotesk",sans-serif; letter-spacing: -.04em; } .view-all-button { display: inline-flex; align-items: center; gap: 6px; padding-top: 3px; color: var(--primary); background: none; font-size: 10px; cursor: pointer; } .mini-week { display: grid; grid-template-columns: repeat(7,1fr); gap: 6px; margin: 24px 0 22px; padding-bottom: 19px; border-bottom: 1px solid var(--border); } .mini-week button { position: relative; display: grid; justify-items: center; gap: 7px; padding: 9px 4px; border-radius: 10px; color: var(--muted); background: transparent; cursor: pointer; } .mini-week button:hover { background: rgba(255,255,255,.05); } .mini-week button.selected { color: var(--primary); background: rgba(105,210,255,.11); } .mini-week span { font-size: 10px; text-transform: capitalize; } .mini-week strong { font: 600 16px "Space Grotesk",sans-serif; } .mini-week i { position: absolute; bottom: -11px; width: 5px; height: 5px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 8px var(--primary); } .agenda-list { display: grid; gap: 7px; } .agenda-row { display: grid; grid-template-columns: 56px 1fr; gap: 11px; cursor: pointer; } .agenda-time { display: grid; align-content: start; gap: 4px; padding-top: 12px; } .agenda-time strong { font-size: 11px; } .agenda-time span { color: var(--muted); font-size: 10px; } .agenda-line { position: relative; padding-left: 12px; } .agenda-line>i { position: absolute; top: 14px; bottom: 14px; left: 0; width: 3px; border-radius: 99px; } .agenda-card { padding: 11px 12px; border: 1px solid transparent; border-radius: 11px; background: rgba(255,255,255,.035); transition: background .18s ease,border .18s ease,transform .18s ease; } .agenda-row:hover .agenda-card { transform: translateX(2px); border-color: var(--border); background: rgba(255,255,255,.06); } .agenda-card-top,.agenda-meta { display: flex; align-items: center; justify-content: space-between; } .agenda-category { color: var(--muted); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; } .agenda-card>strong { display: block; margin: 6px 0 9px; font-size: 12px; font-weight: 600; } .agenda-meta { justify-content: flex-start; gap: 12px; color: var(--muted); font-size: 9px; } .agenda-meta span { display: inline-flex; align-items: center; gap: 5px; } .agenda-meta span i { width: 5px; height: 5px; border-radius: 50%; } .priority { padding: 3px 6px; border-radius: 5px; background: rgba(255,255,255,.05); } .priority-urgent { color: #FF8BA7; background: rgba(255,139,167,.1); } .priority-high { color: #F0B36D; background: rgba(240,179,109,.1); } .add-slot { display: flex; align-items: center; gap: 7px; margin-top: 17px; padding: 9px 0 0 68px; color: var(--muted); background: none; font-size: 10px; cursor: pointer; } .add-slot:hover { color: var(--primary); }
.dashboard-side { display: grid; align-content: start; gap: 14px; } .workload-total { display: flex; align-items: center; gap: 13px; margin: 22px 0 18px; } .workload-total strong { font: 600 37px "Space Grotesk",sans-serif; letter-spacing: -.06em; } .workload-total strong span { color: var(--primary); font-size: 19px; } .workload-total div { display: grid; gap: 3px; } .workload-total small { color: var(--muted); font-size: 9px; } .workload-bars { display: grid; gap: 15px; } .workload-row { display: grid; grid-template-columns: 82px 1fr 29px; align-items: center; gap: 9px; } .person-meta { display: flex; align-items: center; gap: 7px; min-width: 0; } .person-meta span,.person-meta strong { overflow: hidden; color: var(--foreground); white-space: nowrap; text-overflow: ellipsis; font-size: 10px; } .bar-track { height: 4px; } .workload-row>strong { color: var(--muted); text-align: right; font-size: 10px; font-weight: 500; } .activity-feed { display: grid; gap: 16px; margin-top: 20px; } .activity-item { display: flex; gap: 10px; } .activity-item p { color: var(--muted); font-size: 10px; line-height: 1.45; } .activity-item p strong { color: var(--foreground); font-weight: 600; } .activity-item p b { color: var(--primary); font-weight: 500; } .activity-item span { display: block; margin-top: 4px; color: rgba(224,237,250,.35); font-size: 9px; } .text-button { display: inline-flex; align-items: center; gap: 7px; padding: 10px 0 1px; color: var(--primary); background: none; font-size: 11px; cursor: pointer; } .text-button.centered { width: 100%; justify-content: center; margin-top: 18px; border-top: 1px solid var(--border); } .bottom-strip { display: flex; align-items: center; gap: 20px; margin-top: 14px; padding: 15px 18px; border: 1px solid rgba(105,210,255,.13); border-radius: 15px; background: linear-gradient(90deg,rgba(105,210,255,.08),rgba(181,161,255,.05) 55%,rgba(111,227,193,.05)); } .strip-intro { display: flex; align-items: center; gap: 11px; min-width: 270px; } .strip-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 10px; color: var(--primary); background: rgba(105,210,255,.1); } .strip-intro div:last-child { display: grid; gap: 4px; } .strip-intro strong { font-size: 12px; } .strip-stats { display: flex; gap: 38px; margin-left: auto; } .strip-stats div { display: grid; gap: 3px; } .strip-stats span { color: var(--muted); font-size: 9px; } .strip-stats strong { font: 600 16px "Space Grotesk",sans-serif; } .strip-arrow { margin-left: auto; color: var(--primary); } .demo-notice { width: fit-content; margin: 16px auto 0; color: var(--muted); font-size: 10px; }
.calendar-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 14px; padding: 11px 13px; } .calendar-nav { display: flex; align-items: center; gap: 10px; } .calendar-nav strong { min-width: 128px; font: 600 15px "Space Grotesk",sans-serif; text-transform: capitalize; } .view-switch { display: flex; gap: 3px; padding: 3px; border-radius: 9px; background: rgba(255,255,255,.04); } .view-switch button { padding: 7px 11px; border-radius: 7px; color: var(--muted); background: transparent; font-size: 10px; cursor: pointer; } .view-switch button.active,.view-switch button:hover { color: var(--foreground); background: rgba(255,255,255,.08); } .calendar-shell { overflow-x: auto; padding: 0; } .calendar-grid-head,.calendar-grid-body { display: grid; grid-template-columns: 56px repeat(7,minmax(100px,1fr)); min-width: 820px; } .calendar-grid-head { border-bottom: 1px solid var(--border); } .time-column-label { padding: 17px 10px; color: var(--muted); font-size: 9px; } .day-label { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 8px; border-left: 1px solid var(--border); color: var(--muted); font-size: 10px; text-transform: capitalize; } .day-label strong { color: var(--foreground); font: 600 15px "Space Grotesk",sans-serif; } .day-label.today { color: var(--primary); background: rgba(105,210,255,.06); } .day-label.today strong { color: var(--primary); } .calendar-grid-body { height: 630px; } .time-column { display: grid; grid-template-rows: repeat(10,1fr); } .time-column span { padding: 10px 9px; color: var(--muted); text-align: right; font-size: 9px; } .calendar-day-column { position: relative; border-left: 1px solid var(--border); background: linear-gradient(90deg,transparent,rgba(255,255,255,.012)); } .hour-cell { height: 63px; border-bottom: 1px solid rgba(197,226,250,.06); } .calendar-event { position: absolute; left: 6px; right: 6px; z-index: 1; display: grid; align-content: start; gap: 4px; padding: 8px; overflow: hidden; border: 1px solid; border-radius: 8px; text-align: left; cursor: pointer; } .calendar-event strong { overflow: hidden; font-size: 10px; line-height: 1.25; } .calendar-event span { opacity: .7; font-size: 9px; } .calendar-legend { display: flex; flex-wrap: wrap; gap: 18px; padding: 13px 15px; border-top: 1px solid var(--border); color: var(--muted); font-size: 9px; } .calendar-legend span { display: inline-flex; align-items: center; gap: 6px; } .legend-dot { width: 6px; height: 6px; border-radius: 50%; }
.task-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 14px; padding: 8px 10px; border-radius: 13px; } .inline-search { display: flex; align-items: center; gap: 8px; flex: 1; max-width: 360px; color: var(--muted); } .inline-search input,.chat-composer input { width: 100%; border: 0; outline: 0; color: var(--foreground); background: transparent; font-size: 12px; } .inline-search input::placeholder,.chat-composer input::placeholder { color: var(--muted); } .filter-actions { gap: 7px; } .task-list-head { display: flex; justify-content: space-between; padding: 0 7px 11px; color: var(--muted); font-size: 10px; } .task-list-row { display: grid; grid-template-columns: 26px 1fr 90px 110px 30px 30px; align-items: center; gap: 10px; min-height: 65px; padding: 8px 7px; border-top: 1px solid var(--border); } .task-list-row:hover { background: rgba(255,255,255,.025); } .task-checkbox { width: 19px; height: 19px; display: grid; place-items: center; border: 1px solid var(--border); border-radius: 6px; color: #0F1117; background: transparent; cursor: pointer; } .task-checkbox.done { border-color: #6FE3C1; background: #6FE3C1; } .task-row-main { display: grid; gap: 5px; color: var(--foreground); background: none; text-align: left; cursor: pointer; } .task-row-title { font-size: 12px; font-weight: 600; } .task-row-project { display: inline-flex; align-items: center; gap: 5px; color: var(--muted); font-size: 9px; } .task-row-project i { width: 5px; height: 5px; border-radius: 50%; } .task-status { width: fit-content; padding: 4px 7px; border-radius: 6px; font-size: 9px; } .status-done { color: #6FE3C1; background: rgba(111,227,193,.1); } .status-in_progress { color: #69D2FF; background: rgba(105,210,255,.1); } .status-blocked { color: #FF8BA7; background: rgba(255,139,167,.1); } .status-todo { color: var(--muted); background: rgba(255,255,255,.06); } .task-assignee { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: 9px; } .star-button { display: grid; place-items: center; color: var(--muted); background: transparent; cursor: pointer; } .star-button.starred { color: #F0B36D; }
.project-cards-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; } .project-card { min-height: 226px; padding: 17px; border-radius: 16px; } .project-card-top { display: flex; align-items: center; justify-content: space-between; } .project-card-top>i { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 12px currentColor; } .project-card h3 { margin-top: 26px; font: 600 16px "Space Grotesk",sans-serif; } .project-card p { min-height: 42px; margin-top: 8px; color: var(--muted); font-size: 10px; line-height: 1.5; } .project-card-meta,.project-card-footer { display: flex; align-items: center; justify-content: space-between; color: var(--muted); font-size: 9px; } .project-card-meta { margin-top: 20px; } .project-card-meta span:last-child { color: var(--foreground); font-weight: 600; } .project-progress { height: 5px; margin-top: 8px; } .project-card-footer { margin-top: 16px; } .project-card-footer strong { color: var(--foreground); font-weight: 500; }
.chat-layout { display: grid; grid-template-columns: 290px 1fr; gap: 13px; min-height: 560px; } .conversation-list,.chat-window { overflow: hidden; border-radius: 16px; } .conversation-list { padding: 16px 0; } .conversation-head { display: flex; align-items: center; justify-content: space-between; padding: 0 16px 13px; border-bottom: 1px solid var(--border); } .conversation-head strong { font: 600 15px "Space Grotesk",sans-serif; } .conversation-item { width: 100%; display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 9px; padding: 12px 16px; color: var(--foreground); background: transparent; text-align: left; cursor: pointer; } .conversation-item:hover,.conversation-item.active { background: rgba(105,210,255,.07); } .conversation-item>div:nth-child(2) { display: grid; gap: 4px; overflow: hidden; } .conversation-item strong,.conversation-item span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } .conversation-item strong { font-size: 10px; } .conversation-item span,.conversation-item small { color: var(--muted); font-size: 9px; } .chat-window { display: grid; grid-template-rows: auto 1fr auto; } .chat-window-head { display: flex; align-items: center; justify-content: space-between; padding: 17px 19px; border-bottom: 1px solid var(--border); } .chat-window-head div { display: grid; gap: 4px; } .chat-window-head strong { font: 600 15px "Space Grotesk",sans-serif; } .chat-window-head span { color: var(--muted); font-size: 9px; } .message-flow { padding: 18px 20px; } .date-separator { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: var(--muted); font-size: 9px; } .date-separator::before,.date-separator::after { content: ""; height: 1px; flex: 1; background: var(--border); } .chat-message { display: flex; gap: 10px; max-width: 580px; margin-bottom: 21px; } .chat-message.own { flex-direction: row-reverse; margin-left: auto; text-align: right; } .message-meta { display: flex; align-items: baseline; gap: 8px; } .chat-message.own .message-meta { justify-content: flex-end; } .message-meta strong { font-size: 10px; } .message-meta span { color: var(--muted); font-size: 9px; } .chat-message p { margin-top: 6px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; color: var(--muted); background: rgba(255,255,255,.04); font-size: 11px; line-height: 1.55; } .chat-message.own p { border-color: rgba(105,210,255,.18); border-radius: 12px 4px 12px 12px; background: rgba(105,210,255,.09); } .chat-message p strong { color: var(--primary); } .chat-composer { display: flex; align-items: center; gap: 7px; margin: 0 15px 15px; padding: 6px; border: 1px solid var(--border); border-radius: 11px; background: rgba(255,255,255,.04); }
.inbox-panel { padding: 0; overflow: hidden; } .inbox-row { display: grid; grid-template-columns: 14px 1fr auto 30px; align-items: center; gap: 13px; padding: 20px; border-bottom: 1px solid var(--border); } .inbox-row:last-child { border-bottom: 0; } .inbox-copy { display: grid; gap: 5px; } .inbox-copy strong { font-size: 12px; } .inbox-copy span,.inbox-row time { color: var(--muted); font-size: 10px; } .inbox-row time { white-space: nowrap; }
.admin-summary-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 13px; margin-bottom: 14px; } .table-head,.table-row { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; align-items: center; gap: 15px; } .table-head { margin-top: 24px; padding: 0 8px 11px; color: var(--muted); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; } .table-row { min-height: 56px; padding: 8px; border-top: 1px solid var(--border); color: var(--muted); font-size: 10px; } .table-row .person-meta strong { color: var(--foreground); font-weight: 500; } .mini-progress { height: 4px; } .online-status { display: flex; align-items: center; gap: 6px; color: #6FE3C1; font-size: 9px; } .online-status i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; box-shadow: 0 0 8px currentColor; }
.settings-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 13px; } .settings-card { padding: 21px; } .settings-card-head { display: flex; align-items: flex-start; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid var(--border); } .settings-icon { width: 35px; height: 35px; display: grid; place-items: center; border-radius: 11px; color: var(--primary); background: rgba(105,210,255,.11); } .settings-icon.mint { color: #6FE3C1; background: rgba(111,227,193,.1); } .settings-card-head h3 { font: 600 16px "Space Grotesk",sans-serif; } .settings-card-head p { margin-top: 5px; color: var(--muted); font-size: 10px; } .settings-line { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 0; border-bottom: 1px solid var(--border); color: var(--muted); font-size: 11px; } .settings-line:last-child { padding-bottom: 0; border-bottom: 0; } .settings-line strong { display: inline-flex; align-items: center; gap: 6px; color: var(--foreground); font-size: 10px; font-weight: 500; } .toggle { position: relative; width: 31px; height: 18px; padding: 2px; border-radius: 99px; background: rgba(255,255,255,.12); cursor: pointer; } .toggle i { display: block; width: 14px; height: 14px; border-radius: 50%; background: var(--muted); transition: transform .18s ease; } .toggle.active { background: rgba(105,210,255,.28); } .toggle.active i { transform: translateX(13px); background: var(--primary); }
.modal-backdrop,.command-backdrop { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 20px; background: rgba(3,7,12,.62); backdrop-filter: blur(10px); } .task-modal { width: min(550px,100%); padding: 23px; border: 1px solid var(--border); border-radius: 20px; background: #162033; box-shadow: 0 32px 80px rgba(0,0,0,.38); } .modal-header { display: flex; justify-content: space-between; gap: 15px; } .modal-header h2 { margin-top: 5px; font: 600 23px "Space Grotesk",sans-serif; letter-spacing: -.04em; } .modal-field { display: grid; gap: 8px; } .modal-field label { color: var(--muted); font-size: 10px; } .primary-field { margin-top: 25px; } .modal-field input,.custom-select,.static-input { width: 100%; height: 41px; border: 1px solid var(--border); border-radius: 10px; color: var(--foreground); background: rgba(255,255,255,.045); } .modal-field input { padding: 0 12px; outline: 0; font-size: 12px; } .modal-field input:focus { border-color: rgba(105,210,255,.55); box-shadow: 0 0 0 3px rgba(105,210,255,.1); } .modal-field input::placeholder { color: var(--muted); } .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 17px; } .custom-select,.static-input { display: flex; align-items: center; gap: 8px; padding: 0 11px; color: var(--muted); } .custom-select select { flex: 1; border: 0; outline: 0; color: var(--foreground); background: transparent; font-size: 11px; } .custom-select option { background: #162033; } .static-input { font-size: 11px; } .modal-suggestion { display: flex; align-items: center; gap: 8px; margin-top: 21px; padding: 11px; border: 1px solid rgba(105,210,255,.12); border-radius: 9px; color: var(--muted); background: rgba(105,210,255,.05); font-size: 10px; } .modal-suggestion svg { color: var(--primary); } .modal-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 23px; padding-top: 16px; border-top: 1px solid var(--border); } .command-backdrop { align-items: start; padding-top: 13vh; } .command-panel { width: min(610px,100%); overflow: hidden; border: 1px solid var(--border); border-radius: 16px; background: #162033; box-shadow: 0 30px 80px rgba(0,0,0,.4); } .command-input { display: flex; align-items: center; gap: 10px; padding: 15px; border-bottom: 1px solid var(--border); color: var(--primary); } .command-input input { width: 100%; border: 0; outline: 0; color: var(--foreground); background: transparent; font-size: 12px; } .command-input input::placeholder { color: var(--muted); } .command-input button { color: var(--muted); background: none; cursor: pointer; } .command-section-label { padding: 14px 16px 7px; color: var(--muted); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; } .command-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 11px 16px; color: var(--foreground); background: transparent; text-align: left; cursor: pointer; } .command-item:hover { background: rgba(105,210,255,.08); } .command-item span:nth-child(2) { font-size: 12px; } .command-enter { margin-left: auto; color: var(--muted); } .command-footer { display: flex; gap: 14px; padding: 12px 16px; border-top: 1px solid var(--border); color: var(--muted); font-size: 9px; } .command-footer kbd { margin-right: 4px; }
@media (max-width:1100px) { .metrics-grid { grid-template-columns: repeat(2,1fr); } .dashboard-grid { grid-template-columns: 1fr; } .dashboard-side { grid-template-columns: 1fr 1fr; } .project-cards-grid { grid-template-columns: repeat(2,1fr); } .strip-stats { gap: 18px; } }
@media (max-width:780px) { .planner-sidebar { transform: translateX(-100%); width: 252px; box-shadow: 20px 0 50px rgba(0,0,0,.25); } .planner-sidebar.is-open { transform: translateX(0); } .planner-main,.planner-main.sidebar-hidden { margin-left: 0; } .mobile-menu { display: inline-grid; } .topbar { padding: 0 18px; } .search-trigger { width: 34px; min-width: 34px; justify-content: center; padding: 0; } .search-trigger span,.search-trigger kbd { display: none; } .main-scroll { padding: 26px 18px 36px; } .view-header { display: block; } .hero-actions { margin-top: 18px; } .hero-actions .secondary-button { display: none; } .dashboard-side { grid-template-columns: 1fr; } .bottom-strip { align-items: flex-start; flex-wrap: wrap; } .strip-stats { width: 100%; margin-left: 45px; } .strip-arrow { position: absolute; right: 24px; } .calendar-toolbar { flex-wrap: wrap; } .view-switch { order: 3; width: 100%; justify-content: center; } .task-list-row { grid-template-columns: 26px 1fr 30px 30px; } .task-status,.task-assignee { display: none; } .chat-layout { grid-template-columns: 1fr; } .conversation-item { display: none; } .conversation-item:first-of-type,.conversation-item.active { display: grid; } .settings-grid { grid-template-columns: 1fr; } .table-head,.table-row { grid-template-columns: 1.4fr 1fr 1fr; } .table-head span:nth-child(3),.table-row>span:nth-child(3) { display: none; } .table-row .mini-progress { display: none; } }
@media (max-width:480px) { .metrics-grid { gap: 8px; } .metric-card { min-height: 125px; padding: 13px; } .metric-value strong { font-size: 25px; } .metric-foot { display: block; margin-top: 10px; } .metric-foot small { display: block; margin-top: 4px; } .calendar-panel,.workload-panel,.activity-panel { padding: 15px; } .mini-week { gap: 2px; } .agenda-row { grid-template-columns: 48px 1fr; } .agenda-meta span:nth-child(2) { display: none; } .form-grid { grid-template-columns: 1fr; } .task-modal { padding: 18px; } .project-cards-grid,.admin-summary-grid { grid-template-columns: 1fr; } .breadcrumb span:first-child,.breadcrumb-divider { display: none; } }
@media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; } }
.auth-loading { min-height: 100vh; display: grid; place-items: center; gap: 12px; color: var(--muted); background: var(--background); font-size: 12px; }
.auth-loading .brand-symbol { margin: 0 auto; }
.auth-screen { position: relative; min-height: 100vh; overflow: hidden; background: radial-gradient(circle at 12% 12%,rgba(105,210,255,.13),transparent 32%),radial-gradient(circle at 88% 90%,rgba(181,161,255,.1),transparent 32%),var(--background); }
.auth-layout { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0,1fr) minmax(380px,490px); gap: clamp(40px,8vw,130px); align-items: center; width: min(1120px,calc(100% - 48px)); min-height: 100vh; margin: 0 auto; }
.auth-intro { max-width: 560px; }
.auth-brand { display: flex; align-items: center; gap: 10px; color: var(--foreground); font: 700 18px "Space Grotesk",sans-serif; letter-spacing: -.05em; }
.auth-brand>span>span { color: var(--primary); }
.auth-brand .brand-symbol { width: 38px; height: 38px; border-radius: 12px; }
.auth-copy { margin-top: clamp(90px,16vh,160px); }
.auth-copy h1 { max-width: 560px; margin-top: 16px; font-size: clamp(42px,5.4vw,70px); }
.auth-copy p { max-width: 430px; margin-top: 22px; color: var(--muted); font-size: 16px; line-height: 1.6; }
.auth-promise { display: inline-flex; align-items: center; gap: 8px; margin-top: 70px; color: var(--muted); font-size: 11px; }
.auth-promise svg { color: var(--primary); }
.auth-card { padding: 31px; border: 1px solid var(--border); border-radius: 24px; background: linear-gradient(145deg,rgba(26,42,65,.76),rgba(16,24,38,.66)); box-shadow: 0 30px 80px rgba(0,0,0,.25),inset 0 1px rgba(255,255,255,.05); backdrop-filter: blur(24px); }
.auth-card-heading h2 { margin-top: 8px; font: 600 27px "Space Grotesk",sans-serif; letter-spacing: -.05em; }
.auth-card-heading p { margin-top: 8px; color: var(--muted); font-size: 12px; }
.auth-card form { display: grid; gap: 15px; margin-top: 28px; }
.auth-field { display: grid; gap: 7px; color: var(--muted); font-size: 10px; }
.auth-field>div { display: flex; align-items: center; gap: 9px; min-height: 44px; padding: 0 12px; border: 1px solid var(--border); border-radius: 11px; color: var(--muted); background: rgba(255,255,255,.04); }
.auth-field>div:focus-within { border-color: rgba(105,210,255,.6); box-shadow: 0 0 0 3px rgba(105,210,255,.1); }
.auth-field input { width: 100%; border: 0; outline: 0; color: var(--foreground); background: transparent; font-size: 12px; }
.auth-field input::placeholder { color: rgba(224,237,250,.32); }
.auth-eye { display: grid; place-items: center; padding: 0; color: var(--muted); background: transparent; cursor: pointer; }
.auth-link { padding: 0; color: var(--primary); background: transparent; font-size: 10px; cursor: pointer; }
.auth-link:hover { text-decoration: underline; }
.forgot { justify-self: end; margin-top: -5px; }
.auth-submit { width: 100%; margin-top: 3px; padding: 13px; }
.auth-feedback { padding: 10px 11px; border-radius: 9px; font-size: 10px; line-height: 1.45; }
.auth-feedback.error { color: #FFB5C6; background: rgba(255,139,167,.1); }
.auth-feedback.success { color: #A2F4D9; background: rgba(111,227,193,.1); }
.auth-feedback.success { display: flex; align-items: flex-start; gap: 7px; }
.auth-feedback.success svg { flex: 0 0 auto; margin-top: 1px; }
.auth-spinner { width: 13px; height: 13px; display: inline-block; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: auth-spin .65s linear infinite; }
@keyframes auth-spin { to { transform: rotate(360deg); } }
.auth-switch { display: flex; justify-content: center; gap: 5px; margin-top: 22px; color: var(--muted); font-size: 10px; }
.auth-back { display: block; margin: 16px auto 0; color: var(--muted); background: transparent; font-size: 10px; cursor: pointer; }
.auth-back:hover { color: var(--foreground); }
.auth-ambient { position: absolute; width: 32rem; height: 32rem; border-radius: 50%; filter: blur(90px); opacity: .13; pointer-events: none; }
.auth-ambient-one { top: -20rem; right: 12%; background: #69D2FF; }
.auth-ambient-two { bottom: -20rem; left: 12%; background: #6FE3C1; }
@media (max-width:800px) { .auth-layout { grid-template-columns: 1fr; width: min(520px,calc(100% - 36px)); padding: 34px 0; } .auth-copy { margin-top: 70px; } .auth-copy h1 { font-size: 43px; } .auth-copy p { font-size: 14px; } .auth-promise { margin-top: 34px; } .auth-card { margin-top: 30px; } }
.topbar-brand { display: flex; align-items: center; gap: 8px; color: var(--foreground); font: 700 15px "Space Grotesk",sans-serif; letter-spacing: -.04em; }
.topbar-brand img { width: 22px; height: 22px; object-fit: contain; }
.topbar-brand span span { color: var(--primary); }
.context-ribbon { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin: 18px 38px 0; padding: 9px 12px; border: 1px solid rgba(105,210,255,.15); border-radius: 13px; background: linear-gradient(90deg,rgba(105,210,255,.08),rgba(255,255,255,.025) 52%,rgba(181,161,255,.06)); box-shadow: inset 0 1px rgba(255,255,255,.04); backdrop-filter: blur(18px); }
.ribbon-date { display: flex; align-items: baseline; gap: 9px; }
.ribbon-date strong { font: 600 12px "Space Grotesk",sans-serif; }
.ribbon-pulse { display: inline-flex; align-items: center; gap: 7px; color: var(--muted); font-size: 10px; }
.ribbon-pulse i { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 11px var(--primary); }
.ribbon-actions { display: flex; align-items: center; gap: 5px; }
.ribbon-chip,.ribbon-icon { display: inline-flex; align-items: center; gap: 6px; padding: 7px 9px; border: 1px solid transparent; border-radius: 8px; color: var(--muted); background: transparent; font-size: 10px; cursor: pointer; }
.ribbon-chip.active,.ribbon-chip:hover,.ribbon-icon:hover { border-color: rgba(105,210,255,.2); color: var(--foreground); background: rgba(105,210,255,.1); }
.ribbon-icon { padding: 7px; }
@media (max-width:780px) { .topbar-brand { display: none; } .context-ribbon { margin: 12px 18px 0; } .ribbon-pulse { display: none; } }
.filter-control { display: inline-flex; align-items: center; gap: 6px; min-height: 31px; padding: 0 8px; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); background: rgba(255,255,255,.035); }
.filter-control:focus-within { border-color: rgba(105,210,255,.45); color: var(--primary); }
.filter-control select { max-width: 118px; border: 0; outline: 0; color: var(--foreground); background: transparent; font-size: 10px; cursor: pointer; }
.filter-control option { color: #F6F8FB; background: #162033; }
.clear-filters { padding: 0 4px; color: var(--primary); background: transparent; font-size: 10px; cursor: pointer; white-space: nowrap; }
.clear-filters:hover { text-decoration: underline; }
.task-empty { display: grid; justify-items: center; gap: 8px; padding: 52px 20px 60px; color: var(--muted); text-align: center; }
.task-empty svg { color: var(--primary); }
.task-empty strong { color: var(--foreground); font: 600 15px "Space Grotesk",sans-serif; }
.task-empty span { font-size: 10px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
@media (max-width:780px) { .task-toolbar { align-items: stretch; flex-direction: column; } .inline-search { max-width: none; } .filter-actions { flex-wrap: wrap; } .filter-control { flex: 1 1 120px; } .filter-control select { max-width: none; width: 100%; } }
.planner-app { overflow: hidden; }
.brand-symbol img,.topbar-brand img { transition: filter .18s ease; }
[data-theme="light"] .brand-symbol img,[data-theme="light"] .topbar-brand img,[data-theme="bluesky"] .brand-symbol img,[data-theme="bluesky"] .topbar-brand img,[data-theme="aurora"] .brand-symbol img,[data-theme="aurora"] .topbar-brand img { filter: brightness(0) saturate(100%) invert(34%) sepia(35%) saturate(1100%) hue-rotate(166deg) brightness(86%) contrast(95%); }
.lava-blob { position: fixed; z-index: -1; width: 26rem; height: 26rem; border-radius: 42% 58% 63% 37% / 42% 35% 65% 58%; filter: blur(42px); opacity: .12; pointer-events: none; mix-blend-mode: screen; animation: lava-float 22s ease-in-out infinite alternate; }
.lava-blob-one { top: 8%; left: 18%; background: #69D2FF; animation-delay: -4s; }
.lava-blob-two { right: 6%; bottom: -8%; background: #B5A1FF; animation-duration: 28s; animation-delay: -11s; }
.lava-blob-three { top: 44%; left: 52%; width: 18rem; height: 18rem; background: #6FE3C1; animation-duration: 25s; animation-delay: -16s; }
@keyframes lava-float { 0% { transform: translate3d(-10%, -8%, 0) rotate(-8deg) scale(.9); border-radius: 42% 58% 63% 37% / 42% 35% 65% 58%; } 50% { transform: translate3d(8%, 5%, 0) rotate(12deg) scale(1.08); border-radius: 61% 39% 37% 63% / 52% 62% 38% 48%; } 100% { transform: translate3d(16%, -4%, 0) rotate(24deg) scale(.98); border-radius: 32% 68% 55% 45% / 66% 38% 62% 34%; } }
.ribbon-date,.ribbon-pulse { border: 0; color: inherit; background: transparent; font: inherit; cursor: pointer; }
.ribbon-date:hover strong,.ribbon-pulse:hover { color: var(--primary); }
.notification-button-row { width: 100%; border: 0; text-align: left; cursor: pointer; }
.profile-mini { width: 100%; border: 0; color: inherit; background: transparent; text-align: left; cursor: pointer; }
.profile-grid { display: grid; grid-template-columns: minmax(220px,.7fr) minmax(0,1.3fr); gap: 14px; }
.profile-card { min-height: 290px; padding: 24px; border-radius: 18px; }
.profile-identity { display: flex; flex-direction: column; align-items: flex-start; }
.profile-avatar-wrap { position: relative; margin-bottom: 20px; }
.profile-avatar { width: 112px; height: 112px; display: grid; place-items: center; overflow: hidden; border: 1px solid rgba(105,210,255,.3); border-radius: 34px; color: var(--primary); background: linear-gradient(145deg,rgba(105,210,255,.18),rgba(181,161,255,.13)); font: 600 34px "Space Grotesk",sans-serif; box-shadow: 0 18px 42px rgba(0,0,0,.16); }
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-upload { position: absolute; right: -8px; bottom: -8px; width: 34px; height: 34px; display: grid; place-items: center; border: 2px solid var(--background); border-radius: 12px; color: var(--primary-foreground); background: var(--primary); cursor: pointer; box-shadow: 0 8px 22px rgba(105,210,255,.26); }
.avatar-upload:disabled { opacity: .65; cursor: wait; }
.profile-identity h2 { margin-top: 7px; font: 600 22px "Space Grotesk",sans-serif; }
.profile-identity>p { margin-top: 6px; color: var(--muted); font-size: 11px; }
.profile-role { display: inline-flex; align-items: center; gap: 7px; margin-top: 20px; padding: 7px 9px; border: 1px solid rgba(111,227,193,.2); border-radius: 8px; color: #6FE3C1; background: rgba(111,227,193,.07); font-size: 10px; }
.profile-hint { display: flex; align-items: center; gap: 6px; margin-top: auto !important; padding-top: 24px; font-size: 9px !important; }
.profile-section-heading { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 18px; border-bottom: 1px solid var(--border); color: var(--primary); }
.profile-section-heading h2 { margin-top: 6px; color: var(--foreground); font: 600 19px "Space Grotesk",sans-serif; }
.profile-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 21px; }
.profile-form label { display: grid; gap: 7px; color: var(--muted); font-size: 10px; }
.profile-form label:first-child { grid-column: 1 / -1; }
.profile-form input,.profile-form select { width: 100%; height: 42px; padding: 0 11px; border: 1px solid var(--border); border-radius: 10px; outline: 0; color: var(--foreground); background: rgba(255,255,255,.04); font-size: 12px; }
.profile-form input:focus,.profile-form select:focus { border-color: rgba(105,210,255,.55); box-shadow: 0 0 0 3px rgba(105,210,255,.1); }
.profile-form option { color: #F6F8FB; background: #162033; }
.profile-readonly { display: grid; align-content: end; gap: 7px; color: var(--muted); font-size: 10px; }
.profile-readonly strong { display: inline-flex; align-items: center; gap: 6px; height: 42px; padding: 0 11px; border: 1px solid var(--border); border-radius: 10px; color: var(--foreground); background: rgba(255,255,255,.025); font-size: 11px; }
.profile-feedback { display: flex; align-items: flex-start; gap: 8px; margin-top: 14px; padding: 11px 13px; border-radius: 10px; font-size: 10px; line-height: 1.45; }
.profile-feedback.success { color: #A2F4D9; background: rgba(111,227,193,.1); }
.profile-feedback.error { color: #FFB5C6; background: rgba(255,139,167,.1); }
.profile-loading { display: flex; align-items: center; gap: 8px; min-height: 150px; color: var(--muted); font-size: 11px; }
.spin { animation: auth-spin .65s linear infinite; }
@media (max-width:780px) { .profile-grid { grid-template-columns: 1fr; } .profile-form { grid-template-columns: 1fr; } .profile-form label:first-child { grid-column: auto; } .profile-card { min-height: auto; } }
.calendar-mode-stack { display: grid; gap: 0; }
.calendar-mode-panel { padding: 20px; border-radius: 17px; }
.calendar-mode-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding-bottom: 17px; border-bottom: 1px solid var(--border); }
.calendar-mode-heading h2 { margin-top: 5px; font: 600 19px "Space Grotesk",sans-serif; }
.calendar-mode-heading>span { color: var(--muted); font-size: 10px; }
.calendar-task-row { width: 100%; display: grid; grid-template-columns: 95px 9px 1fr 78px 55px; align-items: center; gap: 11px; min-height: 62px; padding: 8px 4px; border-bottom: 1px solid var(--border); color: var(--foreground); background: transparent; text-align: left; cursor: pointer; }
.calendar-task-row:hover { background: rgba(105,210,255,.06); }
.calendar-task-date,.calendar-task-time { color: var(--muted); font-size: 10px; }
.calendar-task-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px currentColor; }
.calendar-task-title { display: grid; gap: 4px; font-size: 11px; font-weight: 600; }
.calendar-task-title small { color: var(--muted); font-size: 9px; font-weight: 400; }
.timeline-axis { display: grid; grid-template-columns: repeat(6,1fr); margin: 23px 0 8px 170px; color: var(--muted); font-size: 9px; }
.timeline-rows { display: grid; }
.timeline-row { display: grid; grid-template-columns: 160px 1fr 42px; align-items: center; gap: 11px; min-height: 51px; border-bottom: 1px solid var(--border); color: var(--foreground); background: transparent; text-align: left; cursor: pointer; }
.timeline-row:hover { background: rgba(105,210,255,.05); }
.timeline-row strong { overflow: hidden; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.timeline-row>span { color: var(--muted); font-size: 9px; }
.timeline-track,.gantt-track { position: relative; height: 12px; border-radius: 99px; background: repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0,rgba(255,255,255,.04) calc(16.66% - 1px),transparent calc(16.66% - 1px),transparent 16.66%); }
.timeline-track i,.gantt-track i { position: absolute; top: 2px; bottom: 2px; border-radius: 99px; box-shadow: 0 0 12px currentColor; }
.gantt-grid { margin-top: 20px; }
.gantt-head { display: grid; grid-template-columns: 1.6fr repeat(5,1fr); gap: 10px; padding: 0 4px 10px; color: var(--muted); font-size: 9px; text-transform: uppercase; }
.gantt-row { width: 100%; display: grid; grid-template-columns: 1.6fr 5fr; align-items: center; gap: 10px; min-height: 50px; border-top: 1px solid var(--border); color: var(--foreground); background: transparent; text-align: left; cursor: pointer; }
.gantt-row strong { overflow: hidden; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.gantt-row:hover { background: rgba(105,210,255,.05); }
.settings-select { border: 0; outline: 0; color: var(--foreground); background: transparent; font-size: 10px; cursor: pointer; }
.settings-select option { color: #F6F8FB; background: #162033; }
.settings-saved { display: inline-flex; align-items: center; gap: 6px; padding: 8px 10px; border: 1px solid rgba(111,227,193,.18); border-radius: 9px; color: #6FE3C1; background: rgba(111,227,193,.07); font-size: 10px; }
.theme-settings-panel { padding: 22px; border-radius: 17px; }
.theme-option-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 9px; margin-top: 20px; }
.theme-option { display: grid; grid-template-columns: 32px 1fr auto; align-items: center; gap: 9px; min-height: 68px; padding: 9px; border: 1px solid var(--border); border-radius: 11px; color: var(--muted); background: rgba(255,255,255,.025); text-align: left; cursor: pointer; }
.theme-option:hover,.theme-option.selected { border-color: rgba(105,210,255,.4); color: var(--foreground); background: rgba(105,210,255,.08); }
.theme-option-swatch { width: 30px; height: 30px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.2); border-radius: 9px; color: #102A3A; }
.theme-option>span:nth-child(2) { display: grid; gap: 4px; }
.theme-option strong { font-size: 11px; }
.theme-option small { color: var(--muted); font-size: 8px; line-height: 1.25; }
.theme-option>svg { color: var(--primary); }
.chat-empty { display: grid; justify-items: center; gap: 8px; padding: 70px 20px; color: var(--muted); text-align: center; }
.chat-empty svg { color: var(--primary); }
.chat-empty strong { color: var(--foreground); font: 600 15px "Space Grotesk",sans-serif; }
.chat-empty span { font-size: 10px; }
@media (max-width:900px) { .theme-option-grid { grid-template-columns: repeat(2,1fr); } .timeline-axis { margin-left: 0; } .timeline-row { grid-template-columns: 1fr; gap: 7px; padding: 10px 0; } .timeline-row>span { display: none; } .gantt-head { display: none; } .gantt-row { grid-template-columns: 1fr; gap: 7px; padding: 10px 0; } }
@media (max-width:560px) { .calendar-task-row { grid-template-columns: 70px 8px 1fr 50px; } .calendar-task-row .task-status { display: none; } .theme-option-grid { grid-template-columns: 1fr; } }
.dnd-task-event { cursor: grab; user-select: none; }
.dnd-task-event:active { cursor: grabbing; }
.resize-handle { position: absolute; right: 7px; bottom: 4px; left: 7px; height: 4px; border-radius: 99px; background: currentColor; opacity: .45; cursor: ns-resize; }
.resize-handle:hover { opacity: .95; }
.chat-head-actions,.message-meta { position: relative; display: flex; align-items: center; gap: 4px; }
.chat-options-menu,.message-options { position: absolute; right: 0; z-index: 25; display: grid; min-width: 210px; padding: 7px; border: 1px solid var(--border); border-radius: 11px; background: rgba(23,34,53,.97); box-shadow: 0 18px 45px rgba(0,0,0,.3); backdrop-filter: blur(18px); }
.chat-options-menu { top: calc(100% + 8px); }
.message-options { top: calc(100% + 6px); right: auto; left: 0; }
.chat-options-menu button,.message-options button { display: flex; align-items: center; gap: 8px; padding: 9px; border: 0; border-radius: 7px; color: var(--muted); background: transparent; text-align: left; font-size: 10px; cursor: pointer; }
.chat-options-menu button:hover,.message-options button:hover { color: var(--foreground); background: rgba(105,210,255,.08); }
.danger-action { color: #FF9CB4 !important; }
.message-action { display: none; align-items: center; padding: 0; border: 0; color: var(--muted); background: transparent; cursor: pointer; }
.chat-message:hover .message-action,.message-action:focus-visible { display: inline-flex; }
.chat-search { display: flex; align-items: center; gap: 7px; margin: 10px 13px; padding: 7px 9px; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); background: rgba(255,255,255,.035); }
.chat-search input { width: 100%; border: 0; outline: 0; color: var(--foreground); background: transparent; font-size: 10px; }
.chat-search input::placeholder { color: var(--muted); }
.chat-feedback { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 0 15px 12px; padding: 8px 10px; border-radius: 8px; color: #A2F4D9; background: rgba(111,227,193,.1); font-size: 10px; }
.chat-feedback button { display: grid; place-items: center; border: 0; color: inherit; background: transparent; cursor: pointer; }
.custom-select input[type="date"],.custom-select input[type="time"] { height: auto; min-width: 0; padding: 0; border: 0; background: transparent; font-size: 11px; }
.static-input.invalid { border-color: rgba(255,139,167,.5); color: #FF9CB4; }
@media (prefers-reduced-motion: reduce) { .lava-blob { display: none; } }
.month-calendar { overflow: hidden; padding: 16px; border-radius: 17px; }
.month-weekdays,.month-grid { display: grid; grid-template-columns: repeat(7,minmax(88px,1fr)); min-width: 620px; }
.month-weekdays { border-bottom: 1px solid var(--border); }
.month-weekdays span { padding: 8px 10px; color: var(--muted); font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.month-grid { overflow: hidden; border-left: 1px solid var(--border); border-top: 1px solid var(--border); }
.month-cell { min-height: 112px; padding: 8px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); background: rgba(255,255,255,.012); }
.month-cell.out-month { opacity: .42; }
.month-cell.today { background: rgba(105,210,255,.07); box-shadow: inset 0 2px var(--primary); }
.month-cell-head { display: flex; align-items: center; justify-content: space-between; color: var(--muted); font-size: 10px; }
.month-cell.today .month-cell-head strong { color: var(--primary); }
.month-cell-head span { display: grid; place-items: center; min-width: 17px; height: 17px; border-radius: 50%; color: var(--primary); background: rgba(105,210,255,.12); font-size: 8px; }
.month-task-stack { display: grid; gap: 4px; margin-top: 9px; }
.month-task { overflow: hidden; padding: 5px 6px; border-left: 2px solid var(--primary); border-radius: 4px; color: var(--foreground); background: rgba(255,255,255,.05); text-align: left; white-space: nowrap; text-overflow: ellipsis; font-size: 9px; cursor: pointer; }
.month-task span { margin-right: 4px; color: var(--muted); font-size: 8px; }
.month-task-stack small { color: var(--muted); font-size: 8px; }
.month-summary { display: flex; justify-content: space-between; gap: 12px; padding: 12px 3px 1px; color: var(--muted); font-size: 9px; }
.day-view-panel,.year-calendar-panel { padding: 20px; border-radius: 17px; }
.day-calendar-shell { margin-top: 18px; }
.day-grid-head,.day-grid-body { grid-template-columns: 56px minmax(240px,1fr); min-width: 340px; }
.day-grid-body { height: 630px; }
.month-heading { margin-bottom: 16px; padding-bottom: 15px; }
.dnd-month-task { cursor: grab; user-select: none; }
.dnd-month-task:active,.year-task-dot:active { cursor: grabbing; }
.year-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; margin-top: 18px; }
.year-month-card { overflow: hidden; padding: 12px; border: 1px solid var(--border); border-radius: 14px; background: rgba(255,255,255,.025); transition: border-color .18s ease,background .18s ease,transform .18s ease; }
.year-month-card:hover,.year-month-card.has-tasks { border-color: rgba(105,210,255,.2); background: rgba(105,210,255,.035); }
.year-month-card:has(.year-day-cell:hover) { transform: translateY(-1px); }
.year-month-head { width: 100%; display: flex; align-items: baseline; justify-content: space-between; padding: 0 0 10px; color: var(--foreground); background: transparent; text-align: left; cursor: pointer; }
.year-month-head strong { font: 600 15px "Space Grotesk",sans-serif; text-transform: capitalize; }
.year-month-head span { color: var(--muted); font-size: 9px; }
.year-weekdays,.year-days { display: grid; grid-template-columns: repeat(7,minmax(0,1fr)); gap: 3px; }
.year-weekdays { padding-bottom: 4px; color: var(--muted); font-size: 8px; text-align: center; }
.year-day-cell { position: relative; min-height: 25px; padding: 3px 2px; border-radius: 5px; color: var(--muted); background: rgba(255,255,255,.018); text-align: center; font-size: 8px; cursor: default; }
.year-day-cell.in-month { color: var(--foreground); }
.year-day-cell.out-month { opacity: .25; }
.year-day-cell.today { color: var(--primary); background: rgba(105,210,255,.1); box-shadow: inset 0 1px var(--primary); }
.year-day-cell:hover { background: rgba(105,210,255,.1); }
.year-task-dots { display: flex; justify-content: center; gap: 2px; min-height: 4px; margin-top: 2px; }
.year-task-dot { width: 4px; height: 4px; padding: 0; border-radius: 50%; cursor: grab; box-shadow: 0 0 6px currentColor; }
.skeleton-block { display: block; overflow: hidden; border-radius: 8px; background: linear-gradient(100deg,rgba(255,255,255,.06) 20%,rgba(255,255,255,.13) 38%,rgba(255,255,255,.06) 56%); background-size: 220% 100%; animation: skeleton-shimmer 1.25s linear infinite; }
.skeleton-view-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 30px; }
.skeleton-stack { display: grid; gap: 11px; }
.skeleton-eyebrow { width: 128px; height: 9px; }
.skeleton-title { width: min(430px,55vw); height: 47px; border-radius: 12px; }
.skeleton-subtitle { width: 245px; height: 13px; }
.skeleton-actions { display: flex; gap: 8px; }
.skeleton-button { width: 100px; height: 35px; }
.skeleton-button-primary { width: 125px; background: linear-gradient(100deg,rgba(105,210,255,.16) 20%,rgba(105,210,255,.3) 38%,rgba(105,210,255,.16) 56%); background-size: 220% 100%; }
.skeleton-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 15px; height: 59px; margin-bottom: 14px; padding: 11px 13px; border-radius: 17px; }
.skeleton-period { width: 145px; height: 17px; }
.skeleton-tabs { width: 320px; height: 28px; }
.skeleton-icon { width: 34px; height: 34px; }
.skeleton-calendar { overflow: hidden; padding: 18px; border-radius: 17px; }
.skeleton-calendar-head { display: grid; grid-template-columns: repeat(7,1fr); gap: 10px; padding-bottom: 17px; border-bottom: 1px solid var(--border); }
.skeleton-calendar-head span { height: 14px; }
.skeleton-calendar-body { display: grid; grid-template-columns: repeat(7,1fr); gap: 10px; padding-top: 18px; }
.skeleton-calendar-body span { min-height: 74px; }
.skeleton-content-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 13px; }
.skeleton-card { min-height: 150px; border-radius: 16px; }
.skeleton-card-wide { grid-column: span 2; min-height: 250px; }
@keyframes skeleton-shimmer { from { background-position: 200% 0; } to { background-position: -20% 0; } }
@media (max-width:900px) { .year-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } .skeleton-content-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media (max-width:560px) { .year-grid { grid-template-columns: 1fr; } .skeleton-view-header { display: block; } .skeleton-actions { margin-top: 18px; } .skeleton-content-grid { grid-template-columns: 1fr; } .skeleton-card-wide { grid-column: auto; } .skeleton-tabs { width: 210px; } }
@media (prefers-reduced-motion: reduce) { .skeleton-block { animation: none; } }
.calendar-scope-bar,.team-scope-toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; padding: 12px 14px; border-radius: 15px; }
.calendar-scope-bar>div:first-child,.team-scope-toolbar>div:first-child { display: grid; gap: 4px; min-width: 190px; }
.calendar-scope-bar>div:first-child strong,.team-scope-toolbar>div:first-child strong { font: 600 13px "Space Grotesk",sans-serif; }
.scope-readonly { margin-left: auto; color: var(--muted); font-size: 10px; }
.agent-multi-select { position: relative; z-index: 8; margin-left: auto; }
.agent-select-button { display: inline-flex; align-items: center; gap: 8px; min-height: 35px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 9px; color: var(--foreground); background: rgba(255,255,255,.045); font-size: 11px; cursor: pointer; transition: border-color .18s ease,background .18s ease; }
.agent-select-button:hover,.agent-select-button.is-open { border-color: rgba(105,210,255,.42); background: rgba(105,210,255,.09); }
.agent-select-button svg:first-child { color: var(--primary); }
.agent-select-button strong { color: var(--primary); font-size: 10px; }
.agent-select-panel { position: absolute; top: calc(100% + 8px); right: 0; width: 270px; max-height: 360px; overflow: auto; padding: 8px; border: 1px solid var(--border); border-radius: 13px; background: rgba(22,32,51,.97); box-shadow: 0 22px 55px rgba(0,0,0,.3); backdrop-filter: blur(22px); }
[data-theme="light"] .agent-select-panel,[data-theme="bluesky"] .agent-select-panel { background: rgba(255,255,255,.98); }
.agent-select-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
.agent-select-actions button,.agent-select-close { padding: 7px 5px; border-radius: 7px; color: var(--muted); background: rgba(255,255,255,.04); font-size: 9px; cursor: pointer; }
.agent-select-actions button:hover:not(:disabled),.agent-select-close:hover { color: var(--foreground); background: rgba(105,210,255,.1); }
.agent-select-actions button:disabled { cursor: not-allowed; opacity: .35; }
.agent-option { width: 100%; display: flex; align-items: center; gap: 8px; padding: 9px 6px; border-radius: 8px; color: var(--muted); background: transparent; text-align: left; cursor: pointer; }
.agent-option:hover,.agent-option.is-selected { color: var(--foreground); background: rgba(105,210,255,.08); }
.agent-option>svg { margin-left: auto; color: var(--primary); }
.agent-option-avatar { width: 27px; height: 27px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 8px; font-size: 9px; font-weight: 700; }
.agent-option-copy { display: grid; gap: 2px; min-width: 0; }
.agent-option-copy strong { overflow: hidden; color: var(--foreground); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.agent-option-copy small { color: var(--muted); font-size: 8px; }
.agent-select-empty { padding: 15px 7px; color: var(--muted); font-size: 10px; text-align: center; }
.agent-select-close { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 5px; margin-top: 5px; }
.scope-stat { display: grid; gap: 4px; min-width: 100px; padding-left: 14px; border-left: 1px solid var(--border); }
.scope-stat span { color: var(--muted); font-size: 9px; }
.scope-stat strong { font: 600 16px "Space Grotesk",sans-serif; }
.risk-value { color: #FF8BA7 !important; }
.healthy-value { color: #6FE3C1 !important; }
.agent-management-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; margin-bottom: 14px; }
.agent-management-card { padding: 16px; border-radius: 15px; }
.agent-management-head { display: flex; align-items: center; gap: 9px; }
.agent-management-head>div:nth-child(2) { display: grid; gap: 3px; min-width: 0; }
.agent-management-head strong { overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.agent-management-head span { color: var(--muted); font-size: 9px; }
.agent-status-dot { width: 7px; height: 7px; margin-left: auto; border-radius: 50%; background: var(--muted); }
.agent-status-dot.online { background: #6FE3C1; box-shadow: 0 0 9px rgba(111,227,193,.7); }
.agent-status-dot.away { background: #F0B36D; box-shadow: 0 0 9px rgba(240,179,109,.6); }
.agent-status-dot.offline { background: rgba(224,237,250,.32); }
.agent-progress-meta,.agent-management-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.agent-progress-meta { margin-top: 22px; color: var(--muted); font-size: 9px; }
.agent-progress-meta strong { color: var(--foreground); font: 600 18px "Space Grotesk",sans-serif; }
.agent-progress-track { height: 5px; overflow: hidden; margin-top: 8px; border-radius: 99px; background: rgba(255,255,255,.08); }
.agent-progress-track i { display: block; height: 100%; border-radius: inherit; }
.agent-management-footer { margin-top: 11px; color: var(--muted); font-size: 9px; }
.project-management-card .project-card-top { position: relative; }
.project-risk { margin-left: auto; margin-right: 22px; color: #6FE3C1; font-size: 8px; }
.project-risk.is-risk { color: #FF8BA7; }
.management-two-column { display: grid; grid-template-columns: minmax(0,1.25fr) minmax(300px,.75fr); gap: 14px; }
.management-risk-panel { padding: 20px; border-radius: 17px; }
.risk-task-row { width: 100%; display: grid; grid-template-columns: 8px 1fr auto; align-items: center; gap: 10px; padding: 12px 2px; border-top: 1px solid var(--border); color: var(--foreground); background: transparent; text-align: left; cursor: pointer; }
.risk-task-row:hover { background: rgba(255,139,167,.05); }
.risk-task-dot { width: 7px; height: 7px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
.risk-task-row>span:nth-child(2) { display: grid; gap: 4px; min-width: 0; }
.risk-task-row strong { overflow: hidden; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.risk-task-row small { overflow: hidden; color: var(--muted); font-size: 8px; text-overflow: ellipsis; white-space: nowrap; }
.management-empty { display: grid; justify-items: center; gap: 8px; padding: 48px 20px; color: var(--muted); text-align: center; }
.management-empty.small { padding: 30px 15px; }
.management-empty svg,.access-denied svg { color: var(--primary); }
.management-empty strong,.access-denied strong { color: var(--foreground); font: 600 14px "Space Grotesk",sans-serif; }
.management-empty span,.access-denied span { max-width: 360px; font-size: 10px; line-height: 1.5; }
.access-denied { display: grid; justify-items: center; gap: 10px; padding: 70px 20px; border-radius: 17px; text-align: center; }
.access-denied .secondary-button { margin-top: 8px; }
.online-status.away { color: #F0B36D; }
.online-status.offline { color: var(--muted); }
@media (max-width:1100px) { .agent-management-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } .management-two-column { grid-template-columns: 1fr; } }
@media (max-width:780px) { .calendar-scope-bar,.team-scope-toolbar { align-items: flex-start; flex-wrap: wrap; } .agent-multi-select { margin-left: 0; } .scope-stat { min-width: 90px; } .agent-management-grid { grid-template-columns: 1fr; } .agent-select-panel { right: auto; left: 0; } }
@media (max-width:560px) { .calendar-scope-bar>div:first-child,.team-scope-toolbar>div:first-child { width: 100%; } .scope-stat { flex: 1; } .risk-task-row { grid-template-columns: 8px 1fr; } .risk-task-row .task-status { display: none; } }
.planner-app { overflow: visible; }
.topbar { z-index: 1000; }
.context-ribbon { position: relative; z-index: 900; }
.main-scroll { position: relative; z-index: auto; }
.relative-popover { z-index: 1000; }
.popover-panel { z-index: 1200; }
.calendar-scope-bar,.team-scope-toolbar { position: relative; z-index: 120; }
.calendar-toolbar { position: relative; z-index: 20; }
.agent-multi-select { z-index: 1500; }
.agent-select-panel,.chat-options-menu,.message-options { z-index: 1600; }
.modal-backdrop,.command-backdrop { z-index: 3000; }
.task-modal,.command-panel { position: relative; z-index: 3001; }
.invite-backdrop { z-index: 3100; }
.invite-modal { width: min(520px,calc(100vw - 30px)); padding: 22px; border-radius: 18px; }
.invite-security-note { display: flex; align-items: flex-start; gap: 8px; margin: 17px 0; padding: 10px 11px; border: 1px solid rgba(111,227,193,.16); border-radius: 10px; color: #A2F4D9; background: rgba(111,227,193,.06); font-size: 10px; line-height: 1.45; }
.invite-input { display: flex; align-items: center; gap: 8px; }
.invite-input svg { flex: 0 0 auto; color: var(--primary); }
.invite-input input { width: 100%; height: 42px; padding: 0 11px; border: 1px solid var(--border); border-radius: 10px; outline: 0; color: var(--foreground); background: rgba(255,255,255,.04); font-size: 12px; }
.invite-input input:focus { border-color: rgba(105,210,255,.55); box-shadow: 0 0 0 3px rgba(105,210,255,.1); }
.invite-feedback { display: flex; align-items: center; gap: 7px; margin-top: 12px; padding: 10px 11px; border-radius: 9px; color: #A2F4D9; background: rgba(111,227,193,.09); font-size: 10px; }
.invite-footer { justify-content: flex-end; gap: 8px; margin-top: 21px; }
.shortcuts-settings-panel { margin-top: 14px; padding: 20px; border-radius: 17px; }
.shortcut-list { display: grid; gap: 1px; margin-top: 20px; border-top: 1px solid var(--border); }
.shortcut-row { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 13px 0; border-bottom: 1px solid var(--border); }
.shortcut-row>div { display: grid; gap: 4px; }
.shortcut-row strong { font-size: 11px; }
.shortcut-row span { color: var(--muted); font-size: 9px; }
.shortcut-capture { min-width: 122px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 8px; color: var(--foreground); background: rgba(255,255,255,.045); font: 10px "DM Sans",sans-serif; text-align: center; cursor: pointer; }
.shortcut-capture:hover,.shortcut-capture:focus-visible,.shortcut-capture.is-capturing { border-color: rgba(105,210,255,.48); color: var(--primary); background: rgba(105,210,255,.1); outline: none; }
.shortcut-capture.is-capturing { animation: shortcut-pulse 1s ease-in-out infinite alternate; }
@keyframes shortcut-pulse { from { box-shadow: 0 0 0 rgba(105,210,255,0); } to { box-shadow: 0 0 0 4px rgba(105,210,255,.1); } }
.shortcuts-footer { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 17px; color: var(--muted); font-size: 9px; }
.shortcuts-footer>div { display: flex; gap: 7px; }
@media (max-width:560px) { .shortcut-row { align-items: flex-start; flex-direction: column; gap: 9px; } .shortcut-capture { width: 100%; } .shortcuts-footer { align-items: stretch; flex-direction: column; } .shortcuts-footer>div { justify-content: flex-end; } .invite-footer { align-items: stretch; flex-direction: column-reverse; } }
/* Animation and control layer: lava-lamp is independent from view transitions. */
.planner-app { overflow: visible; }
.planner-sidebar { position: fixed; z-index: 20; }
.planner-main { position: relative; z-index: 1; }
.lava-blob { position: fixed; z-index: 0; width: clamp(220px, 32vw, 520px); height: clamp(220px, 32vw, 520px); border-radius: 46% 54% 62% 38% / 52% 42% 58% 48%; pointer-events: none; opacity: .34; filter: blur(24px) saturate(1.35); mix-blend-mode: screen; animation: lava-flow 15s cubic-bezier(.45,.05,.55,.95) infinite alternate; }
.lava-blob::after { content: ""; position: absolute; inset: 18%; border-radius: inherit; background: inherit; filter: blur(22px); opacity: .8; }
.lava-blob-one { top: 7%; right: 8%; background: radial-gradient(circle at 35% 35%, color-mix(in srgb,var(--primary) 90%,white), transparent 66%); }
.lava-blob-two { bottom: 4%; left: 22%; background: radial-gradient(circle at 55% 45%, #B5A1FF, transparent 66%); animation-delay: -5s; animation-duration: 19s; }
.lava-blob-three { top: 44%; left: 5%; background: radial-gradient(circle at 42% 58%, #6FE3C1, transparent 66%); animation-delay: -9s; animation-duration: 22s; }
@keyframes lava-flow { 0% { transform: translate3d(-5%, -2%, 0) rotate(-8deg) scale(.82); border-radius: 46% 54% 62% 38% / 52% 42% 58% 48%; } 50% { transform: translate3d(8%, 5%, 0) rotate(12deg) scale(1.08); border-radius: 62% 38% 44% 56% / 42% 58% 38% 62%; } 100% { transform: translate3d(-3%, 10%, 0) rotate(25deg) scale(.92); border-radius: 38% 62% 56% 44% / 58% 36% 64% 42%; } }
html[data-lava="off"] .lava-blob { opacity: 0; animation-play-state: paused; }
.brand-logo { position: relative; display: block; flex: 0 0 auto; width: 24px; height: 24px; background: var(--primary); -webkit-mask: var(--logo-image) center / contain no-repeat; mask: var(--logo-image) center / contain no-repeat; filter: drop-shadow(0 0 8px color-mix(in srgb,var(--primary) 45%,transparent)); }
.brand-symbol.brand-logo { width: 24px; height: 24px; border-radius: 0; background-color: var(--primary); background-image: none; box-shadow: none; }
.topbar-logo { width: 21px; height: 21px; }
.profile-chevron { transition: transform .18s ease,color .18s ease; }
.profile-chevron.is-open { transform: rotate(180deg); color: var(--primary); }
.popover-menu-item.danger { color: #FF8BA7; }
.popover-menu-item.danger:hover { color: #FFD0DA; background: rgba(255,139,167,.08); }
.custom-control-select,.custom-date-control,.custom-time-control { position: relative; min-width: 124px; }
.custom-control-trigger { width: 100%; min-height: 36px; display: flex; align-items: center; justify-content: space-between; gap: 7px; padding: 0 10px; border: 1px solid var(--border); border-radius: 9px; color: var(--foreground); background: rgba(255,255,255,.045); font-size: 10px; text-align: left; cursor: pointer; }
.custom-control-trigger>span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.custom-control-trigger>svg:first-child { flex: 0 0 auto; color: var(--primary); }
.custom-control-trigger:disabled { opacity: .5; cursor: not-allowed; }
.custom-control-select.is-open .custom-control-trigger,.custom-control-trigger:hover { border-color: color-mix(in srgb,var(--primary) 55%,var(--border)); background: color-mix(in srgb,var(--primary) 8%,transparent); }
.custom-control-menu,.custom-time-menu { position: absolute; top: calc(100% + 7px); right: 0; z-index: 1800; min-width: 100%; max-height: 220px; overflow-y: auto; padding: 5px; border: 1px solid var(--border); border-radius: 11px; background: var(--popover); box-shadow: 0 20px 45px rgba(0,0,0,.35); }
.custom-control-menu button,.custom-time-menu button { width: 100%; padding: 8px 9px; border-radius: 7px; color: var(--muted); background: transparent; text-align: left; font-size: 10px; cursor: pointer; }
.custom-control-menu button:hover,.custom-control-menu button.is-selected,.custom-time-menu button:hover,.custom-time-menu button.is-selected { color: var(--foreground); background: color-mix(in srgb,var(--primary) 14%,transparent); }
.custom-control-date-icon { flex: 0 0 auto !important; width: 19px; height: 19px; display: grid; place-items: center; border-radius: 5px; color: var(--primary); background: color-mix(in srgb,var(--primary) 16%,transparent); font-size: 9px; font-weight: 700; }
.custom-datetime-control { display: grid; grid-template-columns: 1fr 108px; gap: 7px; }
.custom-calendar-menu { position: absolute; top: calc(100% + 7px); left: 0; z-index: 1800; width: 250px; padding: 10px; border: 1px solid var(--border); border-radius: 13px; background: var(--popover); box-shadow: 0 20px 45px rgba(0,0,0,.35); }
.custom-calendar-head,.custom-calendar-weekdays,.custom-calendar-grid { display: grid; grid-template-columns: repeat(7,1fr); align-items: center; gap: 3px; }
.custom-calendar-head { grid-template-columns: 28px 1fr 28px; margin-bottom: 9px; }
.custom-calendar-head strong { color: var(--foreground); font: 600 11px "Space Grotesk",sans-serif; text-align: center; text-transform: capitalize; }
.custom-calendar-head button { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 7px; color: var(--muted); background: transparent; cursor: pointer; }
.custom-calendar-head button:hover { color: var(--primary); background: color-mix(in srgb,var(--primary) 10%,transparent); }
.custom-calendar-weekdays { margin-bottom: 3px; color: var(--muted); font-size: 8px; text-align: center; }
.custom-calendar-grid button,.custom-calendar-grid span { min-height: 27px; display: grid; place-items: center; border-radius: 7px; color: var(--muted); background: transparent; font-size: 9px; cursor: pointer; }
.custom-calendar-grid button:hover,.custom-calendar-grid button.is-selected { color: var(--primary-foreground); background: var(--primary); }
.account-management-panel { margin-top: 14px; padding: 20px; border-radius: 17px; }
.account-management-intro { margin: 9px 0 16px; color: var(--muted); font-size: 10px; line-height: 1.5; }
.account-list { display: grid; border-top: 1px solid var(--border); }
.account-row { display: grid; grid-template-columns: minmax(0,1fr) 170px 86px; align-items: center; gap: 16px; min-height: 64px; padding: 9px 0; border-bottom: 1px solid var(--border); }
.account-row .person-meta>div:last-child { display: grid; gap: 3px; }
.account-row .person-meta small { color: var(--muted); font-size: 9px; }
.account-status { color: #6FE3C1; font-size: 9px; text-align: right; }
.account-status.is-saving { color: var(--primary); }
.account-feedback { margin-top: 12px; padding: 9px 11px; border: 1px solid rgba(105,210,255,.16); border-radius: 9px; color: var(--primary); background: rgba(105,210,255,.06); font-size: 10px; }
.account-management-locked { display: flex; align-items: center; gap: 13px; }
.account-management-locked strong,.account-management-locked p { display: block; }
.account-management-locked strong { margin-top: 5px; font-size: 12px; }
.account-management-locked p { margin-top: 4px; color: var(--muted); font-size: 10px; }
.filter-control { display: inline-flex; align-items: center; gap: 6px; }
.filter-control .custom-control-select { min-width: 112px; }
.filter-control .custom-control-trigger { min-height: 31px; border: 0; padding: 0 7px; background: rgba(255,255,255,.04); font-size: 9px; }
.filter-control .custom-control-menu { min-width: 150px; }
.profile-form .custom-control-select { width: 100%; }
.settings-line .custom-control-select { min-width: 130px; }
html { scrollbar-width: thin; scrollbar-color: var(--primary) transparent; }
*::-webkit-scrollbar { width: 8px; height: 8px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { border: 2px solid transparent; border-radius: 99px; background: color-mix(in srgb,var(--primary) 62%,transparent); background-clip: padding-box; }
*::-webkit-scrollbar-thumb:hover { background: var(--primary); background-clip: padding-box; }
select { appearance: none; -webkit-appearance: none; }
input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button { margin: 0; appearance: none; -webkit-appearance: none; }
input[type="date"]::-webkit-calendar-picker-indicator,input[type="time"]::-webkit-calendar-picker-indicator,input[type="datetime-local"]::-webkit-calendar-picker-indicator { display: none; opacity: 0; }
/* Project creation: preserve the control-room visual language while keeping the
   multi-agent assignment panel above every neighboring card and dropdown. */
.project-modal { width: min(620px, calc(100vw - 30px)); }
.project-name-input { display: flex; align-items: center; gap: 8px; }
.project-name-input svg { flex: 0 0 auto; color: var(--primary); }
.project-name-input input { width: 100%; }
.project-modal textarea { width: 100%; min-height: 76px; resize: vertical; }
.modal-label { display: block; margin-bottom: 8px; color: var(--muted); font-size: 10px; font-weight: 600; }
.project-color-picker { display: flex; flex-wrap: wrap; gap: 9px; }
.project-color-choice { display: grid; width: 28px; height: 28px; place-items: center; border: 2px solid transparent; border-radius: 50%; color: #0F1117; box-shadow: 0 0 0 1px rgba(255,255,255,.14); transition: transform .16s ease, border-color .16s ease; }
.project-color-choice:hover,.project-color-choice:focus-visible { transform: scale(1.08); outline: none; }
.project-color-choice.is-selected { border-color: var(--foreground); box-shadow: 0 0 0 3px rgba(105,210,255,.18); }
.project-members-field { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin-top: 15px; padding: 13px; border: 1px solid var(--border); border-radius: 12px; background: rgba(255,255,255,.025); }
.project-members-field>div:first-child { display: grid; gap: 4px; }
.project-members-field small { color: var(--muted); font-size: 9px; }
.project-link-action { color: var(--primary); }
.project-link-action svg { flex: 0 0 auto; }
@media (max-width:560px) { .project-members-field { align-items: stretch; flex-direction: column; } .project-members-field .agent-multi-select { align-self: flex-start; } }
@media (max-width:780px) { .account-row { grid-template-columns: 1fr; gap: 8px; padding: 13px 0; } .account-row .custom-control-select { width: 100%; } .account-status { text-align: left; } .custom-datetime-control { grid-template-columns: 1fr; } }
