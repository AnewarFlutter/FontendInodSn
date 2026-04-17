# Agent M11-5 — Archivage Browser & Traçabilité

## Responsabilité

Créer deux composants :
1. **Page `/archives`** — browser dossiers archivés en lecture seule, avec étiquettes physiques
2. **`tracabilite-sheet.tsx`** — journal d'audit complet d'un dossier (qui a fait quoi, avant/après)

**M1 a déjà :** `ArchiveConfirmSheet` (confirmation de l'action d'archivage d'un dossier clôturé).
**M11 ajoute :** la consultation des archives (lecture seule, étiquette, restauration), et le journal d'audit détaillé.

---

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Design shop (référence) | `src/app/[locale]/(pages)/modules/shop/page.tsx` |
| Design dossiers (référence) | `src/app/[locale]/(pages)/dossiers/page.tsx` |
| Types M1 | `src/app/[locale]/(pages)/dossiers/_lib/dossiers-data.ts` |
| Types M11 | `src/app/[locale]/(pages)/recherche/_lib/recherche-data.ts` |
| LoadingButton | `src/components/loading-button.tsx` |

---

## Règles métier confirmées

- **Lecture seule dès clôture** (Q35ter) : dossier clôturé = lecture seule stricte
- **Conservation 50 ans** (Q35) : minutes conservation indéfinie (>50 ans), autres documents limités
- **Distinction minutes/autres** (Q35) : typeConservation = "minute" | "document" | "copie"
- **Étiquette physique** (Q35bis) : référence rayon + boîte pour classement physique parallèle
- **Qui clôture** (Q36) : clerc → secrétaire → notaire (checklist de clôture)
- **Traçabilité forte** (Q37) : historique avant/après, exigence forte en cas de litige
- **Double confirmation** (Q38) : signature, suppression, modification acte

---

## Partie 1 — Page `/archives`

### Structure

```
┌──────────────────────────────────────────────────────┐
│ BREADCRUMB                                           │
├──────────────────────────────────────────────────────┤
│ HEADER                                               │
│ 🗄 Archives Notariales                               │
│ Consultation en lecture seule — Conservation 50 ans │
│                              [🔍 Recherche] [↓ CSV]  │
├──────────────────────────────────────────────────────┤
│ BANNIÈRE LECTURE SEULE (amber)                       │
│  🔒 Les dossiers archivés sont en lecture seule.    │
│     Restauration possible par notaire/administrateur │
├──────────────────────────────────────────────────────┤
│ FILTRES                                              │
│ [Tous] [Minutes (∞)] [Documents (50 ans)] [Copies]  │
│ [Année ▼]  [Famille ▼]  [Notaire ▼]                 │
├──────────────────────────────────────────────────────┤
│ GRILLE ARCHIVES (3 colonnes)                         │
│ [ArchiveCard] [ArchiveCard] [ArchiveCard]            │
│ [ArchiveCard] [ArchiveCard] [ArchiveCard]            │
└──────────────────────────────────────────────────────┘
```

### ArchiveCard

```tsx
function ArchiveCard({ archive, onDetail }: {
  archive: DossierArchive
  onDetail: (a: DossierArchive) => void
}) {
  const familleMeta = FAMILLE_META[archive.famille]
  const conservLabel = archive.typeConservation === "minute"
    ? "Minute — Conservation indéfinie"
    : `Document — ${archive.dureeConservationAns} ans`

  return (
    <div className="rounded-2xl border border-dashed bg-card flex flex-col overflow-hidden">

      {/* Header slate (archives = toujours clôturé) */}
      <div className="relative bg-slate-100 dark:bg-slate-900 px-5 py-4">
        {/* Badge lecture seule */}
        <div className="absolute top-3 right-4">
          <span className="flex items-center gap-1 rounded-full bg-slate-600 text-white px-2 py-0.5 text-[10px] font-semibold">
            <Lock className="h-2.5 w-2.5" />
            Archivé
          </span>
        </div>
        {/* Référence étiquette */}
        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
          {archive.reference}
        </p>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
          {archive.intitule}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {familleMeta.label} · {archive.typeOperation.replace(/_/g, " ")}
        </p>
      </div>

      {/* Corps */}
      <div className="flex-1 divide-y divide-dashed text-xs">
        {/* Dates */}
        <div className="grid grid-cols-2 divide-x divide-dashed px-5 py-3">
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Archivé le</p>
            <p className="font-semibold mt-0.5">{new Date(archive.dateArchivage).toLocaleDateString("fr-FR")}</p>
          </div>
          <div className="pl-4">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Signé le</p>
            <p className="font-semibold mt-0.5">{new Date(archive.dateSignature).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>

        {/* Conservation */}
        <div className="px-5 py-3 flex items-center gap-2">
          <Archive className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Conservation</p>
            <p className={cn("font-semibold",
              archive.typeConservation === "minute" ? "text-emerald-600" : "text-muted-foreground"
            )}>{conservLabel}</p>
          </div>
        </div>

        {/* Étiquette physique (Q35bis) */}
        {archive.etiquettePhysique && (
          <div className="px-5 py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Classement physique</p>
            <p className="font-mono font-semibold mt-0.5">{archive.etiquettePhysique}</p>
            {archive.referenceRayon && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{archive.referenceRayon}</p>
            )}
          </div>
        )}
      </div>

      {/* Footer lecture seule */}
      <div className="px-5 py-3 border-t border-dashed flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs gap-1.5 cursor-pointer"
          onClick={() => onDetail(archive)}
        >
          <Eye className="h-3.5 w-3.5" />
          Consulter (lecture seule)
        </Button>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          Lecture seule
        </div>
      </div>
    </div>
  )
}
```

### ArchiveDetailSheet (lecture seule stricte)

```tsx
// Sheet side="right" sm:max-w-2xl
// Bannière amber en haut : "Dossier archivé — lecture seule"
// Info row : tous les champs du dossier, aucun bouton de modification
// Bouton restauration : visible seulement pour notaire/administrateur
// Footer : [Fermer] [Imprimer la fiche] [Restaurer (si autorisé)]

{/* Bannière lecture seule */}
<div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3 flex items-center gap-2.5 mb-4">
  <Lock className="h-4 w-4 text-amber-500 shrink-0" />
  <div>
    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Dossier archivé — Lecture seule</p>
    <p className="text-[10px] text-amber-600/80">
      Archivé le {formatDate(archive.dateArchivage)} · Conservation {archive.typeConservation === "minute" ? "indéfinie (minute)" : `${archive.dureeConservationAns} ans`}
    </p>
  </div>
</div>

{/* Étiquette physique */}
{archive.etiquettePhysique && (
  <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3 flex items-center gap-3 mb-4">
    <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
    <div>
      <p className="text-xs font-bold">{archive.etiquettePhysique}</p>
      <p className="text-[10px] text-muted-foreground">{archive.referenceRayon}</p>
    </div>
    <Button variant="outline" size="sm" className="ml-auto h-7 text-xs gap-1.5 cursor-pointer">
      <Printer className="h-3 w-3" />
      Imprimer étiquette
    </Button>
  </div>
)}

{/* Restauration (Q35ter : notaire/admin seulement) */}
<div className="rounded-lg border border-dashed border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20 px-4 py-3 flex items-center gap-3">
  <RotateCcw className="h-4 w-4 text-purple-500 shrink-0" />
  <div className="flex-1">
    <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">Restauration</p>
    <p className="text-[10px] text-purple-600/80">Autorisée pour : {archive.restaurablePar.join(", ")}</p>
  </div>
  <Button variant="outline" size="sm"
    className="h-7 text-xs border-purple-300 text-purple-700 cursor-pointer hover:bg-purple-100">
    Restaurer
  </Button>
</div>
```

---

## Partie 2 — TracabiliteSheet

**Type :** Sheet side="right", sm:max-w-xl

### Props

```typescript
interface TracabiliteSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
}
```

### Structure

```
HEADER : [Shield] Journal de traçabilité · Nom dossier

BODY :
── Filtres ──────────────────────────────────────────
  [Tous] [Modifications] [Signatures] [Exports]
  [Suppressions] [Statuts]

── Exigence légale ──────────────────────────────────
  ℹ Journal en écriture seule — non modifiable (Q37)
  ℹ Requis en cas de litige ou contestation

── Timeline événements (ordre chronologique inverse) ─
  [EvenementRow]
  [EvenementRow] — avec diff avant/après
  [EvenementRow] — double confirmation indiquée
  ...

FOOTER : [Fermer] [Download Exporter le journal]
```

### EvenementRow

```tsx
function EvenementRow({ evt }: { evt: EvenementTracabilite }) {
  const [open, setOpen] = React.useState(false)

  const actionMeta: Record<ActionTracee, { label: string; color: string; icon: React.ElementType }> = {
    creation:          { label: "Création",           color: "bg-blue-500",    icon: Plus },
    modification:      { label: "Modification",        color: "bg-amber-500",   icon: Edit },
    suppression:       { label: "Suppression",         color: "bg-red-600",     icon: Trash2 },
    signature:         { label: "Signature",           color: "bg-emerald-500", icon: PenLine },
    changement_statut: { label: "Changement statut",  color: "bg-purple-500",  icon: RefreshCw },
    archivage:         { label: "Archivage",           color: "bg-slate-500",   icon: Archive },
    restauration_archive: { label: "Restauration",    color: "bg-indigo-500",  icon: RotateCcw },
    export_pdf:        { label: "Export PDF",          color: "bg-sky-500",     icon: FileDown },
    impression:        { label: "Impression",          color: "bg-sky-400",     icon: Printer },
    duplication:       { label: "Duplication",         color: "bg-teal-500",    icon: Copy },
    ajout_partie:      { label: "Ajout partie",        color: "bg-violet-500",  icon: UserPlus },
    modification_acte: { label: "Modif. acte",         color: "bg-orange-600",  icon: FileEdit },
    clôture:           { label: "Clôture",             color: "bg-slate-600",   icon: CheckCircle2 },
  }

  const meta = actionMeta[evt.action]
  const needsConfirm = ACTIONS_DOUBLE_CONFIRMATION.includes(evt.action)

  return (
    <div className="relative flex items-start gap-3">
      {/* Dot timeline */}
      <div className={cn(
        "relative z-10 h-4 w-4 shrink-0 rounded-full border-2 border-background shadow-sm mt-0.5",
        meta.color
      )} />

      {/* Contenu */}
      <div className="flex-1 min-w-0 rounded-xl border border-dashed bg-card px-4 py-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold text-white",
              meta.color
            )}>{meta.label}</span>
            {needsConfirm && (
              <span className="rounded-full border border-dashed px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                Double confirmation
              </span>
            )}
            {evt.confirmeePar && (
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ Confirmé par {evt.confirmeePar}
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground shrink-0">
            {new Date(evt.timestamp).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold">{evt.objetLabel}</p>
          <p className="text-[10px] text-muted-foreground">
            Par <span className="font-semibold">{evt.utilisateur}</span>
            {" "}({evt.role}) · {evt.objetType}
          </p>
        </div>

        {/* Diff avant/après (Q37) */}
        {(evt.valeurAvant || evt.valeurApres) && (
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-[10px] text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
            {open ? "Masquer" : "Voir"} les changements
          </button>
        )}

        {open && (evt.valeurAvant || evt.valeurApres) && (
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed">
            {evt.valeurAvant && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-3 py-2">
                <p className="text-[10px] font-bold text-red-600 mb-1">Avant</p>
                {Object.entries(evt.valeurAvant).map(([k, v]) => (
                  <p key={k} className="text-[10px] text-red-700 dark:text-red-300">
                    {k}: <span className="font-semibold">{String(v)}</span>
                  </p>
                ))}
              </div>
            )}
            {evt.valeurApres && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-3 py-2">
                <p className="text-[10px] font-bold text-emerald-600 mb-1">Après</p>
                {Object.entries(evt.valeurApres).map(([k, v]) => (
                  <p key={k} className="text-[10px] text-emerald-700 dark:text-emerald-300">
                    {k}: <span className="font-semibold">{String(v)}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

### Timeline complète

```tsx
<div className="relative">
  {/* Ligne verticale */}
  <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />
  <div className="space-y-4">
    {/* Filtres catégories */}
    <div className="flex flex-wrap gap-1.5 pl-7">
      {filtreActions.map(f => (
        <button key={f}
          onClick={() => setFiltre(f)}
          className={cn(
            "rounded-full border border-dashed px-2.5 py-1 text-[11px] font-semibold cursor-pointer transition-all",
            filtre === f
              ? "bg-foreground text-background border-foreground"
              : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >{f}</button>
      ))}
    </div>

    {/* Bannière journal non modifiable */}
    <div className="ml-7 rounded-lg border border-dashed bg-muted/30 px-4 py-2 flex items-center gap-2">
      <Shield className="h-3.5 w-3.5 text-blue-400 shrink-0" />
      <p className="text-[10px] text-muted-foreground">
        Journal en écriture seule — non modifiable. Requis pour conformité légale et litiges.
      </p>
    </div>

    {/* Événements */}
    {evenements
      .filter(e => filtre === "Tous" || matchFiltre(e, filtre))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(evt => <EvenementRow key={evt.id} evt={evt} />)
    }
  </div>
</div>
```

---

## Câblage dans dossiers/page.tsx et archives/page.tsx

```typescript
// Dans dossiers/page.tsx
const [tracabiliteOpen, setTracabiliteOpen]     = React.useState(false)
const [tracabiliteDossier, setTracabiliteDossier] = React.useState<Dossier | null>(null)

// Menu contextuel :
// <DropdownMenuItem onClick={() => { setTracabiliteDossier(d); setTracabiliteOpen(true) }}>
//   <Shield className="h-4 w-4 mr-2" /> Journal de traçabilité
// </DropdownMenuItem>

// Dans dossier-detail-sheet.tsx, Tab Historique :
// Remplacer le timeline mock par <TracabiliteSheet inline />
// ou ajouter bouton "Voir journal complet" qui ouvre TracabiliteSheet
```

---

## Ajout sidebar

```typescript
// app-sidebar.tsx — après Dossiers Notariaux
{
  title: "Archives",
  url: APP_ROUTES.archives.root,
  icon: Archive,
  isActive: true,
  items: [{ title: "Dossiers archivés", url: APP_ROUTES.archives.root }],
},
```

---

## Output attendu

```
CRÉÉ : src/app/[locale]/(pages)/archives/page.tsx
CRÉÉ : src/app/[locale]/(pages)/archives/layout.tsx
CRÉÉ : src/app/[locale]/(pages)/archives/_components/archive-card.tsx
CRÉÉ : src/app/[locale]/(pages)/archives/_components/archive-detail-sheet.tsx
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/tracabilite-sheet.tsx
MODIFIÉ : src/app/[locale]/(pages)/dossiers/page.tsx
  → états tracabiliteOpen / tracabiliteDossier
  → menu contextuel → TracabiliteSheet
MODIFIÉ : src/components/app-sidebar.tsx  (ajout Archives)

FONCTIONNALITÉS ARCHIVES :
  ✓ Grille 3 colonnes dossiers archivés
  ✓ ArchiveCard : header slate, badge "Archivé", lecture seule
  ✓ Conservation : minute (∞) vs document (50 ans) vs copie (30 ans) — Q35
  ✓ Étiquette physique + référence rayon — Q35bis
  ✓ Bannière amber "lecture seule" — Q35ter
  ✓ ArchiveDetailSheet : lectureSeule, étiquette, bouton restauration (notaire/admin)
  ✓ Filtres : typeConservation, année, famille, notaire

FONCTIONNALITÉS TRAÇABILITÉ :
  ✓ Timeline chronologique inverse avec dot coloré par action
  ✓ 13 types d'actions tracées
  ✓ Badge "Double confirmation" pour signature/suppression/modification_acte — Q38
  ✓ Diff avant/après expandable — Q37
  ✓ Filtres par catégorie d'action
  ✓ Bannière "journal en écriture seule — non modifiable"
  ✓ Bouton "Exporter le journal" (PDF/CSV)
```
