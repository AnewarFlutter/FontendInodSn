# Agent 4 — Endpoint Testing Agent

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Route de test existante | `src/app/api/test-endpoints/route.ts` |
| DI centralisé | `src/di/features_di.ts` |
| Collections Postman | `colection_json/` |
| Modules existants (modèle) | `src/modules/` |

---

## Responsabilité

Tester réellement les endpoints générés via la route API de test et analyser les résultats en profondeur.

---

## Credentials de test (environnement local)

| Champ | Valeur |
|-------|--------|
| Email | `admin@admin.com` |
| Mot de passe | `passer123` |
| Contexte | `ADMIN` |

> Ces credentials sont utilisés **uniquement en local** pour obtenir un token d'accès valide avant de tester les endpoints protégés.

---

## Actions obligatoires

### 0. Authentification préalable (obligatoire)

Avant tout test, s'assurer qu'un token valide est présent dans les cookies de session.

Si les tests retournent des erreurs `401 Unauthorized`, déclencher une authentification via l'action login :

```typescript
// Dans route.ts — authentification préalable si besoin
import { loginAction } from "@/actions/auth/session/session_actions";

// S'assurer qu'une session est active
const loginResult = await loginAction({
  identifier_type: "email",
  identifier: "admin@admin.com",
  password: "passer123",
  context: "ADMIN",
});

if (!loginResult.success) {
  return NextResponse.json({ error: "Auth failed", detail: loginResult.message }, { status: 401 });
}
```

> ⚠️ Ne lancer le login que si la session est absente ou expirée — ne pas re-login à chaque test.

### 1. Lire la route de test existante

Lire `src/app/api/test-endpoints/route.ts` pour comprendre le pattern existant.

Pattern utilisé :
```typescript
try {
  const result = await featuresDi.<controller>.<method>(params);
  results["GET /path/"] = { ok: true, data: result };
} catch (e) {
  results["GET /path/"] = { ok: false, error: String(e) };
}
```

### 2. Tester TOUS les endpoints (GET + mutations)

Tester l'intégralité des endpoints du module — pas uniquement les GET.

**Ordre obligatoire pour éviter les dépendances :**
1. GETs de liste (lire l'état initial)
2. POST de création (créer les données de test)
3. GETs de détail (vérifier la création)
4. PUT/PATCH (modifier)
5. Actions métier (activate, deactivate, reorder…)
6. DELETE en dernier (supprimer)

> ⚠️ **Ne pas nettoyer les données de test** — les laisser persister pour traçabilité.

**Unicité des données de test :**
Utiliser un suffix timestamp pour éviter les conflits de contrainte unique :
```typescript
const ts = Date.now();
const testName = `Test Zone ${ts}`;
```

**Pattern pour les mutations :**
```typescript
// ── POST /config/areas/ ───────────────────────────────────────
let createdAreaId: string | null = null;
try {
  const data = await featuresDi.areaManagementController.createArea({
    name: `Zone Test ${ts}`,
    area_type: "TABLE",
  });
  createdAreaId = data?.id ?? null;
  results["POST /config/areas/"] = { ok: !!data, data };
} catch (e) {
  results["POST /config/areas/"] = { ok: false, error: String(e) };
}

// ── GET /config/areas/{id}/ ───────────────────────────────────
try {
  if (createdAreaId) {
    const data = await featuresDi.areaManagementController.getAreaDetail(createdAreaId);
    results[`GET /config/areas/${createdAreaId}/`] = { ok: !!data, data };
  }
} catch (e) {
  results[`GET /config/areas/{id}/`] = { ok: false, error: String(e) };
}
```

**Gestion des 404 non implémentés backend :**
Si un endpoint retourne 404 avec body null → le marquer `SKIP (non implémenté backend)` et continuer.

### 3. Vérifier que featuresDi exporte bien le nouveau controller

Lire `src/di/features_di.ts` et confirmer la présence du nouveau controller.

### 4. Analyser les résultats

Après exécution de `GET http://localhost:3000/api/test-endpoints`, analyser chaque entrée :

**Si `ok: true` :**
- Vérifier que la structure `data` correspond aux types définis dans `app_configs/`
- Vérifier que tous les champs attendus sont présents
- Vérifier les types (string, number, boolean, array, object)
- Noter les champs présents dans la réponse réelle mais absents des types → à corriger dans `app_configs/`
- Noter les champs définis dans les types mais absents de la réponse → marquer `$optional: true`

**Si `ok: false` :**
- Analyser le message d'erreur
- Identifier la couche en cause (datasource, repository, usecase, controller, DI)
- Produire un rapport d'erreur précis pour l'Agent 5

### 5. Rapport de tests

```
RÉSULTATS DES TESTS :

✅ GET /path/            → ok, structure conforme
⚠️  GET /path2/          → ok mais champ "xxx" absent des types → correction needed
❌ GET /path3/           → error: "..." → couche: datasource → action: [description fix]

CORRECTIONS NÉCESSAIRES DANS app_configs/ :
  - <fichier>.yml ligne X : <description de la correction>
```

---

## Règles

- Ne jamais modifier les fichiers `src/` générés directement — les corrections passent par `app_configs/` puis re-génération (Agent 5)
- Ne tester que les endpoints GET automatiquement
- Conserver tous les tests existants dans `route.ts` — ne pas supprimer les blocs précédents
