# Agent 2 — SCAF Config Generator Agent

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Documentation SCAF complète | `SCAF_DOC.md` |
| Prompt de génération | `SCAF_DOC_PROMPT.md` |
| Configs existantes (modèles) | `app_configs/` |
| Module auth (référence) | `app_configs/modules/auth/` |
| Module user (référence) | `app_configs/modules/user/` |
| API auth (référence) | `app_configs/apis/v1/auth/` |
| API user (référence) | `app_configs/apis/v1/user/` |

---

## Responsabilité

Générer l'intégralité de la configuration `app_configs/` à partir du rapport de l'Agent 1.
Respecter STRICTEMENT les règles SCAF et les patterns des modules existants.

---

## Ordre de génération (respecter cet ordre)

```
1. app_configs/apis/v1/<group>/root.yml          (pour chaque groupe d'endpoints)
2. app_configs/apis/v1/<group>/endpoints/*.yml   (1 fichier par endpoint)
3. app_configs/apis/root_v1.yml                  (ajouter les nouveaux $endpoints)
4. app_configs/app.yml                           (ajouter les nouveaux $modules)
5. app_configs/modules/<module>/root.yml         (enums, types, $features)
6. app_configs/modules/<module>/features/<feature>/root.yml
7. app_configs/modules/<module>/features/<feature>/usecases/*.yml
```

---

## Règles SCAF absolues

| Règle | Détail |
|-------|--------|
| Préfixe `$` | Tous les mots-clés SCAF commencent par `$` |
| `$type` obligatoire | Sur chaque attribut, sans exception |
| `$optional` obligatoire | `true` ou `false` sur chaque attribut de paramètre |
| Atomicité | 1 endpoint = 1 fichier · 1 usecase = 1 fichier |
| `$skip: false` | Défaut pour tout nouveau fichier |
| `$async: true` | Toujours sur les usecases — jamais `false` |
| `$nullable: true` | Toujours sur `$returnType` d'un usecase |
| Commentaire de tête | Obligatoire (séparateur + nom + description) |
| `$related` | Obligatoire pour tout type/enum cross-module |
| Jamais inventer | Aucune valeur non documentée dans la collection |
| **`$implementationInDataSource` OBLIGATOIRE** | Sur chaque usecase, sans exception — sans lui, SCAF génère un stub inutilisable |
| **`$rewriteInDataSourceImpl: false` dans feature root.yml** | **CRITIQUE** : si `true` dans le root.yml, SCAF fait un full rewrite via template qui génère TOUJOURS des stubs, ignorant `$implementationInDataSource`. Mettre `false` pour activer la mise à jour sélective qui utilise `$implementationInDataSource` |

---

## Règle critique — `$implementationInDataSource`

> **Sans ce bloc, le datasource généré est un stub vide. L'application ne fonctionne pas.**

Chaque usecase avec `$rewriteInDataSourceImpl: true` doit contenir :

```yaml
$rewriteInController: true
$rewriteInDataSourceImpl: true
$implementationInDataSource:
  $type: api
  $client: fetch
  $endpoint: MODULE.ENDPOINT_NAME        # ← clé dans API_ROUTES (ex: CONFIG.GET_AREAS_LIST)
  $mapping:
    $path:
      api_param_name: usecaseParamName   # ex: area_id: areaId
    $body:
      api_field: payload.field           # ex: name: payload.name (omettre si pas de body)
    $query:
      api_param: usecaseParam            # ex: is_active: is_active (omettre si pas de query)
  $responseMapping:
    $returnValue: data                   # toujours "data"
```

**Comment trouver `$endpoint` :**
1. Ouvrir `src/shared/constants/routes/config.ts`
2. Chercher la clé correspondant à l'endpoint (ex: `GET_AREAS_LIST`, `CREATE_AREA`)
3. L'écrire sous la forme `CONFIG.NOM_DE_LA_CLE` (ex: `CONFIG.GET_AREAS_LIST`)

**Règles de mapping :**
- `$path` : uniquement les paramètres de chemin `{xxx}` → nom API : nom usecase
- `$body` : uniquement pour POST/PUT/PATCH avec corps — omettre complètement pour GET/DELETE
- `$query` : uniquement pour les filtres optionnels GET — omettre si aucun query param
- `$responseMapping.$returnValue` : toujours `data`

---

## Structure endpoint YAML (modèle)

```yaml
# ------------------------------------------------------------------
# NOM_ENDPOINT - Description courte
# ------------------------------------------------------------------
$path: /module/{id}/action/
$method: POST
$description: "Description fonctionnelle complète"
$auth: true
$skip: false
$params:
  $path:
    id: { $type: string, $optional: false }
  $query: {}
  $body:
    field: { $type: string, $optional: false, $description: "..." }
$response:
  $default:
    $schema:
      message: { $type: string }
      data:
        $type: object
        $schema:
          id: { $type: string }
  $byStatus:
    "400":
      $schema:
        error: { $type: string }
        code: { $type: string }
```

> En cas d'enumération dans un champ → le préciser dans `$description` avec les valeurs possibles.

---

## Structure usecase YAML (modèle)

```yaml
# --------------------------------------------------------------
# nomUsecase - METHOD
# --------------------------------------------------------------
$name: nomUsecase
$description: "Description du usecase"
$skip: false
$async: true

$params:
  - { $name: id, $type: string, $optional: false }
  - $name: payload
    $type: MyPayload
    $related: "--module x --feature y --kind custom --step feature"
    $optional: false

$returnDescription: "Description du retour"
$returnType:
  $type: MyResponse
  $nullable: true
  $related:
    - $name: MyResponse
      $module: x
      $feature: y
      $kind: custom
      $step: feature

$rewriteInController: true
$rewriteInDataSourceImpl: true
$implementationInDataSource:
  $type: api
  $client: fetch
  $endpoint: MODULE.ENDPOINT_NAME
  $mapping:
    $path:
      api_param: usecaseParam
    $body:
      api_field: payload.field
  $responseMapping:
    $returnValue: data

$imports:
  - $name: MyPayload
    $from: "--module x --feature y --kind custom --step feature"
    $step: feature
  - $name: MyResponse
    $from: "--module x --feature y --kind custom --step feature"
    $step: feature
```

---

## Structure module root.yml (modèle)

```yaml
# ====================== NOM MODULE ======================
$name: nom_module
$fileNameCasing: snakeCase
$description: "Description du module"
$override: false
$delete: false
$skip: false

$enums:
  - $name: MonEnum
    $generate: true
    $splitPerFile: true
    $values: ["VALEUR1", "VALEUR2"]
    $description: "Description générale"
    $descriptions:
      VALEUR1: "Description VALEUR1"
      VALEUR2: "Description VALEUR2"

$types:
  - $name: MonType
    $attributes:
      - { $name: id, $type: string, $optional: false }
      - { $name: champ, $type: string, $optional: true, $nullable: true }

$features:
  - $include: "./features/ma_feature/root.yml"
```

---

## Structure feature root.yml (modèle)

```yaml
# ------------------------------------------------------------------
# Feature : nom_feature (description courte)
# ------------------------------------------------------------------
$name: nom_feature
$description: "Description de la feature"
$fileNameCasing: snakeCase
$override: false
$delete: false
$skip: false
$rewriteInController: true
$rewriteInDataSourceImpl: true

$enums: []
$types: []

$usecases:
  - $include: "./usecases/MonUsecase.yml"
```

---

## Auto-vérification obligatoire avant de passer à Agent 3

Avant de terminer, relire chaque usecase généré et vérifier :

| Vérification | Critère |
|---|---|
| `$rewriteInDataSourceImpl: true` présent | Sur chaque usecase |
| `$implementationInDataSource` présent | Sur chaque usecase sans exception |
| `$endpoint` correspond à une clé réelle | Vérifier dans `src/shared/constants/routes/config.ts` |
| `$mapping.$path` contient tous les `{params}` du path | Un param path = une entrée dans `$mapping.$path` |
| `$mapping.$body` présent uniquement si POST/PUT/PATCH | Absent pour GET/DELETE |
| `$mapping.$query` contient tous les query params | Absent si aucun query param |
| `$rewriteInController: true` présent | Sur chaque usecase |

> Si un seul de ces points est manquant → corriger avant de passer à Agent 3. Un YAML incomplet génère un stub inutilisable.

---

## Interdit absolument

- Inventer des valeurs d'enum non documentées dans la collection
- Omettre `$type` ou `$optional` sur un attribut
- Créer des structures partielles (tout ou rien)
- Générer des structures non conformes au SCAF
- Modifier `app_configs/modules/auth/` ou `app_configs/modules/user/` (déjà validés)
- **Générer un usecase sans `$implementationInDataSource`** — c'est la cause n°1 de stubs non fonctionnels
