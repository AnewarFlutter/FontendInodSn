# Agent M1-2 — Portail Principal (Page Liste des Dossiers)

## Responsabilité

Créer `src/app/[locale]/(pages)/dossiers/page.tsx` et ses composants annexes.
Page d'accueil du module : affiche les dossiers **du profil connecté uniquement** (par défaut),
avec filtres, alertes, recherche et actions contextuelles.

---

## Références obligatoires — LIRE AVANT DE CODER

| Ressource | Chemin |
|-----------|--------|
| Design référence (shop) | `src/app/[locale]/(pages)/modules/shop/page.tsx` |
| Design référence (users) | `src/app/[locale]/(pages)/user-management/page.tsx` |
| Types & mock (M1-1) | `src/app/[locale]/(pages)/dossiers/_lib/dossiers-data.ts` |
| LoadingButton | `src/components/loading-button.tsx` |
| APP_ROUTES | `src/shared/constants/routes.ts` |

---

## Règles métier importantes

- **Affichage par défaut** : dossiers du clerc connecté uniquement (filtrable vers "toute l'étude")
- **Alertes** : indicateurs visuels J-7, J-3, J-1 directement sur les cards
- **Dossiers suspendus** : peuvent durer des années (ex: retour titre foncier) → badge distinctif orange
- **Retards** : si `dateSignaturePrevue` dépassée → indicateur rouge visible

---

## Structure de la page

### 1. Bandeau alertes actives (en haut de tout)

Si des alertes existent pour les dossiers du profil, afficher un bandeau :

```tsx
{alertesUrgentes.length > 0 && (
  <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50
                  dark:border-amber-800 dark:bg-amber-950/20 px-4 py-3">
    <Bell className="h-4 w-4 text-amber-500 shrink-0 animate-pulse" />
    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
      {alertesUrgentes.length} échéance(s) dans les 7 prochains jours
    </p>
    <div className="flex gap-1.5 ml-2">
      {alertesUrgentes.slice(0, 3).map(a => (
        <span key={a.id} className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold",
          a.niveau === "j1"     ? "bg-red-500 text-white" :
          a.niveau === "j3"     ? "bg-orange-500 text-white" :
          a.niveau === "depasse"? "bg-red-700 text-white" :
                                  "bg-amber-500 text-white"
        )}>{a.niveau === "depasse" ? "EN RETARD" : a.niveau.toUpperCase()}</span>
      ))}
    </div>
  </div>
)}
```

### 2. Cartes statistiques — grille 4 colonnes

```
[Total dossiers — blue] [En cours — blue clair] [En attente — amber] [Suspendus — orange] [Clôturés — slate]
```

5 cartes (4 statuts + total). Pattern identique shop :
```tsx
<div className="grid grid-cols-5 gap-3">
```

### 3. Header

- **Gauche** : "Dossiers Notariaux" (text-xl font-bold) + "Mes dossiers en cours" (text-xs muted)
- **Droite** :
  - Toggle "Mes dossiers / Toute l'étude" — petit switch pill
  - `LoadingButton` Rafraîchir (IconRefresh, variant secondary)
  - `Button` "Nouveau dossier" (IconPlus) → ouvre `CreateDossierSheet`

Toggle profil/étude :
```tsx
<div className="flex items-center rounded-lg border border-dashed bg-muted/40 p-0.5 gap-0.5">
  <button onClick={() => setVueEtude(false)}
    className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
      !vueEtude ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}>
    Mes dossiers
  </button>
  <button onClick={() => setVueEtude(true)}
    className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
      vueEtude ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}>
    Toute l'étude
  </button>
</div>
```

### 4. Filtres familles — cartes horizontales scrollables

5 cartes (Tous + 4 familles) — même pattern que les filtres shop :

```tsx
// Carte famille active : bg-foreground text-background
// Carte famille inactive : bg-card hover:bg-muted/50
// Chaque carte affiche : nom famille, description courte, dot coloré, compteur
```

### 5. Barre d'outils

```
[Onglets statut: Tous | En cours | En attente | Suspendu | Clôturé]   [🔍 Recherche] [⊞ ⊟]
```

Onglets statut avec compteur (même pattern pills shop).

### 6. Grille / Liste de dossiers

#### DossierCard (grille — `sm:grid-cols-2 lg:grid-cols-3`)

```
┌──────────────────────────────────────────┐
│ [Header coloré selon statut]             │
│   ● EN COURS ▲ J-3    (badges top-right) │
│   Moussa NDIAYE /                        │
│   Awa DIOP            (grand titre bold) │
│   Droit Immobilier · Vente immobilière   │
├──────────────────────────────────────────┤
│ Notaire    │ Clerc                        │
│ Me SALL    │ FALL Ibrahima               │
├─────────────────────────────────────────┤
│ Date signature     15 mars 2025          │
│                    ⚠ +12 jours de retard │  (si dépassé)
├──────────────────────────────────────────┤
│ Montant prévisionnel  45 000 000 FCFA    │
├──────────────────────────────────────────┤
│ Sous-dossiers         2 rattachés        │  (si > 0)
├──────────────────────────────────────────┤
│ [Voir détail ›]    [⋮ Menu contextuel]   │
└──────────────────────────────────────────┘
```

**Header coloré** (classes depuis STATUS_META[status].headerBg et headerText) :
- Badge statut : `absolute top-3 right-4`, fond plein couleur, texte blanc
- Badge alerte (si présent) : à gauche du badge statut — `absolute top-3 left-4`
  - J-1 : `bg-red-500 text-white` + "⚡ J-1"
  - J-3 : `bg-orange-500 text-white` + "▲ J-3"
  - J-7 : `bg-amber-400 text-white` + "◆ J-7"
  - EN RETARD : `bg-red-700 text-white animate-pulse`

**Indicateur de retard** (sous la date) :
```tsx
{isRetard && (
  <p className="text-[10px] text-red-500 font-semibold mt-0.5 flex items-center gap-1">
    <AlertTriangle className="h-3 w-3" />
    +{retardJours} jour(s) de retard
  </p>
)}
```

**Corps** : info rows avec `divide-y divide-dashed`.

#### DossierRow (liste)

```
[Avatar lettre coloré] | Référence mono + Intitulé + badge famille | Badge statut | Notaire | Date | Montant | [Actions]
```

Border gauche colorée selon statut (`border-l-2`).

### 7. Pagination

8 dossiers/page grille, 10/page liste. Même pattern shop.

---

## Composant AlerteBadge

```tsx
// src/app/[locale]/(pages)/dossiers/_components/alerte-badge.tsx
function AlerteBadge({ alerte }: { alerte: Alerte }) {
  const config = {
    j1:      { label: "⚡ J-1",       cls: "bg-red-500 text-white" },
    j3:      { label: "▲ J-3",       cls: "bg-orange-500 text-white" },
    j7:      { label: "◆ J-7",       cls: "bg-amber-400 text-white" },
    depasse: { label: "EN RETARD",   cls: "bg-red-700 text-white animate-pulse" },
  }
  const c = config[alerte.niveau]
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold", c.cls)}>
      {c.label}
    </span>
  )
}
```

---

## Menu contextuel DropdownMenu

```tsx
<DropdownMenuContent align="end" className="w-48 border-dashed">
  <DropdownMenuItem onClick={() => onDetail(d)}>
    <FolderOpen className="h-4 w-4 mr-2" /> Ouvrir le dossier
  </DropdownMenuItem>
  <DropdownMenuItem onClick={() => onDuplicate(d)}>
    <Copy className="h-4 w-4 mr-2" /> Dupliquer
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  {d.status !== "cloture" && (
    <DropdownMenuItem onClick={() => onChangeStatus(d)}>
      <RefreshCw className="h-4 w-4 mr-2" /> Changer le statut
    </DropdownMenuItem>
  )}
  {d.status === "cloture" && (
    <DropdownMenuItem onClick={() => onArchive(d)}>
      <Archive className="h-4 w-4 mr-2" /> Archiver
    </DropdownMenuItem>
  )}
  <DropdownMenuItem onClick={() => onRelance(d)}>
    <Bell className="h-4 w-4 mr-2" /> Programmer une relance
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem onClick={() => onExport(d)}>
    <Download className="h-4 w-4 mr-2" /> Exporter
  </DropdownMenuItem>
</DropdownMenuContent>
```

---

## État local complet

```typescript
const MOCK_CLERC_CONNECTE = "FALL Ibrahima"  // utilisateur simulé

const [dossiers, setDossiers]             = React.useState<Dossier[]>(DOSSIERS_MOCK)
const [vueEtude, setVueEtude]             = React.useState(false)
const [filterFamille, setFilterFamille]   = React.useState<"tous" | FamilleDossier>("tous")
const [filterStatut, setFilterStatut]     = React.useState<"tous" | DossierStatus>("tous")
const [search, setSearch]                 = React.useState("")
const [view, setView]                     = React.useState<"grid" | "list">("grid")
const [page, setPage]                     = React.useState(1)
const [isRefreshing, setIsRefreshing]     = React.useState(false)
const [createOpen, setCreateOpen]         = React.useState(false)
const [detailDossier, setDetailDossier]   = React.useState<Dossier | null>(null)
const [detailOpen, setDetailOpen]         = React.useState(false)
const [statusDossier, setStatusDossier]   = React.useState<Dossier | null>(null)
const [statusOpen, setStatusOpen]         = React.useState(false)
const [archiveDossier, setArchiveDossier] = React.useState<Dossier | null>(null)
const [archiveOpen, setArchiveOpen]       = React.useState(false)
```

---

## Logique de filtrage

```typescript
const filtered = React.useMemo(() => {
  let list = vueEtude
    ? dossiers
    : dossiers.filter(d => d.clerc === MOCK_CLERC_CONNECTE)

  if (filterFamille !== "tous")
    list = list.filter(d => d.famille === filterFamille)
  if (filterStatut !== "tous")
    list = list.filter(d => d.status === filterStatut)
  if (search.trim())
    list = list.filter(d =>
      d.intitule.toLowerCase().includes(search.toLowerCase()) ||
      d.reference.toLowerCase().includes(search.toLowerCase()) ||
      d.notaire.toLowerCase().includes(search.toLowerCase()) ||
      d.clerc.toLowerCase().includes(search.toLowerCase())
    )
  return list
}, [dossiers, vueEtude, filterFamille, filterStatut, search])
```

---

## Handlers obligatoires

```typescript
// Duplication avec choix de référence automatique
const handleDuplicate = (d: Dossier) => {
  const copy: Dossier = {
    ...d,
    id: `dos-${Date.now()}`,
    reference: generateReference(d.famille),
    intitule: `${d.intitule} (copie)`,
    status: "en_cours",
    dateCreation: new Date().toISOString(),
    dateDerniereModif: new Date().toISOString(),
    sousDossiers: [],
    nombreSousDossiers: 0,
    alertesActives: [],
  }
  setDossiers(prev => [copy, ...prev])
  toast.success("Dossier dupliqué — référence : " + copy.reference, { position: "bottom-right" })
}

const handleExport = (d: Dossier) =>
  toast.success(`Export "${d.intitule}" en cours…`, { position: "bottom-right" })

const handleStatusChange = (id: string, newStatus: DossierStatus) => {
  setDossiers(prev => prev.map(d =>
    d.id === id ? { ...d, status: newStatus, dateDerniereModif: new Date().toISOString() } : d
  ))
  toast.success(`Statut → ${STATUS_META[newStatus].label}`, { position: "bottom-right" })
}

const handleArchive = (id: string) => {
  setDossiers(prev => prev.map(d => d.id === id ? { ...d, status: "cloture" } : d))
  toast.success("Dossier archivé", { position: "bottom-right" })
}

const handleCreate = (payload: CreateDossierPayload) => {
  const nouveau: Dossier = {
    id: `dos-${Date.now()}`,
    reference: generateReference(payload.famille),
    intitule: payload.intitule,
    famille: payload.famille,
    typeOperation: payload.typeOperation,
    status: "en_cours",
    notaire: payload.notaire,
    clerc: payload.clerc,
    dateSignaturePrevue: payload.dateSignaturePrevue,
    montantPrevisionnel: payload.montantPrevisionnel,
    dateCreation: new Date().toISOString(),
    dateDerniereModif: new Date().toISOString(),
    nombreSousDossiers: 0,
    alertesActives: [],
    conditionSuspensive: payload.conditionSuspensive,
  }
  setDossiers(prev => [nouveau, ...prev])
  toast.success("Dossier créé — " + nouveau.reference, { position: "bottom-right" })
}
```

---

## Output attendu

```
CRÉÉ : src/app/[locale]/(pages)/dossiers/page.tsx
CRÉÉ : src/app/[locale]/(pages)/dossiers/layout.tsx
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/Breadcrumb.tsx
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/dossier-card.tsx
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/dossier-row.tsx
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/alerte-badge.tsx

FONCTIONNALITÉS :
  ✓ Bandeau alertes actives (J-7, J-3, J-1, EN RETARD)
  ✓ 5 stats cards (total + 4 statuts)
  ✓ Toggle Mes dossiers / Toute l'étude
  ✓ Filtres famille (cartes scrollables)
  ✓ Filtres statut (onglets pills) — 4 statuts dont Suspendu
  ✓ Recherche (intitulé, référence, notaire, clerc)
  ✓ Toggle grille/liste
  ✓ Badge alerte J-x sur les cards
  ✓ Indicateur de retard avec nb jours
  ✓ Menu contextuel (Ouvrir, Dupliquer, Changer statut, Archiver, Relance, Exporter)
  ✓ Pagination (8/page grille, 10/page liste)
```
