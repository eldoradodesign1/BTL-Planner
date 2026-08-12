/**
 * Direction visuelle : Aquarelle de contrôle — types métier lisibles pour une interface calme,
 * dense et cohérente avec le domaine de la planification.
 */
export type ThemeName = "dark" | "light" | "bluesky" | "aurora";
export type ViewName = "dashboard" | "calendar" | "tasks" | "projects" | "inbox" | "chat" | "admin" | "settings" | "profile";
export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type TaskPriority = "urgent" | "high" | "medium" | "low";

export type TeamMember = { id: string; name: string; role: string; initials: string; color: string; status: "online" | "away" | "offline"; avatarUrl?: string };
export type PlannerTask = { id: string; title: string; project: string; projectColor: string; category: string; status: TaskStatus; priority: TaskPriority; assigneeId: string; start: string; end: string; estimate: string; progress: number; tags: string[]; date?: string; description?: string; starred?: boolean; reminderAt?: string };
export type Activity = { id: string; actor: string; action: string; subject: string; time: string; color: string };
export type Notification = { id: string; title: string; description: string; time: string; unread: boolean; type: "task" | "mention" | "system" };
export type PlannerProfile = { id: string; fullName: string; email: string; role: string; avatarUrl?: string; locale: string; theme: ThemeName };
