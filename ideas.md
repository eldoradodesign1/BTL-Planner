# ME Planner — Mon Essentiel — Direction produit et design

## Approches envisagées

### Theme Name: Aquarelle de contrôle
Very Brief Intro: Un espace de planification calme et dense, construit comme une interface de cockpit adoucie par des surfaces translucides, des bleus d’eau et des transitions feutrées.
Probability: 0.06

### Theme Name: Atelier papier numérique
Very Brief Intro: Une organisation de tâches inspirée des carnets de studio, avec des surfaces ivoire, des repères typographiques éditoriaux et une sensation de matière imprimée.
Probability: 0.03

### Theme Name: Orbite nocturne
Very Brief Intro: Un centre opérationnel sombre aux accents cyan, où les projets se déplacent comme des trajectoires dans un espace silencieux et précis.
Probability: 0.08

## Direction retenue — Aquarelle de contrôle

### Design Movement
Soft UI / Liquid Glass, inspiré des interfaces iOS récentes, du spatial computing et des logiciels de productivité calmes plutôt que des dashboards technologiques agressifs.

### Core Principles
1. **Clarté par couches** : la hiérarchie vient de la profondeur, du flou et de l’opacité, jamais d’un empilement de bordures.
2. **Densité respirable** : le calendrier reste dense mais chaque niveau d’information dispose d’un espace de respiration et d’un rythme typographique propre.
3. **Mouvement rassurant** : les actions utilisent des transitions courtes, souples et prévisibles ; aucune animation ne doit distraire de la planification.
4. **Contrôle immédiat** : les raccourcis, la recherche et les actions contextuelles rendent chaque opération accessible sans quitter le flux de travail.

### Color Philosophy
La base est un bleu nuit presque graphite, suffisamment neutre pour porter de longues sessions de travail. Le cyan `#69D2FF` sert de signal de progression et de lien, tandis que les accents menthe et lavande distinguent les états sans recourir à des alertes criardes. Les surfaces translucides sont légèrement bleutées pour produire une profondeur de verre sans devenir décoratives.

### Layout Paradigm
Une **colonne de navigation persistante** structure l’application à gauche, un **ruban contextuel** resserre les filtres et les vues au-dessus du workspace, puis le calendrier occupe la place centrale. Les actions secondaires vivent dans des panneaux latéraux ou des popovers ancrés à leur source. Sur mobile, les rails deviennent des tiroirs et la vue prioritaire reste le planning du jour.

### Signature Elements
1. Des halos aquatiques très discrets en arrière-plan, dont le mouvement est lent et interrompu lorsque `prefers-reduced-motion` est actif.
2. Une ligne de temps cyan, fine et lumineuse, qui accompagne la date active et les tâches en cours.
3. Des pastilles d’état translucides avec une micro-lueur colorée, plutôt que des badges opaques.

### Interaction Philosophy
Chaque interaction confirme l’intention : une pression réduit légèrement le bouton, un déplacement laisse une trace de destination, une tâche terminée se replie avec une transition de confiance, et les raccourcis clavier ouvrent directement l’action sans animation superflue. Les contrôles ne doivent jamais être seulement décoratifs.

### Animation
Les entrées utilisent `opacity + translateY` sur 180–240 ms ; les panneaux utilisent une montée douce depuis leur point d’ancrage ; les cartes de synthèse utilisent un léger `scale` de 0,985 à 1. Les déplacements de tâches privilégient un spring discret. Les animations sont désactivées ou réduites sous `prefers-reduced-motion`. Les raccourcis clavier et la recherche restent instantanés.

### Typography System
Le titrage utilise **Space Grotesk** en 600–700 pour une géométrie nette, tandis que le texte courant utilise **DM Sans** en 400–600 pour la lisibilité. Les dates et métriques sont en Space Grotesk avec un tracking légèrement resserré. Les libellés secondaires sont en DM Sans avec une opacité réduite plutôt qu’une taille illisible.

### Brand Essence
**ME Planner est le centre de gravité calme des équipes qui doivent transformer des engagements dispersés en une journée maîtrisée.**

Personality adjectives: précis, apaisant, attentif.

### Brand Voice
Les titres sont directs et orientés action. Les CTA décrivent le résultat concret. Les microcopies rassurent sans infantiliser et évitent les formulations génériques.

Exemples :

> « Reprenez la main sur les prochaines heures. »

> « Planifier une tâche, sans perdre le fil. »

### Wordmark & Logo
Le symbole fourni de Mon Essentiel est une forme abstraite en rubans aquatiques qui évoque une trajectoire, une respiration et un essentiel qui se dégage. Il est utilisé comme repère d’application, favicon et signature visuelle ; le nom ME Planner accompagne le symbole avec un mot-symbole court et lisible.

### Signature Brand Color
`#69D2FF` — un cyan d’eau claire, assez lumineux pour signaler l’action tout en restant doux sur le bleu nuit.

## Architecture cible

Le scaffold initial est React 19 + Vite + Tailwind 4 + shadcn/ui. La première livraison établit une expérience frontend fonctionnelle avec un modèle de données typé et une couche d’accès Supabase isolée. La persistance réelle sera activée via `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`, sans jamais exposer de clé service-role dans le navigateur. Les migrations SQL, les policies RLS et la documentation seront versionnées dans `supabase/` pour pouvoir être appliquées dans un projet Supabase réel.

L’interface initiale est organisée autour d’un shell de planning, du dashboard, du calendrier et de la gestion des tâches. Les modules chat, notifications temps réel, stockage et administration sont préparés par des contrats partagés et seront branchés progressivement ; aucune action non implémentée ne sera présentée comme disponible.

## Décisions de style

- Utiliser un fond bleu nuit doux comme état de travail par défaut, avec un mode clair et deux thèmes alternatifs pilotés par variables CSS.
- Utiliser Space Grotesk + DM Sans, pas Inter.
- Privilégier les surfaces translucides et les ombres diffuses aux bordures omniprésentes.
- Garder les halos et gradients assez faibles pour préserver les contrastes et la lisibilité.
- Réserver les animations riches aux transitions de panneaux, au drag & drop et aux feedbacks d’action.

## Style Decisions

- Le cockpit expose en permanence trois repères : rail de navigation, ruban contextuel et workspace de planification.
- Le symbole à trois rubans et le mot-symbole Space Grotesk sont visibles dans la navigation primaire ; le nom ne repose jamais uniquement sur un breadcrumb.
- Les surfaces principales restent bleutées, translucides et légèrement superposées ; les surfaces opaques sont réservées aux modals et aux informations très secondaires.
- La ligne cyan et le ruban de planification sont des motifs structurels récurrents, pas de simples accents décoratifs.
