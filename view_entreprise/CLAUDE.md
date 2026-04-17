# CLAUDE.md — Hello Restauration Admin

> Fichier de comportement principal. Toujours prioritaire.
> Les instructions détaillées de chaque agent sont dans le dossier `claude/`.

---

## Références clés du projet

| Ressource | Chemin |
|-----------|--------|
| Documentation SCAF complète | `SCAF_DOC.md` |
| Prompt de génération SCAF | `SCAF_DOC_PROMPT.md` |
| Configurations app_configs | `app_configs/` |
| Collections Postman | `colection_json/` |
| Route de test endpoints | `src/app/api/test-endpoints/route.ts` |
| Script orchestrateur | `run-orchestrator.sh` |
| Instructions agents | `claude/` |
| Mémoire des sessions | `claude/memory/` |

## Mémoire

À chaque début de session, lire les fichiers dans `claude/memory/` (ordre chronologique, du plus récent au plus ancien) pour reconstituer le contexte.

À chaque fin de session significative, créer un fichier `claude/memory/YYYY-MM-DD-nom-descriptif.md` résumant ce qui a été fait, les décisions prises et les points d'attention.

---

## Stack

Next.js 16 App Router · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui · Zustand 5 · Axios · next-intl · Zod + React Hook Form

---

## Règle absolue — UI INTERDITE sans autorisation explicite

Ne jamais créer, modifier ou générer :
- Pages `src/app/[locale]/(pages)/**`
- Composants `src/components/**`
- Tout fichier `.tsx` lié à l'affichage

S'applique à tous les agents, toutes les étapes. Attendre une autorisation explicite.

---

## Workflow multi-agents (sur fourniture d'une collection JSON)

Exécuter séquentiellement. Chaque agent valide son output avant de passer au suivant.

| Agent | Fichier | Rôle |
|-------|---------|------|
| 1 | `claude/agent-1-json-analysis.md` | Analyse complète de la collection JSON |
| 2 | `claude/agent-2-scaf-config-generator.md` | Génération de `app_configs/` |
| 3 | `claude/agent-3-orchestrator.md` | Exécution `run-orchestrator.sh` |
| 4 | `claude/agent-4-endpoint-testing.md` | Tests réels des endpoints |
| 5 | `claude/agent-5-fix-regeneration.md` | Correction itérative |
| 6 | `claude/agent-6-architecture-validation.md` | Validation conformité architecture |
| 7 | `claude/agent-7-completion.md` | Complétion actions/contexts/wrappers |
| 8 | `claude/agent-8-ui-integration.md` | Intégration UI : layout + pages + composants |

---

## État des modules

| Module | Skip | État |
|--------|------|------|
| `auth` | `true` | ✅ Généré et validé |
| `user` | `true` | ✅ Généré et validé |
| `config/area_management` | `true` | ✅ Généré, validé et intégré UI |
| `config/table_management` | `true` | ✅ Généré, validé et intégré UI |
| `config/kitchen_management` | `true` | ✅ Généré, datasource fixé, actions/context/wrapper créés |
| `config/ingredient_type_management` | `true` | ✅ Généré, datasource fixé, actions/context/wrapper créés |
