# Architecture ME Planner — Mon Essentiel

## Vue d’ensemble

```mermaid
flowchart LR
  Browser[React + Vite + Tailwind] --> Shell[PlannerShell]
  Shell --> Dashboard[Dashboard]
  Shell --> Calendar[Calendar workspace]
  Shell --> Tasks[Task workspace]
  Shell --> Team[Chat / Inbox / Admin]
  Browser --> Auth[Supabase Auth]
  Browser --> Client[Supabase JS client]
  Client --> RLS[Postgres + RLS]
  Client --> Realtime[Supabase Realtime]
  Client --> Storage[Supabase Storage]
  RLS --> Profiles[(profiles)]
  RLS --> Projects[(projects)]
  RLS --> TaskTable[(tasks)]
  RLS --> Conversations[(conversations / messages)]
  Realtime --> Browser
```

## Flux d’authentification

```mermaid
sequenceDiagram
  participant U as Utilisateur
  participant A as AuthGate
  participant S as Supabase Auth
  participant P as Postgres
  U->>A: Saisit email + mot de passe
  A->>S: signInWithPassword
  S-->>A: Session + JWT utilisateur
  A->>P: Requêtes avec rôle authenticated
  P-->>A: Données filtrées par RLS
  A-->>U: Workspace ME Planner
```

## Principes de frontière

Le navigateur ne reçoit qu’une clé publishable et un JWT de session. Les policies RLS déterminent l’accès aux lignes. Une éventuelle clé `sb_secret` ne doit être utilisée que dans un environnement backend contrôlé, jamais dans `VITE_*`, le client React ou le dépôt GitHub.
