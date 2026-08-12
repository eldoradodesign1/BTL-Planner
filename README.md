# ME Planner — Mon Essentiel

ME Planner est une application React/TypeScript de planification collaborative centrée sur le calendrier, les tâches, les projets, la communication interne et le pilotage multi-agents. Le projet est prêt à être extrait dans VS Code, versionné dans Git et publié dans un dépôt GitHub.

> **Important :** GitHub stocke et versionne le code ; il n’exécute pas directement le serveur Node de l’application. Après publication du dépôt, l’application est immédiatement exploitable en local avec les commandes ci-dessous. Un hébergement public pourra être ajouté plus tard, sans modifier le dépôt source.

## Fonctionnalités incluses

Le projet contient l’authentification Supabase, le dashboard, les calendriers jour/semaine/mois/année, le glisser-déposer et le redimensionnement des tâches, les rappels, les notifications, les tâches et projets, le chat interne, le profil avec avatar, les thèmes Dark/Light/BlueSky/Aurora, le français et l’anglais, les filtres multi-agents, le pilotage administrateur, les raccourcis clavier configurables et les overlays accessibles avec topbar sticky.

## Prérequis

Installez **Node.js 22** et **pnpm 10**. Le fichier `.node-version` indique la version Node vérifiée dans ce projet. Avec Corepack, pnpm peut être activé ainsi :

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
```

## Installation et lancement local

Depuis le dossier extrait :

```bash
pnpm install
pnpm dev
```

Vite ouvre l’application en mode développement. Si aucune variable d’environnement n’est créée, le projet utilise la configuration publique ME Planner déjà présente dans `client/src/lib/supabase.ts` et reste navigable. Pour personnaliser explicitement la configuration, copiez `ENVIRONMENT.example` vers `.env.local` :

```bash
cp ENVIRONMENT.example .env.local
pnpm dev
```

Les clés `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont des paramètres publics destinés au navigateur. **Ne mettez jamais une clé `service_role` dans `.env.local`, dans le code ou dans GitHub.**

## Configuration Supabase

Pour disposer de l’authentification, de la persistance et du temps réel, ouvrez l’éditeur SQL du projet Supabase puis exécutez les scripts dans cet ordre :

| Ordre | Fichier | Rôle |
|---:|---|---|
| 1 | `supabase/schema.sql` | Recrée le schéma applicatif ME Planner. Cette opération est destructive pour les tables applicatives du schéma `public`. |
| 2 | `supabase/fix_first_account.sql` | Répare le profil initial et la réclamation du rôle administrateur. |
| 3 | `supabase/profile_avatar.sql` | Prépare le bucket public des avatars. |
| 4 | `supabase/fix_chat.sql` | Active les policies nécessaires au chat. |
| 5 | `supabase/reminders.sql` | Ajoute `reminder_at` pour la persistance des rappels. |

Le frontend possède un fallback sans `reminder_at` pour continuer à charger si la dernière migration n’a pas encore été appliquée, mais l’exécution de `supabase/reminders.sql` est nécessaire pour activer complètement les rappels persistants.

## Vérifications de qualité

Avant un commit ou une pull request, exécutez :

```bash
pnpm check
pnpm test
pnpm build
```

Le build produit `dist/`, qui est volontairement ignoré par Git et peut être régénéré à tout moment. Pour vérifier le build localement :

```bash
pnpm start
```

Le serveur local servira le contenu généré dans `dist/public` sur le port `3000`, ou sur la valeur de `PORT` si elle est définie.

## Publier le code sur GitHub

Créez d’abord un dépôt vide sur GitHub, puis depuis le dossier extrait :

```bash
git init
git add .
git commit -m "Initial commit — ME Planner"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/VOTRE_DEPOT.git
git push -u origin main
```

Le workflow `.github/workflows/ci.yml` exécutera automatiquement l’installation, le typecheck, les tests et le build à chaque push sur `main` ou pull request. Les dépendances, fichiers `.env.local`, logs, caches et builds générés ne sont pas inclus dans le dépôt grâce à `.gitignore`.

## Raccourcis par défaut

Les raccourcis peuvent être modifiés dans **Paramètres → Raccourcis clavier** et sont conservés dans le navigateur. Les valeurs initiales sont `N` pour une nouvelle tâche, `⌘/Ctrl + K` pour la palette, `D` pour le dashboard, `M` pour le calendrier, `T` pour les tâches et `C` pour le chat. Ils sont automatiquement neutralisés dans les champs texte et le compositeur du chat.

## Structure du projet

```text
client/src/components/   composants de shell, modales et UI
client/src/hooks/        synchronisations Supabase et rappels
client/src/lib/          types, i18n, validation, raccourcis et client Supabase
client/src/pages/        workspace, calendrier, chat, profil et paramètres
client/src/store/        état Zustand et fallback local
supabase/                schéma et migrations SQL versionnées
docs/                    guides développeur, utilisateur et architecture
server/                  serveur Express utilisé par le build local
```

## Documentation complémentaire

Consultez `docs/DEVELOPER_GUIDE.md` pour l’architecture et les migrations, `docs/USER_GUIDE.md` pour l’utilisation, `docs/ARCHITECTURE.md` pour les diagrammes et `docs/SUPABASE_KEY_GUIDE.md` pour la gestion des clés publiques et sensibles.

## Licence

Le projet est distribué sous licence MIT. Voir `LICENSE`.

## Déploiement automatique sur GitHub Pages

Le workflow `.github/workflows/ci.yml` déploie automatiquement `dist/` sur GitHub Pages après chaque push sur `main`. Il calcule le sous-chemin à partir du nom réel du dépôt : `/BTL-Planner/` si le dépôt conserve son nom actuel, ou `/ME-Planner/` après renommage.

Après le premier push, dans GitHub ouvrez **Settings → Pages**, choisissez **GitHub Actions** comme source, puis attendez la fin du workflow `ME Planner CI`. L’URL sera généralement `https://VOTRE_COMPTE.github.io/NOM_DU_DEPOT/`.

Le build Pages utilise `pnpm build:pages`, tandis que `pnpm build` reste disponible pour le serveur Node local. Les logos et favicons sont inclus dans `client/public/assets`, de sorte que le site publié ne dépend pas de Manus Storage.
