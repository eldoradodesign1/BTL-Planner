# Configuration Supabase — ME Planner

## Résultat de validation

L’URL `https://qjqrwyikoiujwqqfaica.supabase.co` répond correctement. La nouvelle clé au format `sb_publishable_…` est reconnue par l’endpoint d’authentification Supabase, qui répond avec la configuration publique du projet et confirme que l’authentification par email est activée, avec confirmation email requise.

L’appel direct à PostgREST avec cette clé renvoie toutefois une restriction `Secret API key required`. La clé publishable reste la bonne clé à exposer dans le client web selon la documentation Supabase ; les accès aux données doivent être effectués par le client Supabase avec un JWT utilisateur et être protégés par RLS. Une clé `sb_secret_…` ne doit jamais être placée dans le navigateur, dans le dépôt GitHub ou dans une variable `VITE_*`.

## Configuration recommandée

Dans l’environnement de développement et dans l’hébergement, configurer :

```text
VITE_SUPABASE_URL=https://qjqrwyikoiujwqqfaica.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_…
```

Le nom `VITE_SUPABASE_ANON_KEY` est conservé pour la compatibilité avec la configuration existante ; la valeur attendue est la clé publishable fournie par Supabase. Le projet ne stocke pas la valeur complète dans ce document.

## Sécurité

La sécurité des données ne repose pas sur le secret de la clé publishable. Elle repose sur les rôles `anon` et `authenticated`, les policies RLS et la vérification des permissions côté base. Le fichier `supabase/schema.sql` active RLS sur les tables métier et contient les premières policies de profils, projets, tâches, notifications et activité.

## Source

Documentation officielle Supabase : [Understanding API keys](https://supabase.com/docs/guides/getting-started/api-keys). La documentation précise que les clés publishable sont conçues pour les pages web publiques et que la protection réelle des données doit être assurée par RLS.

## Réinitialisation de la base applicative

`supabase/schema.sql` commence par une réinitialisation destructive des tables et vues non système du schéma `public`. Elle est adaptée à ce projet puisque l’ancienne base ne doit plus être conservée. Elle ne supprime pas `auth` ni `storage`. Si la base contient un autre produit, il faut retirer le bloc de réinitialisation avant exécution ou travailler dans un projet Supabase séparé.

La policy sur `storage.objects` compare `owner_id`, stocké en `text` dans l’instance Supabase concernée, à `auth.uid()::text`. Ce cast explicite évite l’erreur Postgres `operator does not exist: text = uuid`.
