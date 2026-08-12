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
pnpm start
```

Le dossier `dist/` est régénérable et volontairement exclu de Git. Le workflow GitHub Actions reproduit automatiquement ces vérifications à chaque push ou pull request.
