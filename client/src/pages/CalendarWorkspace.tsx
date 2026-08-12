/**
 * Direction visuelle : Aquarelle de contrôle — calendrier central, tâche tangible,
 * déplacement direct et durée manipulable sans quitter le planning.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent, PointerEvent } from "react";
import { addDays, addMonths, addWeeks, addYears, endOfMonth, format, getDaysInMonth, isSameMonth, isToday, startOfMonth, startOfYear, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, CalendarRange, ChevronLeft, ChevronRight, Filter, GanttChart, List, Plus, Rows3, SlidersHorizontal } from "lucide-react";
import { usePlannerStore } from "@/store/usePlannerStore";
import { supabase } from "@/lib/supabase";
import type { PlannerTask } from "@/lib/types";
import { AgentMultiSelect } from "@/components/AgentMultiSelect";
import { isAdminRole } from "@/lib/team";

type CalendarMode = "day" | "week" | "month" | "year" | "list" | "timeline" | "gantt";
type ScheduleHandler = (task: PlannerTask, date: string, start: string, end: string) => void;

const hours = Array.from({ length: 10 }, (_, index) => index + 8);
const timeToMinutes = (time: string) => { const [hour, minute] = time.split(":").map(Number); return hour * 60 + minute; };
const minutesToTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const durationOf = (task: PlannerTask) => Math.max(15, timeToMinutes(task.end) - timeToMinutes(task.start));
const dateKey = (date: Date) => format(date, "yyyy-MM-dd");
const taskDateTime = (date: string, time: string) => new Date(`${date}T${time}:00`).toISOString();

export default function CalendarWorkspace() {
  const tasks = usePlannerStore((state) => state.tasks);
  const profile = usePlannerStore((state) => state.profile);
  const teamMembers = usePlannerStore((state) => state.teamMembers);
  const selectedAgentIds = usePlannerStore((state) => state.selectedAgentIds);
  const toggleAgent = usePlannerStore((state) => state.toggleAgent);
  const selectAllAgents = usePlannerStore((state) => state.selectAllAgents);
  const clearAgentSelection = usePlannerStore((state) => state.clearAgentSelection);
  const openTaskModal = usePlannerStore((state) => state.openTaskModal);
  const updateTask = usePlannerStore((state) => state.updateTask);
  const setView = usePlannerStore((state) => state.setView);
  const openTask = useCallback((id: string) => openTaskModal(id), [openTaskModal]);
  const [anchor, setAnchor] = useState(() => new Date(2026, 7, 11));
  const [mode, setMode] = useState<CalendarMode>("week");
  const [renderedMode, setRenderedMode] = useState<CalendarMode>("week");
  const [modeTransitioning, setModeTransitioning] = useState(false);
  const modeTimer = useRef<number | null>(null);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const monthDays = Array.from({ length: 42 }, (_, index) => addDays(startOfWeek(monthStart, { weekStartsOn: 1 }), index));
  const canManageTeam = isAdminRole(profile.role);
  const allowedAgentIds = useMemo(() => canManageTeam ? selectedAgentIds : teamMembers.filter((member) => member.id === profile.id || member.id === "self").map((member) => member.id), [canManageTeam, selectedAgentIds, teamMembers, profile.id]);
  const visibleTasks = useMemo(() => tasks.filter((task) => allowedAgentIds.includes(task.assigneeId)).filter((task) => !onlyOpen || task.status !== "done"), [tasks, allowedAgentIds, onlyOpen]);

  const persistSchedule = useCallback<ScheduleHandler>(async (task, date, start, end) => {
    const minutes = Math.max(15, timeToMinutes(end) - timeToMinutes(start));
    updateTask(task.id, { date, start, end, estimate: durationLabel(minutes) });
    if (!supabase || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(task.id)) return;
    const { error } = await supabase.from("tasks").update({ start_at: taskDateTime(date, start), end_at: taskDateTime(date, end), estimated_minutes: minutes }).eq("id", task.id);
    if (error) console.error("ME Planner: impossible de synchroniser le créneau", error.message);
  }, [updateTask]);

  const moveAnchor = (direction: number) => {
    setAnchor((current) => {
      if (mode === "day") return addDays(current, direction);
      if (mode === "week") return addWeeks(current, direction);
      if (mode === "month") return addMonths(current, direction);
      if (mode === "year") return addYears(current, direction);
      return addWeeks(current, direction);
    });
  };
  const switchMode = (nextMode: CalendarMode) => {
    if (nextMode === mode) return;
    if (modeTimer.current) window.clearTimeout(modeTimer.current);
    setMode(nextMode);
    setModeTransitioning(true);
    modeTimer.current = window.setTimeout(() => { setRenderedMode(nextMode); setModeTransitioning(false); modeTimer.current = null; }, 180);
  };
  useEffect(() => () => { if (modeTimer.current) window.clearTimeout(modeTimer.current); }, []);
  const periodTitle = mode === "day" ? format(anchor, "d MMMM yyyy", { locale: fr }) : mode === "year" ? format(anchor, "yyyy", { locale: fr }) : mode === "month" ? format(monthStart, "MMMM yyyy", { locale: fr }) : format(weekStart, "MMMM yyyy", { locale: fr });
  const periodSubtitle = mode === "day" ? `Une journée lisible, de ${format(anchor, "EEEE d MMMM", { locale: fr })}.` : mode === "year" ? `Une vue d’ensemble de ${format(anchor, "yyyy", { locale: fr })}, mois par mois.` : mode === "month" ? `${format(monthStart, "d MMMM", { locale: fr })} – ${format(monthEnd, "d MMMM yyyy", { locale: fr })}.` : `Semaine du ${format(weekStart, "d MMMM", { locale: fr })} au ${format(days[6], "d MMMM yyyy", { locale: fr })}.`;

  return <div className="workspace-content"><div className="view-header"><div><span className="eyebrow">Calendrier opérationnel</span><h1>Votre planning, <em>en mouvement.</em></h1><p className="hero-subtitle">{periodSubtitle}</p></div><div className="hero-actions"><button className="secondary-button compact" onClick={() => setAnchor(new Date())}>Aujourd’hui</button><button className="primary-button compact" onClick={() => openTaskModal()}><Plus size={16} /> Nouvelle tâche</button></div></div><div className="calendar-scope-bar glass-panel"><div><span className="eyebrow">Périmètre d’équipe</span><strong>Afficher les tâches de plusieurs agents</strong></div>{canManageTeam ? <AgentMultiSelect members={teamMembers} selectedIds={selectedAgentIds} onToggle={toggleAgent} onSelectAll={selectAllAgents} onClear={clearAgentSelection} /> : <span className="scope-readonly">Votre planning personnel</span>}</div><div className="calendar-toolbar glass-panel"><div className="calendar-nav"><button className="icon-button" onClick={() => moveAnchor(-1)} aria-label="Période précédente"><ChevronLeft size={17} /></button><strong>{periodTitle}</strong><button className="icon-button" onClick={() => moveAnchor(1)} aria-label="Période suivante"><ChevronRight size={17} /></button></div><div className="view-switch" role="tablist" aria-label="Vues du calendrier"><button className={mode === "day" ? "active" : ""} onClick={() => switchMode("day")} role="tab" aria-selected={mode === "day"}><CalendarDays size={13} /> Jour</button><button className={mode === "week" ? "active" : ""} onClick={() => switchMode("week")} role="tab" aria-selected={mode === "week"}><CalendarDays size={13} /> Semaine</button><button className={mode === "month" ? "active" : ""} onClick={() => switchMode("month")} role="tab" aria-selected={mode === "month"}><CalendarDays size={13} /> Mois</button><button className={mode === "year" ? "active" : ""} onClick={() => switchMode("year")} role="tab" aria-selected={mode === "year"}><CalendarRange size={13} /> Année</button><button className={mode === "list" ? "active" : ""} onClick={() => switchMode("list")} role="tab" aria-selected={mode === "list"}><List size={13} /> Liste</button><button className={mode === "timeline" ? "active" : ""} onClick={() => switchMode("timeline")} role="tab" aria-selected={mode === "timeline"}><Rows3 size={13} /> Timeline</button><button className={mode === "gantt" ? "active" : ""} onClick={() => switchMode("gantt")} role="tab" aria-selected={mode === "gantt"}><GanttChart size={13} /> Gantt</button></div><div className="toolbar-actions"><button className={`icon-button ${onlyOpen ? "is-selected" : ""}`} onClick={() => setOnlyOpen(!onlyOpen)} aria-label="Filtrer les tâches ouvertes"><Filter size={16} /></button><button className="icon-button" onClick={() => setView("settings")} aria-label="Préférences de calendrier"><SlidersHorizontal size={16} /></button></div></div>{modeTransitioning ? <CalendarModeSkeleton /> : renderedMode === "day" ? <DayGrid day={anchor} tasks={visibleTasks.filter((task) => task.date === dateKey(anchor))} allTasks={visibleTasks} onOpen={openTask} onSchedule={persistSchedule} /> : renderedMode === "week" ? <WeekGrid days={days} tasks={visibleTasks} onOpen={openTask} onSchedule={persistSchedule} /> : renderedMode === "month" ? <MonthGrid days={monthDays} monthStart={monthStart} tasks={visibleTasks} allTasks={visibleTasks} onOpen={openTask} onSchedule={persistSchedule} /> : renderedMode === "year" ? <YearGrid year={anchor} tasks={visibleTasks} onOpen={openTask} onSchedule={persistSchedule} onSelectMonth={(month) => { setAnchor(month); switchMode("month"); }} /> : renderedMode === "list" ? <ListMode tasks={visibleTasks} onOpen={openTask} /> : renderedMode === "timeline" ? <TimelineMode tasks={visibleTasks} onOpen={openTask} /> : <GanttMode tasks={visibleTasks} onOpen={openTask} />}</div>;
}

function durationLabel(minutes: number) { return minutes >= 60 ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ""}` : `${minutes} min`; }

function CalendarModeSkeleton() { return <div className="calendar-transition-skeleton" aria-busy="true" aria-live="polite"><div className="skeleton-calendar glass-panel"><div className="skeleton-calendar-head">{Array.from({ length: 7 }, (_, index) => <span className="skeleton-block" key={index} />)}</div><div className="skeleton-calendar-body">{Array.from({ length: 28 }, (_, index) => <span className="skeleton-block" key={index} />)}</div></div></div>; }

function taskFromDrag(event: DragEvent<HTMLElement>, tasks: PlannerTask[]) { const id = event.dataTransfer.getData("text/task-id"); return tasks.find((task) => task.id === id); }
function beginTaskDrag(event: DragEvent<HTMLElement>, task: PlannerTask) { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/task-id", task.id); }
function scheduleFromDrop(event: DragEvent<HTMLElement>, day: Date, allTasks: PlannerTask[], onSchedule: ScheduleHandler, rect: DOMRect) { event.preventDefault(); const task = taskFromDrag(event, allTasks); if (!task) return; const raw = 8 * 60 + ((event.clientY - rect.top) / 63) * 60; const startMinutes = Math.max(8 * 60, Math.min(17 * 60, Math.round(raw / 15) * 15)); onSchedule(task, dateKey(day), minutesToTime(startMinutes), minutesToTime(Math.min(18 * 60, startMinutes + durationOf(task)))); }

function useTaskResize(onSchedule: ScheduleHandler) {
  const [resizing, setResizing] = useState<{ task: PlannerTask; date: string; startY: number; originalEnd: number } | null>(null);
  useEffect(() => {
    if (!resizing) return;
    const move = (event: globalThis.PointerEvent) => { const delta = Math.round((event.clientY - resizing.startY) / 15) * 15; const nextEnd = Math.max(timeToMinutes(resizing.task.start) + 15, Math.min(18 * 60, resizing.originalEnd + delta)); onSchedule(resizing.task, resizing.date, resizing.task.start, minutesToTime(nextEnd)); };
    const up = () => setResizing(null);
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [resizing, onSchedule]);
  return (task: PlannerTask, date: string, event: PointerEvent<HTMLElement>) => setResizing({ task, date, startY: event.clientY, originalEnd: timeToMinutes(task.end) });
}

function DayGrid({ day, tasks, allTasks, onOpen, onSchedule }: { day: Date; tasks: PlannerTask[]; allTasks: PlannerTask[]; onOpen: (id: string) => void; onSchedule: ScheduleHandler }) {
  const onResizeStart = useTaskResize(onSchedule);
  return <div className="calendar-mode-stack"><div className="glass-panel day-view-panel"><div className="calendar-mode-heading"><div><span className="eyebrow">Vue journalière</span><h2>{format(day, "EEEE d MMMM", { locale: fr })}</h2></div><span>{tasks.length} tâche{tasks.length > 1 ? "s" : ""} · Glissez pour réorganiser</span></div><div className="calendar-shell day-calendar-shell"><div className="calendar-grid-head day-grid-head"><div className="time-column-label">CET</div><div className={`day-label ${isToday(day) ? "today" : ""}`}><span>{format(day, "EEE", { locale: fr })}</span><strong>{format(day, "d")}</strong></div></div><div className="calendar-grid-body day-grid-body"><div className="time-column">{hours.map((hour) => <span key={hour}>{String(hour).padStart(2, "0")}:00</span>)}</div><DayColumn day={day} tasks={tasks} allTasks={allTasks} onOpen={onOpen} onSchedule={onSchedule} onResizeStart={onResizeStart} /></div></div><div className="calendar-legend"><span><i className="legend-dot cyan" />Déposez une tâche sur une heure pour la déplacer</span><span><i className="legend-dot mint" />Tirez la poignée basse pour redimensionner</span></div></div></div>;
}

function WeekGrid({ days, tasks, onOpen, onSchedule }: { days: Date[]; tasks: PlannerTask[]; onOpen: (id: string) => void; onSchedule: ScheduleHandler }) {
  const onResizeStart = useTaskResize(onSchedule);
  return <div className="calendar-mode-stack"><div className="glass-panel calendar-shell"><div className="calendar-grid-head"><div className="time-column-label">CET</div>{days.map((day) => <div className={`day-label ${isToday(day) ? "today" : ""}`} key={dateKey(day)}><span>{format(day, "EEE", { locale: fr })}</span><strong>{format(day, "d")}</strong></div>)}</div><div className="calendar-grid-body"><div className="time-column">{hours.map((hour) => <span key={hour}>{String(hour).padStart(2, "0")}:00</span>)}</div>{days.map((day) => <DayColumn key={dateKey(day)} day={day} tasks={tasks.filter((task) => task.date === dateKey(day))} allTasks={tasks} onOpen={onOpen} onSchedule={onSchedule} onResizeStart={onResizeStart} />)}</div></div><div className="calendar-legend"><span><i className="legend-dot cyan" />Glissez une tâche pour la déplacer</span><span><i className="legend-dot mint" />Tirez sa poignée basse pour redimensionner</span></div></div>;
}

function DayColumn({ day, tasks, allTasks, onOpen, onSchedule, onResizeStart }: { day: Date; tasks: PlannerTask[]; allTasks: PlannerTask[]; onOpen: (id: string) => void; onSchedule: ScheduleHandler; onResizeStart: (task: PlannerTask, date: string, event: PointerEvent<HTMLElement>) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const moveTask = (event: DragEvent<HTMLDivElement>) => { const rect = ref.current?.getBoundingClientRect(); if (!rect) return; scheduleFromDrop(event, day, allTasks, onSchedule, rect); };
  return <div className="calendar-day-column" ref={ref} onDragOver={(event) => event.preventDefault()} onDrop={moveTask}>{hours.map((hour) => <div className="hour-cell" key={hour} />)}{tasks.map((task) => <TaskEvent key={task.id} task={task} onOpen={onOpen} onResizeStart={(event) => onResizeStart(task, dateKey(day), event)} />)}</div>;
}

function TaskEvent({ task, onOpen, onResizeStart }: { task: PlannerTask; onOpen: (id: string) => void; onResizeStart: (event: PointerEvent<HTMLElement>) => void }) {
  const top = Math.max(0, (timeToMinutes(task.start) - 8 * 60) * 63 / 60);
  const height = Math.max(28, durationOf(task) * 63 / 60);
  return <button className="calendar-event dnd-task-event" draggable onDragStart={(event) => beginTaskDrag(event, task)} onClick={() => onOpen(task.id)} style={{ top: `${top}px`, height: `${height}px`, background: `${task.projectColor}18`, borderColor: `${task.projectColor}66`, color: task.projectColor }}><strong>{task.title}</strong><span>{task.start} · {task.end}</span><i className="resize-handle" onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); onResizeStart(event); }} aria-label="Redimensionner la durée" /></button>;
}

function MonthGrid({ days, monthStart, tasks, allTasks, onOpen, onSchedule }: { days: Date[]; monthStart: Date; tasks: PlannerTask[]; allTasks: PlannerTask[]; onOpen: (id: string) => void; onSchedule: ScheduleHandler }) {
  const moveTask = (event: DragEvent<HTMLDivElement>, day: Date) => { event.preventDefault(); const task = taskFromDrag(event, allTasks); if (task) onSchedule(task, dateKey(day), task.start, task.end); };
  return <div className="glass-panel month-calendar"><div className="calendar-mode-heading month-heading"><div><span className="eyebrow">Vue mensuelle</span><h2>{format(monthStart, "MMMM yyyy", { locale: fr })}</h2></div><span>Déposez une tâche dans un jour pour changer sa date</span></div><div className="month-weekdays">{["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => <span key={day}>{day}</span>)}</div><div className="month-grid">{days.map((day) => { const key = dateKey(day); const dayTasks = tasks.filter((task) => task.date === key); return <div className={`month-cell ${isSameMonth(day, monthStart) ? "in-month" : "out-month"} ${isToday(day) ? "today" : ""}`} key={key} onDragOver={(event) => event.preventDefault()} onDrop={(event) => moveTask(event, day)}><div className="month-cell-head"><strong>{format(day, "d")}</strong>{dayTasks.length > 0 && <span>{dayTasks.length}</span>}</div><div className="month-task-stack">{dayTasks.slice(0, 3).map((task) => <button key={task.id} draggable className="month-task dnd-month-task" onDragStart={(event) => beginTaskDrag(event, task)} onClick={() => onOpen(task.id)} style={{ borderLeftColor: task.projectColor }}><span>{task.start}</span>{task.title}</button>)}{dayTasks.length > 3 && <small>+ {dayTasks.length - 3} autres</small>}</div></div>; })}</div><div className="month-summary"><span>{format(monthStart, "d MMMM", { locale: fr })} – {format(endOfMonth(monthStart), "d MMMM yyyy", { locale: fr })}</span><span>{tasks.filter((task) => task.date && task.date >= dateKey(monthStart) && task.date <= dateKey(endOfMonth(monthStart))).length} tâches dans le mois</span></div></div>;
}

function YearGrid({ year, tasks, onOpen, onSchedule, onSelectMonth }: { year: Date; tasks: PlannerTask[]; onOpen: (id: string) => void; onSchedule: ScheduleHandler; onSelectMonth: (month: Date) => void }) {
  const months = Array.from({ length: 12 }, (_, index) => addMonths(startOfYear(year), index));
  return <div className="calendar-mode-stack"><div className="glass-panel year-calendar-panel"><div className="calendar-mode-heading"><div><span className="eyebrow">Vue annuelle</span><h2>{format(year, "yyyy")}</h2></div><span>Glissez une tâche vers un jour, ou vers un mois pour la repositionner</span></div><div className="year-grid">{months.map((month) => <YearMonthCard key={dateKey(month)} month={month} tasks={tasks} onOpen={onOpen} onSchedule={onSchedule} onSelectMonth={onSelectMonth} />)}</div></div></div>;
}

function YearMonthCard({ month, tasks, onOpen, onSchedule, onSelectMonth }: { month: Date; tasks: PlannerTask[]; onOpen: (id: string) => void; onSchedule: ScheduleHandler; onSelectMonth: (month: Date) => void }) {
  const monthTasks = tasks.filter((task) => task.date?.startsWith(format(month, "yyyy-MM")));
  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  const moveToDay = (event: DragEvent<HTMLDivElement>, day: Date) => { event.preventDefault(); event.stopPropagation(); if (!isSameMonth(day, month)) return; const task = taskFromDrag(event, tasks); if (task) onSchedule(task, dateKey(day), task.start, task.end); };
  const moveToMonth = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); const task = taskFromDrag(event, tasks); if (!task) return; const day = Math.min(Number(task.date?.slice(-2) ?? 1), getDaysInMonth(month)); onSchedule(task, dateKey(new Date(month.getFullYear(), month.getMonth(), day)), task.start, task.end); };
  return <div className={`year-month-card ${monthTasks.length ? "has-tasks" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={moveToMonth}><button className="year-month-head" onClick={() => onSelectMonth(month)}><strong>{format(month, "MMMM", { locale: fr })}</strong><span>{monthTasks.length} tâche{monthTasks.length > 1 ? "s" : ""}</span></button><div className="year-weekdays">{["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="year-days">{cells.map((day) => { const inMonth = isSameMonth(day, month); const dayTasks = inMonth ? tasks.filter((task) => task.date === dateKey(day)) : []; return <div className={`year-day-cell ${inMonth ? "in-month" : "out-month"} ${isToday(day) ? "today" : ""}`} key={dateKey(day)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => moveToDay(event, day)}><span>{format(day, "d")}</span><div className="year-task-dots">{dayTasks.slice(0, 3).map((task) => <button key={task.id} draggable className="year-task-dot" onDragStart={(event) => beginTaskDrag(event, task)} onClick={() => onOpen(task.id)} style={{ background: task.projectColor }} aria-label={task.title} />)}</div></div>; })}</div></div>;
}

function ListMode({ tasks, onOpen }: { tasks: PlannerTask[]; onOpen: (id: string) => void }) { return <div className="glass-panel calendar-mode-panel"><div className="calendar-mode-heading"><div><span className="eyebrow">Vue liste</span><h2>{tasks.length} tâches planifiées</h2></div><span>Triées par date et heure</span></div>{tasks.map((task) => <button className="calendar-task-row" key={task.id} onClick={() => onOpen(task.id)}><span className="calendar-task-date">{task.date ? format(new Date(`${task.date}T12:00:00`), "EEE d MMM", { locale: fr }) : "Sans date"}</span><span className="calendar-task-dot" style={{ background: task.projectColor }} /><span className="calendar-task-title">{task.title}<small>{task.project}</small></span><span className={`task-status status-${task.status}`}>{task.status === "done" ? "Terminée" : task.status === "blocked" ? "Bloquée" : "Planifiée"}</span><span className="calendar-task-time">{task.start}–{task.end}</span></button>)}</div>; }
function TimelineMode({ tasks, onOpen }: { tasks: PlannerTask[]; onOpen: (id: string) => void }) { return <div className="glass-panel calendar-mode-panel"><div className="calendar-mode-heading"><div><span className="eyebrow">Timeline</span><h2>Le fil de la semaine</h2></div><span>Les durées réelles sont visibles</span></div><div className="timeline-axis"><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span></div><div className="timeline-rows">{tasks.map((task) => <button className="timeline-row" key={task.id} onClick={() => onOpen(task.id)}><strong>{task.title}</strong><div className="timeline-track"><i style={{ left: `${Math.max(0, (timeToMinutes(task.start) - 8 * 60) / 600) * 100}%`, width: `${Math.min(100, durationOf(task) / 600 * 100)}%`, background: task.projectColor }} /></div><span>{task.start}–{task.end}</span></button>)}</div></div>; }
function GanttMode({ tasks, onOpen }: { tasks: PlannerTask[]; onOpen: (id: string) => void }) { return <div className="glass-panel calendar-mode-panel"><div className="calendar-mode-heading"><div><span className="eyebrow">Gantt</span><h2>Les dépendances visibles</h2></div><span>Une ligne par tâche</span></div><div className="gantt-grid"><div className="gantt-head"><span>Tâche</span><span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span></div>{tasks.map((task, index) => <button className="gantt-row" key={task.id} onClick={() => onOpen(task.id)}><strong>{task.title}</strong><div className="gantt-track"><i style={{ left: `${index * 12}%`, width: `${22 + (index % 2) * 15}%`, background: task.projectColor }} /></div></button>)}</div></div>; }
