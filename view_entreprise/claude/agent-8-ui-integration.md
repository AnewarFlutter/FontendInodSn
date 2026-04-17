# Agent 8 — UI Integration Agent

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Contexts créés (Agent 7) | `src/contexts/<feature>-context.tsx` |
| Wrappers créés (Agent 7) | `src/context_wrappers/<feature>_wrapper.tsx` |
| Pages UI autorisées | `src/app/[locale]/(pages)/<feature>/` |
| Index des contextes | `src/contexts/index.ts` |
| Layout existant | `src/app/[locale]/(pages)/layout.tsx` |

---

## Responsabilité

Connecter les Contexts et Wrappers (créés par Agent 7) aux pages et composants UI concernés.
Remplacer les mock data et les appels directs aux actions par la consommation des contextes.

> ⚠️ Agent 8 ne s'exécute QUE sur les features pour lesquelles une autorisation UI explicite a été donnée.

---

## 🚫 RAPPEL — Périmètre strict

Agent 8 peut UNIQUEMENT :
- Créer/modifier des layouts `src/app/[locale]/(pages)/<feature>/layout.tsx`
- Modifier les pages `src/app/[locale]/(pages)/<feature>/**/*.tsx` autorisées
- Modifier les composants `_components/` à l'intérieur des dossiers de pages autorisées

Agent 8 ne peut PAS :
- Modifier `src/components/**` (composants globaux partagés)
- Modifier les pages non-autorisées
- Modifier l'architecture ou les fichiers de domaine

---

## Actions obligatoires

### 1. Identifier la feature et lire les fichiers concernés

Avant toute modification, lire :
1. Le Context : `src/contexts/<feature>-context.tsx` → identifier tous les exports
2. Le Wrapper : `src/context_wrappers/<feature>_wrapper.tsx` → comprendre les données exposées
3. Les pages UI : lire chaque fichier `.tsx` de la feature pour comprendre l'état actuel
4. Le layout existant (s'il y en a un) : `src/app/[locale]/(pages)/<feature>/layout.tsx`

---

### 2. Créer ou mettre à jour le Layout

Le layout est le point d'entrée du Wrapper. Il enveloppe toutes les pages de la feature.

**Chemin :** `src/app/[locale]/(pages)/<feature>/layout.tsx`

**Pattern — feature avec un seul wrapper :**

```typescript
"use client"

import <Feature>Wrapper from "@/context_wrappers/<feature>_wrapper"

export default function <Feature>Layout({ children }: { children: React.ReactNode }) {
  return (
    <<Feature>Wrapper>
      {children}
    </<Feature>Wrapper>
  )
}
```

**Pattern — feature avec plusieurs wrappers imbriqués :**

```typescript
"use client"

import <FeatureA>Wrapper from "@/context_wrappers/<feature_a>_wrapper"
import <FeatureB>Wrapper from "@/context_wrappers/<feature_b>_wrapper"

export default function <Feature>Layout({ children }: { children: React.ReactNode }) {
  return (
    <<FeatureA>Wrapper>
      <<FeatureB>Wrapper>
        {children}
      </<FeatureB>Wrapper>
    </<FeatureA>Wrapper>
  )
}
```

Règles du layout :
- Wrapper le plus global en dehors, plus spécifique en dedans
- Si un wrapper est déjà présent dans un layout parent, ne pas le dupliquer

---

### 3. Mettre à jour les Pages

Remplacer les mock data et les appels directs aux actions par le hook du context.

**Pattern de migration :**

```typescript
// AVANT (mock data ou appel direct)
const zonesData = [{ id: 1, nom: "Terrasse", ... }]

// APRÈS (contexte)
const { items, isLoading, refreshAll } = use<Feature>Context()
```

**Règles de migration :**

| Ancien pattern | Nouveau pattern |
|----------------|-----------------|
| Mock data (`const data = [...]`) | `const { items } = use<Feature>Context()` |
| `useState` local pour la liste | Supprimé — données viennent du context |
| Appel direct `await handleXxxAction()` | Action exposée par le context (ex: `createItem`) |
| `toast.success/error` dans le composant | Supprimé — déjà dans le Wrapper |
| Spinner/loading local pour fetch | `const { isLoading } = use<Feature>Context()` |
| Refresh manuel avec timeout simulé | `refreshAll()` du context |

**Mapping des types :**

Si le type local du composant UI diffère du type API (`AreaBasic` vs `Zone`), créer un mapping dans la page :

```typescript
const { items: areas } = useAreaManagementContext()

// Mapping API → type UI local (dans un useMemo)
const zones = React.useMemo(() => areas.map((a) => ({
  id: a.id,
  nom: a.name,
  // ...
})), [areas])
```

---

### 4. Mettre à jour les Composants `_components/`

Les composants enfants qui déclenchent des actions CRUD doivent utiliser le hook du context directement.

**Pattern pour les composants d'action (bouton supprimer, formulaire créer/éditer) :**

```typescript
"use client"

import { use<Feature>Context } from "@/contexts/<feature>-context"

export function ActionCell({ item }: { item: ItemType }) {
  const { deleteItem, updateItem } = use<Feature>Context()

  const handleDelete = async () => {
    const success = await deleteItem(item.id)
    // Pas de toast ici — le Wrapper s'en charge
  }

  return (
    <Button onClick={handleDelete}>Supprimer</Button>
  )
}
```

**Pattern pour les formulaires (create/edit drawer) :**

```typescript
"use client"

import { use<Feature>Context } from "@/contexts/<feature>-context"

export function CreateItemDrawer({ open, onClose, item }: Props) {
  const { createItem, updateItem } = use<Feature>Context()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    const success = item
      ? await updateItem(item.id, formData)
      : await createItem(formData)
    setIsSubmitting(false)
    if (success) onClose()
    // Pas de toast ici — le Wrapper s'en charge
  }
}
```

---

### 5. Vérifier la cohérence des types

Avant de finaliser, vérifier que :
1. Le type UI local (schema Zod ou interface locale) est compatible avec le type API
2. Si `id` passe de `number` à `string`, mettre à jour le schema local
3. Les champs requis par `CreatePayload` sont tous couverts dans les formulaires

---

### 6. Corriger le Datasource — Bugs systématiques SCAF

> ⚠️ SCAF génère des datasources avec plusieurs bugs récurrents. **Lire le datasource concerné avant toute correction.** Vérifier que le bug est réellement présent avant de modifier. Ne corriger que ce qui est confirmé.

**Procédure obligatoire :**
1. Lire le fichier `src/modules/<scope>/<feature>/data/datasources/rest_api_<feature>_data_source_impl.ts`
2. Pour chaque bug listé ci-dessous, vérifier sa présence dans le fichier lu
3. Corriger uniquement les bugs confirmés

#### Bug 1 — Enveloppe API non unwrappée (`getList`)

SCAF retourne la réponse brute. Le backend répond toujours :
```json
{ "status": "SUCCESS", "message": "...", "data": { "<key>": [...], "pagination": { "total": N } } }
```

Le wrapper lit `result.data?.results` et `result.data?.count` mais SCAF retourne l'objet brut entier.

**Fix obligatoire dans `getXxxList` du datasource :**
```typescript
// Lire les logs pour identifier le vrai nom de la clé (ex: "areas", "tables", "items"...)
const raw = data as any
return {
    count: raw?.data?.pagination?.total ?? 0,
    next: null,
    previous: null,
    results: raw?.data?.["<clé_réelle>"] ?? [],
}
```

#### Bug 2 — Body wrappé inutilement (`create`, `update`, `patch`, `activate`)

SCAF génère `body: { payload: payload }` au lieu de `body: payload`. Le backend reçoit `{ payload: { ... } }` et répond **400 Données invalides**.

**Fix obligatoire pour toutes les méthodes avec body :**
```typescript
// AVANT (SCAF généré — INCORRECT)
body: { payload: payload }

// APRÈS (correct)
body: payload
```

#### Bug 3 — DELETE renvoie 204 No Content (body vide)

SCAF utilise `responseType: "json"` par défaut. Le backend DELETE renvoie **204 No Content** sans body. `JSON.parse("")` crash avec `SyntaxError: Unexpected end of JSON input`.

**Fix obligatoire dans `deleteXxx` du datasource :**
```typescript
const { error, status } = await apiClient<CONFIG_DELETE_XXX_RESPONSE_200>(route, {
    method: "DELETE",
    responseType: "text",   // ← obligatoire pour éviter le crash JSON
});

if (error) { ... }

return {}; // 204 No Content — body vide, succès
```

#### Bug 4 — Wrapper : mise à jour locale fragile après mutation

SCAF génère des mises à jour locales (`setItems(prev => prev.map(...))`) qui dépendent du format exact de `result.data`. Si le format diffère, l'item disparaît ou reste obsolète.

**Fix obligatoire dans le Wrapper — appeler `refreshXxx()` après chaque mutation :**
```typescript
const updateItem = React.useCallback(async (id, payload): Promise<boolean> => {
    const result = await handleUpdateXxxAction(id, payload)
    if (result.success) {
        toast.success("Modifié avec succès.")
        await refreshAll()   // ← toujours resync depuis le backend
    } else {
        toast.error(result.message ?? "Modification échouée.")
    }
    return result.success
}, [refreshAll])
```
Appliquer ce pattern à : `createItem`, `updateItem`, `deleteItem`, `activateItem`, `deactivateItem`.

---

## Rapport de complétion

```
INTÉGRATION UI — Feature <nom>

CRÉÉ/MIS À JOUR : src/app/[locale]/(pages)/<feature>/layout.tsx
  → Wrapper(s) utilisé(s) : [liste]

MIS À JOUR : src/app/[locale]/(pages)/<feature>/page.tsx
  → Mock data supprimée : oui/non
  → Context consommé : use<Feature>Context()

MIS À JOUR : src/app/[locale]/(pages)/<feature>/_components/[fichier].tsx
  → Actions CRUD wirées : [liste]

TYPES : Mapping API→UI créé : oui/non
  → Champs manquants gérés : [liste]

RÉSULTAT : Feature <nom> connectée à l'API via le context.
```

---

## Règles

- Lire TOUS les fichiers concernés avant de modifier quoi que ce soit
- Un seul layout par feature — ne pas dupliquer les wrappers
- `toast` uniquement dans le Wrapper, jamais dans les composants UI
- Pas d'état local pour les données venant du contexte
- Les `isSubmitting` locaux (feedback bouton) sont OK dans les composants — c'est de l'UI pure
- Pas de `try/catch` dans les composants pour les appels au contexte — le Wrapper gère les erreurs
