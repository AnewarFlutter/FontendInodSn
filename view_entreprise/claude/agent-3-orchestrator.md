# Agent 3 — Orchestrator Agent

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Script d'exécution | `run-orchestrator.sh` |
| Scripts TS orchestrateur | `orchestration_scripts/` |
| Config app principale | `app_configs/app.yml` |
| Configs générées par Agent 2 | `app_configs/` |

---

## Responsabilité

Exécuter le scaffolding via `run-orchestrator.sh` et fournir un rapport complet des fichiers générés.

---

## Actions obligatoires

### 1. Vérification pré-exécution

Avant de lancer le script, vérifier :
- Que les fichiers `app_configs/` générés par l'Agent 2 sont bien présents
- Que `app_configs/app.yml` référence les nouveaux modules via `$include`
- Que `app_configs/apis/root_v1.yml` référence les nouveaux endpoints via `$include`
- Que tous les `$skip` des nouveaux fichiers sont à `false`

### 2. Exécution

```bash
bash run-orchestrator.sh
```

Ce script effectue dans l'ordre :
1. `rm -rf orchestration_scripts/dist` — nettoyage
2. `npx tsc orchestration_scripts/*.ts --outDir orchestration_scripts/dist ...` — compilation TS
3. `node orchestration_scripts/dist/orchestrator.js app_configs/app.yml` — génération

### 3. Vérification post-exécution

Après exécution, vérifier l'absence d'erreurs :
- Erreurs de compilation TypeScript → les signaler
- Erreurs d'exécution de l'orchestrateur → les signaler
- Fichiers manquants dans `src/` → les signaler

### 3b. Vérification anti-stubs (OBLIGATOIRE)

Après génération, scanner tous les fichiers `rest_api_*_data_source_impl.ts` générés :

```bash
grep -r "Method not implemented" src/modules/<nouveau_module>/
```

**Si des stubs sont trouvés :**
- ❌ Ne pas passer à Agent 4
- Identifier les usecases concernés dans `app_configs/`
- Signaler précisément : `<feature>/usecases/<usecase>.yml` manque `$implementationInDataSource`
- Passer directement à Agent 5 pour correction

**Si aucun stub :**
- ✅ Continuer vers Agent 4

### 4. Rapport des fichiers générés

Lister tous les fichiers créés/modifiés dans `src/`, organisés par couche :

```
FICHIERS GÉNÉRÉS :

src/modules/<module>/<feature>/
  ├── domain/
  │   ├── entities/         → [liste fichiers]
  │   ├── enums/            → [liste fichiers]
  │   ├── repositories/     → [liste fichiers]
  │   ├── types/            → [liste fichiers]
  │   └── usecases/         → [liste fichiers]
  └── data/
      ├── datasources/      → [liste fichiers]
      ├── models/           → [liste fichiers]
      └── repositories/     → [liste fichiers]

src/adapters/<module>/<feature>/
  └── <feature>_controller.ts

src/di/
  └── <feature>_di.ts (+ features_di.ts mis à jour)
```

---

## En cas d'erreur

- Ne jamais passer à l'Agent 4 si l'orchestrateur a échoué
- Signaler l'erreur précisément (ligne, message)
- Passer à l'Agent 5 (Fix & Regeneration) directement
