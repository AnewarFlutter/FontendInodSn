# 2026-04-08 — Contexte initial du projet

## Ce qui a été fait cette session

### 1. Prise de connaissance complète du projet
- Architecture Clean Architecture analysée en détail (12 couches, tous les dossiers)
- Stack validée : Next.js 16, React 19, TypeScript 5, Tailwind 4, shadcn/ui, Zustand 5, Axios, next-intl, Zod
- Flux API → Écran documenté de bout en bout

### 2. Lecture des documents de référence
- `SCAF_DOC.md` — documentation complète de la plateforme SCAF (lu intégralement)
- `SCAF_DOC_PROMPT.md` — prompt de génération multi-modules (lu intégralement)
- `run-orchestrator.sh` — script de compilation + exécution de l'orchestrateur

### 3. État des modules existants
- Module `auth` → `$skip: true` — **généré et validé**
  - Feature `session` : Login, Logout, RefreshToken, SwitchContext
  - Enums : LoginContextEnum, IdentifierTypeEnum
  - Types : TokenPair, RolePermissions, CurrentRole, UserProfileData, LoginUserWrapper, LoginResponseData, AuthUserBasic
- Module `user` → `$skip: true` — **généré et validé**
  - Feature `my_profile` : 7 usecases
  - Feature `user_management` : 21 usecases (CRUD + statuts + profils par rôle + rôles/permissions)
  - Feature `rbac` : 3 usecases
  - Feature `stats` : 1 usecase
  - Enums : GenderEnum, UserRoleCodeEnum
  - Types : UserBasic, UserDetail, PaginatedUsers

### 4. Collections Postman de référence
- `colection_json/Auth Service API.postman_collection.json` — auth service
- `colection_json/User Service API.postman_collection.json` — user service
- Endpoints internes/Saga Pattern identifiés et exclus du scaffolding

### 5. Route de test validée
- `src/app/api/test-endpoints/route.ts` — teste 9 endpoints GET via featuresDi
- Pattern : try/catch → `{ ok: true/false, data/error }`

### 6. Fichiers de configuration créés cette session
- `CLAUDE.md` — comportement global + table des agents (racine)
- `claude/agent-1-json-analysis.md`
- `claude/agent-2-scaf-config-generator.md`
- `claude/agent-3-orchestrator.md`
- `claude/agent-4-endpoint-testing.md`
- `claude/agent-5-fix-regeneration.md`
- `claude/agent-6-architecture-validation.md`
- `claude/agent-7-completion.md`
- `claude/memory/README.md`

## Points d'attention pour la prochaine session

- Les prochains modules à générer concernent vraisemblablement les fonctionnalités métier (commandes, inventaire, tables, cuisine…)
- Toujours vérifier `app_configs/app.yml` pour l'état des modules actifs avant de commencer
- La route `src/app/api/test-endpoints/route.ts` devra être mise à jour à chaque nouveau module généré
- Ne jamais toucher aux modules `auth` et `user` dans `app_configs/` — ils sont validés

## Rappel workflow

Sur fourniture d'une nouvelle collection JSON → lancer Agent 1 → 2 → 3 → 4 → 5 (si erreurs) → 6 → 7
UI interdite sans autorisation explicite.
