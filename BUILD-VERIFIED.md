# État du build

Le livrable ME Planner a été vérifié avec Node.js 22 et pnpm 10 :

```text
pnpm check  → OK
pnpm test   → 9 tests passés
pnpm build  → OK
```

Après extraction, exécutez :

```bash
pnpm install
pnpm dev
```

Pour vérifier le serveur de production local :

```bash
pnpm build
pnpm build
```

Pour simuler le bundle GitHub Pages du dépôt actuel :

```bash
VITE_BASE_PATH=/BTL-Planner/ pnpm build:pages
```

Le dossier `dist/public/` contient alors l’index et tous les assets avec le préfixe `/BTL-Planner/`. Le workflow GitHub Actions reproduit automatiquement cette configuration à chaque push sur `main`. Les dossiers `dist/` et `node_modules/` sont régénérables et volontairement exclus de Git.
