# ME Planner — Todo de production

## Fondations

- [x] Ajouter le fichier `PROJECT_CONTEXT.md` et le maintenir à chaque jalon.
- [x] Installer les dépendances nécessaires au calendrier, à la validation et à Supabase.
- [x] Définir les tokens CSS des quatre thèmes et les variables de densité/typographie.
- [x] Créer le shell responsive, les rails de navigation et la command palette.

## Données et sécurité

- [x] Définir les migrations SQL Supabase versionnées.
- [x] Définir les types métier des utilisateurs, projets, tâches, événements, commentaires et notifications.
- [x] Ajouter les policies RLS et les fonctions SQL de contrôle d’accès.
- [x] Préparer le stockage des pièces jointes avec métadonnées et contrôle de taille/type.
- [x] Ajouter l’authentification Supabase et les flux de session, récupération de mot de passe et profil.
- [x] Configurer l’URL Supabase et la clé publique `anon` via les secrets du projet, sans les écrire dans le code.
- [x] Vérifier que la clé publique reçue n’est pas tronquée ou suffixée par du texte accidentel.
- [x] Valider l’URL et la clé publishable du nouveau projet Supabase ME Planner en lecture seule.
- [x] Remplacer les valeurs de configuration BTL par celles du projet ME Planner.
- [x] Appliquer `supabase/schema.sql` dans le projet Supabase et vérifier les policies sans utiliser de clé service-role côté client (confirmé par l’utilisateur).
- [x] Corriger la comparaison `storage.objects.owner_id` (`text`) avec `auth.uid()` (`uuid`) dans la policy Storage.
- [x] Vérifier l’absence d’autres comparaisons `text = uuid` dans les policies générées.
- [x] Ajouter en tête de `supabase/schema.sql` la suppression explicite des tables applicatives existantes avant recréation.
- [x] Vérifier que la réinitialisation ne touche pas aux schémas système Supabase `auth` et `storage`.
- [x] Documenter clairement le caractère irréversible de la réinitialisation et l’ordre d’exécution de la migration.
- [ ] Tester la connexion anonyme, l’inscription/connexion, la session et la récupération de mot de passe.
- [x] Diagnostiquer l’erreur générique `Database error saving new user` du trigger `auth.users`.
- [x] Rendre la création de profil idempotente et non bloquante pour l’inscription Supabase.
- [x] Ajouter une migration corrective non destructive et une procédure de vérification.
- [x] Diagnostiquer et corriger le blocage lors de la création du premier compte Supabase.
- [x] Ajouter un état de chargement explicite pendant l’inscription et les erreurs de confirmation email.
- [x] Revalider la nouvelle clé publique Supabase exacte et consigner le résultat sans la stocker dans le dépôt.

## Produit

- [x] Construire le dashboard avec statistiques, activité, charge et aperçu calendrier.
- [x] Construire le calendrier semaine avec création, édition et affichage d’événements ; les vues jour/mois/Gantt restent à étendre.
- [x] Ajouter une vue hebdomadaire synthétique et une vue mensuelle avec tâches positionnées par date.
- [x] Ajouter les rappels de tâches, leur persistance et les notifications in-app associées.
- [x] Construire les tâches avec tags, priorité, responsable et historique visuel ; checklist et commentaires persistants restent à étendre.
- [x] Ajouter des filtres combinables par date et priorité dans la vue des tâches.
- [x] Construire les vues planning, liste, projets, inbox et chat ; Kanban/Gantt interactifs restent à étendre.
- [x] Construire le centre de notifications in-app et préparer Realtime.
- [x] Construire le chat global, privé et par projet en interface ; persistance des messages à brancher après migration.
- [x] Brancher les options du chat : recherche, ajout de conversation, menu d’actions et persistance des messages.
- [x] Ajouter l’espace administration et le contrôle des rôles en interface ; édition des rôles à brancher côté Supabase.
- [x] Permettre la création et l’édition d’une tâche avec date, heure de début, heure de fin et durée calculée.
- [x] Afficher toutes les tâches datées dans le calendrier à partir du même modèle de données que la liste.
- [x] Ajouter le drag & drop des tâches dans le calendrier et le redimensionnement par poignées de durée.
- [x] Remplacer l’identité visuelle et les textes BTL Planner par ME Planner — Mon Essentiel.
- [x] Intégrer le logo Mon Essentiel fourni dans l’interface et la documentation visuelle.

## Qualité et livraison

- [ ] Ajouter raccourcis configurables et navigation clavier complète.
- [x] Vérifier responsive, accessibilité, contrastes, états de chargement et erreurs sur les écrans principaux et l’authentification.
- [x] Ajouter tests unitaires des règles critiques et tests de build/typecheck.
- [x] Rédiger README, documentation utilisateur, documentation développeur et diagrammes Mermaid.
- [x] Fournir les instructions d’initialisation Supabase et les variables d’environnement.
- [ ] Créer un checkpoint final avant remise.
- [x] Ajouter la page Profil avec modification du nom, email, rôle affiché et avatar.
- [x] Persister les informations de profil et l’avatar dans Supabase sans exposer de secret.
- [x] Rendre fonctionnels les dropdowns, le calendrier, le chat, le bouton Équipe et les thèmes.
- [x] Ajouter un arrière-plan animé de type lava-lamp avec respect de reduced motion.
- [x] Générer et intégrer une icône monochrome blanche sans fond.
- [x] Implémenter la traduction persistante des libellés principaux et le sélecteur de langue.
- [x] Corriger les bugs d’affichage persistants sur les vues calendrier, chat et responsive.
- [x] Corriger le contenu résiduel lors du changement d’onglet et réduire le lag des transitions.
- [x] Utiliser l’icône monochrome comme favicon, avec variante blanche en thème sombre et bleue en thème clair.
- [x] Reproduire puis corriger les vues d’ensemble et Mes tâches qui s’affichent vides.
- [x] Corriger le montage/démontage des onglets pour qu’aucune navigation ne laisse le workspace vide.
- [x] Réparer la vue mensuelle du calendrier et ses états sans données.
- [x] Capturer l’erreur runtime exacte déclenchée au changement d’onglet.
- [x] Supprimer la cause du blocage et garantir un fallback de rendu par vue.
- [x] Tester la navigation complète après redémarrage du serveur.
- [x] Ajouter une vue journalière dédiée avec navigation de date et tâches positionnées par heure.
- [x] Étendre la vue mensuelle avec déplacement des tâches entre les jours.
- [x] Ajouter une vue annuelle synthétique avec navigation par mois et accès au détail mensuel.
- [x] Persister le drag-and-drop des tâches dans les vues journalière, mensuelle et annuelle lorsque pertinent.
- [x] Ajouter un skeleton loading accessible et sans écran vide lors des transitions d’onglets.
- [x] Vérifier les vues calendrier sur desktop et mobile avec tests de typecheck, tests unitaires et build.
- [x] Ajouter un filtre multi-agents avec sélection simultanée et actions Tout sélectionner / Tout désélectionner.
- [x] Partager la sélection d’agents entre calendrier, tâches et projets.
- [x] Réserver l’espace de pilotage détaillé aux administrateurs et afficher un état d’accès explicite aux autres rôles.
- [x] Ajouter une vue d’évolution des tâches de tous les agents avec progression, charge et tâches à risque.
- [x] Ajouter les indicateurs d’avancement par projet et par agent avec repères visuels cohérents.
- [x] Vérifier les filtres multi-agents, les droits, le responsive, les tests et le build.
- [x] Normaliser les z-index et stacking contexts de tous les menus, modales et overlays temporels.
- [x] Garantir que la topbar reste sticky au-dessus du contenu et des cartes du workspace.
- [x] Rendre le bouton Inviter fonctionnel avec modal, validation et retour utilisateur.
- [x] Désactiver les raccourcis globaux pendant la saisie dans le chat et les champs texte.
- [x] Ajouter la configuration des raccourcis clavier dans les paramètres avec persistance locale.
- [x] Vérifier les overlays sur mobile, desktop, avec menus ouverts et topbar sticky.
- [x] Diagnostiquer le blocage actuel du chargement de l’application.
- [x] Isoler la régression introduite par le dernier correctif.
- [x] Rétablir le chargement sans perdre les fonctionnalités précédentes.
- [x] Revalider serveur, typecheck, tests et build après résolution.
- [x] Auditer les fichiers à inclure et exclure du livrable GitHub.
- [x] Ajouter ou compléter la documentation d’installation, Supabase et variables d’environnement.
- [x] Préparer les fichiers GitHub et vérifier le build de production.
- [x] Produire et inspecter le ZIP final avec une procédure d’installation reproductible.
- [x] Adapter le build Vite au sous-chemin réel du dépôt GitHub Pages.
- [x] Ajouter la configuration de routage et de fallback pour GitHub Pages.
- [x] Ajouter un workflow GitHub Actions de déploiement Pages.
- [x] Tester le build statique dans un sous-chemin et régénérer le ZIP Pages.
