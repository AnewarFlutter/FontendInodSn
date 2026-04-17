# Agent 6 — Architecture Validation Agent

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Module auth (référence complète) | `src/modules/auth/` |
| Module user (référence complète) | `src/modules/user/` |
| Adapters existants | `src/adapters/` |
| DI existant | `src/di/` |
| Actions existantes | `src/actions/` |
| Contexts existants | `src/contexts/` |
| Context wrappers existants | `src/context_wrappers/` |

---

## Responsabilité

Vérifier que TOUS les fichiers générés sont conformes à l'architecture globale. Aucune couche manquante, aucune incohérence.

---

## Checklist de validation par feature

Pour chaque nouvelle feature générée, vérifier la présence et la conformité de :

### Couche Domain

- [ ] `domain/entities/` — entités métier (si applicable)
- [ ] `domain/enums/` — enums de la feature (si applicable)
- [ ] `domain/repositories/<feature>_repository.ts` — **interface** du repository
- [ ] `domain/types/` — payloads et types de retour
- [ ] `domain/usecases/<action>_use_case.ts` — un fichier par usecase
- [ ] `domain/mocks/` — mocks de test (si applicable)

### Couche Data

- [ ] `data/datasources/<feature>_data_source.ts` — **interface** datasource
- [ ] `data/datasources/rest_api_<feature>_data_source_impl.ts` — implémentation REST
- [ ] `data/models/` — modèles de mapping (si applicable)
- [ ] `data/repositories/<feature>_repository_impl.ts` — implémentation repository

### Couche Adapter

- [ ] `src/adapters/<module>/<feature>/<feature>_controller.ts`

### Couche DI

- [ ] `src/di/<feature>_di.ts` — instanciation DataSource → Repository → UseCases → Controller
- [ ] `src/di/features_di.ts` — export du nouveau controller dans `featuresDi`

### Couche Actions

- [ ] `src/actions/<module>/<feature>/<feature>_actions.ts` — Server Actions `"use server"` (vérifié par Agent 7)

---

## Vérification anti-stubs (OBLIGATOIRE — avant toute autre vérification)

Scanner chaque fichier `rest_api_*_data_source_impl.ts` généré :

```bash
grep -rn "Method not implemented" src/modules/<nouveau_module>/
```

**Si des stubs sont trouvés :**
- ❌ **ARRÊT IMMÉDIAT** — ne pas passer à Agent 7
- Identifier précisément : `<feature>/usecases/<usecase>.yml` manque `$implementationInDataSource`
- Rapport d'erreur immédiat :
  ```
  ❌ STUB DÉTECTÉ : src/modules/<module>/<feature>/data/datasources/rest_api_<feature>_data_source_impl.ts
     Méthode(s) concernée(s) : <methodName>
     Cause : $implementationInDataSource absent dans app_configs/modules/<module>/features/<feature>/usecases/<usecase>.yml
     Action : Retourner à Agent 5 pour correction AVANT de continuer
  ```
- **Renvoyer à Agent 5** — jamais contourner en écrivant directement dans `src/`

**Si aucun stub :**
- ✅ Continuer avec le reste de la checklist

---

## Vérifications transversales

### 1. Cohérence des imports

- Vérifier que chaque fichier importe depuis les bons chemins (`@/modules/...`, `@/lib/api/...`)
- Vérifier qu'aucun import ne pointe vers un fichier inexistant

### 2. Cohérence des types

- Les types utilisés dans les usecases correspondent aux types définis dans `domain/types/`
- Les types de retour des controllers correspondent aux types de retour des usecases
- Les types dans les datasources correspondent aux schémas de réponse API

### 3. Cohérence DI

- `featuresDi` exporte bien le nouveau controller avec le bon nom
- Le fichier `<feature>_di.ts` instancie dans le bon ordre : DataSource → Repository → UseCases → Controller

### 4. Comparaison avec les modules de référence

Comparer la structure du nouveau module avec :
- `src/modules/user/user_management/` — pour les features avec beaucoup d'usecases
- `src/modules/user/my_profile/` — pour les features de profil
- `src/modules/user/rbac/` — pour les features de listes simples
- `src/modules/auth/session/` — pour les features d'authentification

---

## Rapport de validation

```
VALIDATION ARCHITECTURE — Module <nom>

✅ domain/repositories/<feature>_repository.ts       → présent et conforme
✅ data/datasources/rest_api_<feature>_ds_impl.ts    → présent et conforme
✅ src/adapters/<module>/<feature>_controller.ts     → présent et conforme
✅ src/di/<feature>_di.ts                            → présent et conforme
✅ src/di/features_di.ts                             → controller exporté

⚠️ MANQUANT : src/actions/<module>/<feature>_actions.ts → à créer par Agent 7
⚠️ MANQUANT : src/contexts/<feature>-context.tsx        → à créer par Agent 7 (si applicable)

RÉSULTAT : Passer à Agent 7 pour complétion
```

---

## Règles

- Signaler tout fichier manquant sans le créer — c'est le rôle de l'Agent 7
- Ne pas modifier les fichiers générés
- En cas d'incohérence grave → revenir à l'Agent 5 pour correction via `app_configs/`
