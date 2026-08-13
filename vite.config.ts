-- ME Planner — ajout non destructif des rappels de tâches sur une base existante.
alter table public.tasks add column if not exists reminder_at timestamptz;
create index if not exists tasks_reminder_at_idx on public.tasks (reminder_at) where reminder_at is not null;
