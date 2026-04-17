# Agent 5 — Fix & Regeneration Agent

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Documentation SCAF | `SCAF_DOC.md` |
| Configs à corriger | `app_configs/` |
| Script orchestrateur | `run-orchestrator.sh` |
| Route de test | `src/app/api/test-endpoints/route.ts` |
| Agent 2 (règles génération) | `claude/agent-2-scaf-config-generator.md` |
| Agent 4 (règles tests) | `claude/agent-4-endpoint-testing.md` |

---

## Responsabilité

Analyser les erreurs issues des tests (Agent 4), corriger `app_configs/`, relancer l'orchestrateur et les tests jusqu'à obtention de `ok: true` sur tous les endpoints.

---

## Actions obligatoires

### 1. Analyser le rapport de l'Agent 4

Catégoriser chaque erreur :

| Type d'erreur | Cause probable | Fichier à corriger |
|---------------|---------------|--------------------|
| `Method not implemented.` (YAML a `$implementationInDataSource`) | `$rewriteInDataSourceImpl: true` dans feature **root.yml** → SCAF fait un full rewrite via template qui ignore `$implementationInDataSource`. Fix : passer à `false` dans `features/<feature>/root.yml` | `features/<feature>/root.yml` |
| `Method not implemented.` (YAML sans `$implementationInDataSource`) | `$implementationInDataSource` manquant dans le usecase YAML | `usecases/<usecase>.yml` |
| Champ manquant dans la réponse | `$optional: false` sur un champ absent | endpoint YAML `$response` |
| Type incorrect | `$type: number` au lieu de `$type: string` | endpoint YAML ou type YAML |
| Champ inconnu reçu | Nouveau champ non documenté | Ajouter dans `$response.$schema` |
| Erreur HTTP 401 | `$auth: true` mais token absent | Vérifier intercepteur |
| Erreur de mapping | `$implementationInDataSource.$mapping` incorrect | usecase YAML |
| Enum non reconnue | Valeur manquante dans `$values` | module/feature root.yml `$enums` |
| Controller inexistant | `featuresDi` pas mis à jour | `src/di/features_di.ts` |

### 1b. Vérification systématique des stubs

Avant d'analyser les erreurs de l'Agent 4, scanner tous les datasources du module :

```bash
grep -rn "Method not implemented" src/modules/<module>/
```

Pour chaque stub trouvé :
1. Identifier le usecase YAML correspondant
2. Vérifier que `$implementationInDataSource` est présent — si non, l'ajouter
3. Vérifier que `$endpoint` pointe vers une clé existante dans `src/shared/constants/routes/`
4. Vérifier que `$mapping.$path` contient tous les `{params}` du path
5. Vérifier que `$mapping.$body` est présent si la méthode est POST/PUT/PATCH

### 2. Appliquer les corrections dans app_configs/

- Corriger **uniquement** les fichiers `app_configs/` concernés
- Respecter strictement les règles SCAF (voir `claude/agent-2-scaf-config-generator.md`)
- Ne jamais modifier directement les fichiers `src/` générés
- Documenter chaque correction effectuée

### 3. Relancer l'orchestrateur

```bash
bash run-orchestrator.sh
```

### 4. Relancer les tests (Agent 4)

Répéter les étapes 1→4 jusqu'à ce que tous les endpoints retournent `ok: true` avec une structure conforme.

---

## Cycle itératif

```
Rapport Agent 4
      ↓
Identifier erreurs
      ↓
Corriger app_configs/
      ↓
bash run-orchestrator.sh
      ↓
Relancer tests
      ↓
Tous ok ? → Oui → Passer à Agent 6
           → Non → Recommencer
```

---

## Règles

- Ne jamais modifier `app_configs/modules/auth/` ou `app_configs/modules/user/` (déjà validés)
- Ne jamais modifier directement `src/` — les corrections sont uniquement dans `app_configs/`
- Maximum 3 cycles sans progrès → escalader avec un rapport détaillé et demander clarification
- Documenter chaque itération : ce qui a été corrigé et pourquoi
