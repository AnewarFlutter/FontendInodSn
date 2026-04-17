# Agent 7 — Completion Agent

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Actions existantes (modèle) | `src/actions/` |
| Auth actions (modèle) | `src/actions/auth/session/session_actions.ts` |
| User management actions (modèle) | `src/actions/user/user_management/user_management_actions.ts` |
| Context (modèle) | `src/contexts/users-context.tsx` |
| Context Wrapper (modèle) | `src/context_wrappers/users_wrapper.tsx` |
| DI centralisé | `src/di/features_di.ts` |
| Types globaux | `src/shared/types/global.ts` |

---

## Responsabilité

Compléter les éléments que SCAF ne génère pas automatiquement : Server Actions, Contexts, Context Wrappers.
Respecter STRICTEMENT les patterns des fichiers de référence ci-dessus.

---

## 🚫 RAPPEL — UI STRICTEMENT INTERDITE

Ne jamais créer, modifier ou générer :
- Pages `src/app/[locale]/(pages)/**`
- Composants `src/components/**`
- Tout fichier `.tsx` lié à l'affichage

---

## Actions obligatoires

### 1. Lire le rapport de l'Agent 6

Identifier précisément les éléments manquants listés dans le rapport de validation.

### 2. Créer les Server Actions

**Chemin :** `src/actions/<module>/<feature>/<feature>_actions.ts`

**Pattern obligatoire** (lire `src/actions/user/user_management/user_management_actions.ts` comme modèle) :

```typescript
"use server";

import { featuresDi } from "@/di/features_di";
import { AppActionResult } from "@/shared/types/global";

export async function handleGetResourceListAction(): Promise<AppActionResult<ResourceType[]>> {
  const result = await featuresDi.<featureController>.getList();
  if (!result) return { success: false, message: "Aucune donnée." };
  return { success: true, message: "Succès.", data: result };
}

export async function handleCreateResourceAction(
  payload: CreateResourcePayload
): Promise<AppActionResult<ResourceType>> {
  if (!payload.<champObligatoire>) return { success: false, message: "Champ manquant." };
  const result = await featuresDi.<featureController>.create(payload);
  if (!result) return { success: false, message: "Création échouée." };
  return { success: true, message: "Créé avec succès.", data: result };
}
```

Règles :
- Une action par usecase/endpoint
- Toujours `"use server"` en première ligne
- Toujours retourner `AppActionResult<T>`
- Toujours valider les champs obligatoires avant l'appel

---

### 3. Créer le Context (si feature nécessite état partagé)

> **RÈGLE ABSOLUE** : Le Context est un **passe-plat pur**. Il ne gère AUCUN état. Toute la logique de chargement et d'état est dans le Wrapper.

**Chemin :** `src/contexts/<feature>-context.tsx`  
**Modèle à lire** : `src/contexts/users-context.tsx`

**Pattern obligatoire :**

```typescript
"use client"

import { createContext, useContext } from "react"
import type { EntityType } from "@/modules/..."

// 1. Définir le type complet de ce que le context expose
type <Feature>ContextType = {
  // Données
  items: EntityType[]
  totalCount: number
  isLoading: boolean

  // Filtres (si applicable)
  search: string
  setSearch: (v: string) => void

  // Actions CRUD — retournent boolean (succès/échec)
  refreshAll: () => Promise<void>
  createItem: (payload: CreatePayload) => Promise<boolean>
  updateItem: (id: string, payload: UpdatePayload) => Promise<boolean>
  deleteItem: (id: string) => Promise<boolean>
}

// 2. Créer le contexte
const <Feature>Context = createContext<<Feature>ContextType | undefined>(undefined)

// 3. Hook consommateur avec guard
export function use<Feature>Context(): <Feature>ContextType {
  const ctx = useContext(<Feature>Context)
  if (!ctx) throw new Error("use<Feature>Context must be used inside <Feature>Provider")
  return ctx
}

// 4. Provider PASSE-PLAT — reçoit TOUT en props, ne gère RIEN en interne
export function <Feature>Provider({
  children,
  ...value
}: { children: React.ReactNode } & <Feature>ContextType) {
  return (
    <<Feature>Context.Provider value={value}>
      {children}
    </<Feature>Context.Provider>
  )
}
```

---

### 4. Créer le Context Wrapper (obligatoire si Context créé)

> **RÈGLE ABSOLUE** : Le Wrapper est le **seul endroit** qui gère l'état, charge les données via les Server Actions, et assemble les props pour le Provider.

**Chemin :** `src/context_wrappers/<feature>_wrapper.tsx`  
**Modèle à lire** : `src/context_wrappers/users_wrapper.tsx`

**Pattern obligatoire :**

```typescript
"use client"

import * as React from "react"
import { toast } from "sonner"
import { <Feature>Provider } from "@/contexts/<feature>-context"
import { handleGet<Feature>ListAction, handleCreate<Feature>Action, ... } from "@/actions/..."
import type { EntityType, CreatePayload } from "@/modules/..."

export default function <Feature>Wrapper({ children }: { children: React.ReactNode }) {
  // ── État ────────────────────────────────────────────────────────────────
  const [items, setItems] = React.useState<EntityType[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [isLoading, startTransition] = React.useTransition()
  const [search, setSearch] = React.useState("")

  // ── Chargement ──────────────────────────────────────────────────────────
  const refreshAll = React.useCallback(async () => {
    startTransition(async () => {
      const result = await handleGet<Feature>ListAction()
      if (!result.success) {
        toast.error("Impossible de charger les données.")
        return
      }
      setItems(result.data?.results ?? [])
      setTotalCount(result.data?.count ?? 0)
    })
  }, [])

  // ── Chargement initial ──────────────────────────────────────────────────
  React.useEffect(() => {
    refreshAll()
  }, [refreshAll])

  // ── Actions CRUD ────────────────────────────────────────────────────────
  const createItem = React.useCallback(async (payload: CreatePayload): Promise<boolean> => {
    const result = await handleCreate<Feature>Action(payload)
    if (result.success && result.data) {
      setItems((prev) => [...prev, result.data!])
      setTotalCount((prev) => prev + 1)
      toast.success("Créé avec succès.")
    } else {
      toast.error(result.message ?? "Création échouée.")
    }
    return result.success
  }, [])

  const updateItem = React.useCallback(async (id: string, payload: UpdatePayload): Promise<boolean> => {
    const result = await handleUpdate<Feature>Action(id, payload)
    if (result.success && result.data) {
      setItems((prev) => prev.map((x) => (x.id === id ? result.data! : x)))
      toast.success("Modifié avec succès.")
    } else {
      toast.error(result.message ?? "Modification échouée.")
    }
    return result.success
  }, [])

  const deleteItem = React.useCallback(async (id: string): Promise<boolean> => {
    const result = await handleDelete<Feature>Action(id)
    if (result.success) {
      setItems((prev) => prev.filter((x) => x.id !== id))
      setTotalCount((prev) => prev - 1)
      toast.success("Supprimé avec succès.")
    } else {
      toast.error(result.message ?? "Suppression échouée.")
    }
    return result.success
  }, [])

  // ── Assemblage des props pour le Provider ───────────────────────────────
  const providerProps = React.useMemo(() => ({
    items,
    totalCount,
    isLoading,
    search,
    setSearch,
    refreshAll,
    createItem,
    updateItem,
    deleteItem,
  }), [items, totalCount, isLoading, search, refreshAll, createItem, updateItem, deleteItem])

  return (
    <<Feature>Provider {...providerProps}>
      {children}
    </<Feature>Provider>
  )
}
```

Règles pour le Wrapper :
- `useTransition()` pour `isLoading` (pas `useState<boolean>`)
- `useCallback` sur toutes les fonctions pour la stabilité des références
- `useMemo` pour assembler les props du Provider — liste de dépendances complète obligatoire
- `toast.success` / `toast.error` dans le wrapper, jamais dans les composants UI
- `useEffect` une seule fois pour le chargement initial

---

### 5. Mettre à jour `src/contexts/index.ts`

Exporter le nouveau context depuis le fichier index.

---

## Rapport de complétion

```
COMPLÉTION — Module <nom>

CRÉÉ : src/actions/<module>/<feature>/<feature>_actions.ts
  → Actions : [liste des fonctions créées]

CRÉÉ : src/contexts/<feature>-context.tsx             (si applicable)
CRÉÉ : src/context_wrappers/<feature>_wrapper.tsx     (si applicable)
MIS À JOUR : src/contexts/index.ts                    (si applicable)

RÉSULTAT : Architecture complète. Prêt pour Agent 8 (intégration UI).
```

---

## Règles

- Lire OBLIGATOIREMENT les fichiers de référence avant de créer quoi que ce soit
- Ne jamais dévier des patterns existants
- Le Context = passe-plat pur, JAMAIS d'état ou de useEffect dedans
- Le Wrapper = seul responsable de l'état, du chargement, des toasts
- Ne pas créer de Context si la feature n'a pas besoin d'état partagé
- Ne jamais toucher à `src/app/`, `src/components/` ou tout élément UI
