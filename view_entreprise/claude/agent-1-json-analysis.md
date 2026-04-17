# Agent 1 — JSON Analysis Agent

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Collections Postman | `colection_json/` |
| Documentation SCAF | `SCAF_DOC.md` |
| Prompt de génération | `SCAF_DOC_PROMPT.md` |
| Configs existantes (référence) | `app_configs/` |

---

## Responsabilité

Analyser exhaustivement la collection JSON fournie et produire un résumé structuré exploitable par l'Agent 2.

---

## Actions obligatoires

### 1. Parcours complet de la collection

- Lire chaque endpoint sans exception
- Identifier pour chacun :
  - Méthode HTTP (`GET`, `POST`, `PATCH`, `DELETE`…)
  - Path complet avec path params `{id}`
  - Query params (filtres, pagination…)
  - Body (champs, types, obligatoire/optionnel)
  - Structure de réponse succès (200/201)
  - Structures d'erreur (`400`, `401`, `403`, `404`…)

### 2. Identification des groupes fonctionnels

- Regrouper les endpoints par logique métier → futurs **modules** et **features**
- Un groupe d'endpoints API = potentiellement un module ou une feature
- Plusieurs groupes peuvent coexister dans un seul module sous forme de features distinctes

### 2b. Extraction des données de mapping (obligatoire pour Agent 2)

Pour chaque endpoint, noter explicitement :
- **Path params** : `{area_id}`, `{table_id}` → seront les `$mapping.$path` dans les usecases
- **Query params** : `is_active`, `search`, `ordering` → seront les `$mapping.$query`
- **Body fields** : `name`, `capacity`, `area_type` → seront les `$mapping.$body`
- **Méthode HTTP** : détermine si `$body` est présent (POST/PUT/PATCH) ou absent (GET/DELETE)

> Ces infos servent directement à remplir `$implementationInDataSource.$mapping` dans les usecases YAML — sans elles, Agent 2 ne peut pas générer des datasources fonctionnels.

### 3. Détection des enums implicites

Chercher partout :
- Statuts (ex: `ACTIVE`, `SUSPENDED`, `DELETED`)
- Types (ex: `INDIVIDUAL`, `GROUP`)
- Catégories, rôles, genres
- Toute valeur qui ne prend qu'un ensemble limité de valeurs

> ⚠️ Ne jamais inventer de valeurs. Seules les valeurs explicitement documentées dans la collection sont valides.

### 4. Identification des types réutilisables

- Objets imbriqués qui apparaissent dans plusieurs endpoints
- Structures de réponse partagées
- Payloads communs à plusieurs actions

### 5. Identification des endpoints à exclure

Marquer comme **hors scope** (ne pas scaffolder) :
- Endpoints `Interne ⚠️` (inter-services, non consommés par le frontend)
- Endpoints du Saga Pattern (appelés uniquement par d'autres services)
- Endpoints de health check (`/health/`)

---

## Output attendu

Produire un rapport structuré contenant :

```
MODULES DÉTECTÉS :
  - <module_name> :
    - Features : [<feature1>, <feature2>…]
    - Endpoints couverts : [liste]

ENUMS DÉTECTÉS :
  - <EnumName> : [VALEUR1, VALEUR2…] — source : <endpoint ou description>

TYPES RÉUTILISABLES DÉTECTÉS :
  - <TypeName> : { champ1: type, champ2: type… }

ENDPOINTS EXCLUS (hors scope) :
  - [METHOD] /path/ — raison

QUESTIONS / AMBIGUÏTÉS :
  - Liste des points nécessitant clarification avant génération
```

---

## Règles

- Ne jamais inventer une valeur ou une structure
- Si une information est ambiguë → la signaler dans "QUESTIONS / AMBIGUÏTÉS"
- Se baser sur les modules `auth` et `user` existants dans `app_configs/` pour comprendre le niveau de découpage attendu
- Lire `SCAF_DOC_PROMPT.md` pour la méthodologie d'analyse obligatoire
- **Lire `SCAF_DOC.md` en entier** avant d'analyser — pour comprendre exactement ce dont Agent 2 a besoin (notamment les informations de mapping pour `$implementationInDataSource`)
- Le rapport doit être assez détaillé pour qu'Agent 2 puisse remplir `$implementationInDataSource.$mapping` sans ambiguïté
