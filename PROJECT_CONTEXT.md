# ME Planner — Mon Essentiel — Contexte permanent

## Vision

ME Planner — Mon Essentiel est un centre de planification collaboratif pour transformer les engagements d’une équipe en une journée lisible, partageable et maîtrisée. Le calendrier constitue le cœur du produit ; le dashboard synthétise la charge, les retards, les projets actifs et l’activité récente.

## Architecture actuelle

Le projet est un frontend React 19 + Vite + Tailwind CSS 4 avec composants réutilisables, Framer Motion pour les transitions, Zustand pour l’état local et une couche Supabase réelle. `AuthGate` gère la session, la connexion, l’inscription et la récupération de mot de passe. `useSupabaseTaskSync` charge les tâches visibles selon RLS et écoute les changements Realtime ; le fallback local permet de rester navigable tant que la migration n’est pas appliquée.

## Choix techniques

Le scaffold initial utilise Wouter pour le routing et shadcn/ui pour les primitives. L’interface ME Planner ajoute une couche de design personnalisée, un store Zustand, des types métier partagés, des données de démonstration déterministes et une stratégie d’adaptateur local/Supabase. Le logo Mon Essentiel est référencé via une URL Manus persistante et ne nécessite pas de fichier média dans le dépôt.

## Dépendances principales

React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide, Zustand, TanStack Query, Supabase JS, dnd-kit, date-fns, Zod, i18next et react-i18next.

## Design System

Direction « Aquarelle de contrôle » : fond bleu nuit doux, cyan signature `#69D2FF`, surfaces translucides, ombres diffuses, Space Grotesk pour les titres, DM Sans pour le texte courant. Les thèmes Dark, Light, BlueSky et Aurora sont exposés par attribut `data-theme`.

## Routes et composants

`/` ouvre le dashboard principal. Les vues secondaires sont pilotées dans le shell : `dashboard`, `calendar`, `tasks`, `projects`, `inbox`, `chat`, `admin` et `settings`. `PlannerShell` porte la navigation, `TaskModal` gère la création et l’édition, et `Home` compose les vues métier.

## Base de données

Le script versionné est dans `supabase/schema.sql`. Il commence par une réinitialisation destructive des tables et vues non système du schéma `public`, puis recrée profils, projets, tâches, checklist, commentaires, notifications, activité, conversations, messages, réactions, pièces jointes, bucket privé et RLS. Il ne touche pas aux schémas `auth` et `storage`. L’endpoint et la clé publishable du nouveau projet ME Planner sont utilisés par défaut dans `client/src/lib/supabase.ts`, avec priorité aux variables Vite lorsqu’elles existent.

## Variables d’environnement

`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont les seules variables nécessaires au client Supabase. Les clés secrètes Supabase, notamment la service-role key, ne doivent jamais être exposées dans le frontend ni être commit dans GitHub.

## Livraison GitHub

Le dépôt est prévu pour être extrait, installé avec pnpm et versionné directement dans GitHub. `ENVIRONMENT.example` documente la configuration Vite publique ; aucun `.env.local`, log, cache, dossier `node_modules` ou build `dist` ne doit être commit. Le workflow `.github/workflows/ci.yml` vérifie automatiquement le typecheck, les tests et le build.

## Roadmap et état

Shell responsive, dashboard de synthèse, calendrier semaine, filtres date/priorité et tri des tâches, création/édition/complétion de tâches, recherche, raccourcis principaux, quatre thèmes, AuthGate Supabase, états de chargement d’inscription, réclamation idempotente du premier Super Admin, schéma RLS et synchronisation des tâches sont terminés. L’application doit encore être validée avec un compte réel dans le projet Supabase ; les écritures persistantes de chat, pièces jointes et administration avancée restent à étendre.

Voir `todo.md` pour la liste de production détaillée.
