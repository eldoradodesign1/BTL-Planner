/**
 * Direction visuelle : Aquarelle de contrôle — rappels discrets, utiles et sans doublons.
 */
import { useEffect } from "react";
import { usePlannerStore } from "@/store/usePlannerStore";

export function useTaskReminderNotifications() {
  const tasks = usePlannerStore((state) => state.tasks);
  const addNotification = usePlannerStore((state) => state.addNotification);
  useEffect(() => {
    const scan = () => {
      const now = Date.now();
      tasks.forEach((task) => {
        if (!task.reminderAt || task.status === "done") return;
        const reminder = new Date(task.reminderAt).getTime();
        if (reminder <= now + 15 * 60 * 1000 && reminder >= now - 60 * 60 * 1000) addNotification({ id: `reminder-${task.id}`, title: "Rappel de tâche", description: `${task.title} commence bientôt.`, time: "À l’instant", unread: true, type: "task" });
      });
    };
    scan(); const interval = window.setInterval(scan, 30_000); return () => window.clearInterval(interval);
  }, [tasks, addNotification]);
}
