# Agent M1-5 — Cycle de Vie, Transitions d'État & Relances

## Responsabilité

Créer trois composants :
1. `statut-transition-sheet.tsx` — changer l'état d'un dossier avec motif obligatoire
2. `archive-confirm-sheet.tsx` — confirmer l'archivage (action irréversible)
3. `relance-sheet.tsx` — programmer une relance périodique (alerte J-7/J-3/J-1)

---

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Sheet destructif gauche (référence) | `src/app/[locale]/(pages)/modules/shop/page.tsx` (UnsubscribeSheet) |
| Types & constantes (M1-1) | `src/app/[locale]/(pages)/dossiers/_lib/dossiers-data.ts` |
| LoadingButton | `src/components/loading-button.tsx` |

---

## Règles métier confirmées

- **4 états** : en_cours, en_attente, suspendu, cloture
- **Clôture** : autorisée par le clerc ET le secrétaire (pas uniquement le notaire)
- **Suspendu** : peut durer des années (ex: retour titre foncier). Nécessite un motif clair.
- **Depuis suspendu** : on peut revenir en_cours ou en_attente, mais pas directement clôturer
- **Relances** : système d'alertes J-7, J-3, J-1 pour signatures, dépôts, retours fonciers

### Matrice de transitions
```typescript
const TRANSITIONS_AUTORISEES: Record<DossierStatus, DossierStatus[]> = {
  en_cours:   ["en_attente", "suspendu", "cloture"],
  en_attente: ["en_cours",   "suspendu", "cloture"],
  suspendu:   ["en_cours",   "en_attente"],    // pas de clôture directe depuis suspendu
  cloture:    [],                               // état terminal
}
```

### Motifs prédéfinis par transition (à proposer en chips)
```typescript
const MOTIFS_TRANSITION: Record<string, string[]> = {
  "en_cours->en_attente": [
    "Attente retour titre foncier",
    "Attente retour certificat d'inscription",
    "Pièce manquante",
    "Attente retour formalité foncière",
    "Autre",
  ],
  "en_cours->suspendu": [
    "Retour titre foncier (durée indéterminée)",
    "Litige en cours",
    "Décès d'une partie",
    "Demande client",
    "Autre",
  ],
  "en_attente->en_cours": [
    "Pièces reçues",
    "Retour formalité obtenu",
    "Condition remplie",
    "Autre",
  ],
  "en_attente->suspendu": [
    "Retour titre foncier (durée indéterminée)",
    "Blocage administratif prolongé",
    "Autre",
  ],
  "suspendu->en_cours": [
    "Titre foncier reçu",
    "Litige résolu",
    "Reprise demande client",
    "Autre",
  ],
  "suspendu->en_attente": [
    "Nouvelle pièce attendue",
    "Autre formalité en cours",
    "Autre",
  ],
  "any->cloture": [
    "Acte signé et formalités finalisées",
    "Honoraires encaissés",
    "Dossier complet clôturé",
    "Opération abandonnée",
    "Autre",
  ],
}
```

---

## Composant 1 — StatutTransitionSheet

**Type :** Sheet side="right", sm:max-w-md

### Props
```typescript
interface StatutTransitionSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (id: string, newStatus: DossierStatus, motif: string) => void
}
```

### Structure

```
┌──────────────────────────────────────────┐
│ HEADER                                   │
│  [↔] Changer le statut du dossier       │
│      Moussa NDIAYE / Awa DIOP           │
├──────────────────────────────────────────┤
│ BODY                                     │
│                                          │
│ ── Statut actuel ─────────────────────── │
│   [Badge statut coloré plein]            │
│                                          │
│ ── Nouveau statut ────────────────────── │
│   [Card état 1] [Card état 2]…           │
│   (grises si non autorisées)             │
│                                          │
│ ── Motifs suggérés ───────────────────── │
│   [Chip motif 1] [Chip motif 2]…         │
│   (chips cliquables)                     │
│                                          │
│ ── Motif personnalisé ────────────────── │
│   [Textarea] (pré-rempli au clic chip)   │
│                                          │
│ ── Information ───────────────────────── │
│   ℹ Horodatage · Traçabilité · Légal    │
├──────────────────────────────────────────┤
│ FOOTER                                   │
│ [Annuler]    [✓ Confirmer la transition] │
└──────────────────────────────────────────┘
```

### Cards de sélection du nouveau statut

```tsx
<div className="space-y-2">
  {(["en_cours", "en_attente", "suspendu", "cloture"] as DossierStatus[])
    .filter(s => s !== dossier.status)
    .map(s => {
      const allowed = TRANSITIONS_AUTORISEES[dossier.status].includes(s)
      const meta = STATUS_META[s]
      return (
        <button key={s} disabled={!allowed} onClick={() => setNewStatus(s)}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl border border-dashed p-4 text-left transition-all",
            !allowed && "opacity-25 cursor-not-allowed",
            allowed && newStatus === s  && "bg-foreground text-background border-foreground shadow",
            allowed && newStatus !== s  && "hover:bg-muted/50 cursor-pointer"
          )}>
          <span className={cn("h-3 w-3 rounded-full shrink-0",
            newStatus === s ? "bg-background" : meta.dot
          )} />
          <div className="flex-1">
            <p className={cn("text-sm font-semibold",
              newStatus === s ? "text-background" : "text-foreground"
            )}>{meta.label}</p>
            {!allowed && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Transition non autorisée depuis cet état
              </p>
            )}
          </div>
          {newStatus === s && <Check className="h-4 w-4 text-background shrink-0" />}
        </button>
      )
    })}
</div>
```

### Chips de motifs suggérés (apparaissent après sélection du statut)

```tsx
{newStatus && (
  <div className="space-y-2">
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      Motifs suggérés
    </p>
    <div className="flex flex-wrap gap-1.5">
      {getMotifs(dossier.status, newStatus).map(m => (
        <button key={m} onClick={() => setMotif(m)}
          className={cn(
            "rounded-full border border-dashed px-2.5 py-1 text-[11px] font-medium cursor-pointer transition-all",
            motif === m
              ? "bg-foreground text-background border-foreground"
              : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
          )}>
          {m}
        </button>
      ))}
    </div>
  </div>
)}
```

### Textarea motif

```tsx
<div className="space-y-1.5">
  <Label className="text-xs font-bold">
    Motif détaillé <span className="text-red-500">*</span>
    <span className="text-muted-foreground font-normal ml-1">(min. 10 caractères)</span>
  </Label>
  <Textarea placeholder="Décrivez la raison de cette transition…"
    value={motif} onChange={e => setMotif(e.target.value)}
    className="border-0 bg-muted resize-none min-h-[80px] text-sm" />
  {errors.motif && <p className="text-xs text-red-500">{errors.motif}</p>}
</div>
```

### Bloc information légale

```tsx
<div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3 space-y-1.5">
  {[
    "Horodatage automatique de la transition",
    "Votre identité sera enregistrée dans l'historique",
    "Action traçable — obligatoire pour conformité légale",
  ].map(t => (
    <p key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
      <Info className="h-3 w-3 shrink-0 text-blue-400" />{t}
    </p>
  ))}
</div>
```

---

## Composant 2 — ArchiveConfirmSheet

**Type :** Sheet side="left", sm:max-w-md (action grave → gauche)

### Props
```typescript
interface ArchiveConfirmSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (id: string) => void
}
```

> ⚠️ L'archivage n'est possible que si `status === "cloture"`.
> Le dossier passe en lecture seule permanente.

**Couleur d'avertissement : amber** (pas rouge — l'archivage est légal, pas destructif)

```tsx
{/* Bannière avertissement amber */}
<div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-4 space-y-2">
  <div className="flex items-center gap-2">
    <Archive className="h-4 w-4 text-amber-500 shrink-0" />
    <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
      Archivage définitif
    </p>
  </div>
  <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
    Ce dossier sera conservé en lecture seule conformément aux obligations légales
    des études notariales. Cette action est irréversible.
  </p>
</div>

{/* Récap dossier */}
<div className="rounded-lg border border-dashed bg-muted/30 px-4 py-4 space-y-2">
  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dossier concerné</p>
  <p className="text-xs font-mono text-muted-foreground">{dossier.reference}</p>
  <p className="text-sm font-semibold">{dossier.intitule}</p>
  <p className="text-xs text-muted-foreground">
    {dossier.montantPrevisionnel.toLocaleString("fr-FR")} FCFA · {FAMILLE_META[dossier.famille].label}
  </p>
</div>

{/* Ce que cela implique */}
<div className="space-y-2">
  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Implications</p>
  {[
    "Le dossier ne pourra plus être modifié",
    "Il restera consultable en lecture seule",
    "Un horodatage d'archivage sera enregistré",
    "Conforme aux obligations légales des études notariales",
  ].map(t => (
    <p key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="h-px w-3 bg-amber-300 dark:bg-amber-700 shrink-0" />{t}
    </p>
  ))}
</div>
```

**Footer :** `[Annuler ghost] [Archive Archiver définitivement default]`

---

## Composant 3 — RelanceSheet

**Type :** Sheet side="right", sm:max-w-md
Programmer une alerte de relance périodique pour un dossier (confirmé : relances nécessaires pour retours fonciers qui peuvent durer des années).

### Props
```typescript
interface RelanceSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (dossierId: string, alerte: Omit<Alerte, "id" | "dossierId">) => void
}
```

### Structure
```
HEADER : [Bell] Programmer une relance · Nom dossier

BODY :
── Type de relance ─────────────────────────────
  [Signature] [Dépôt enregistrement] [Publicité foncière]
  [Retour titre foncier] [Relance générale]

── Date d'échéance ─────────────────────────────
  [Input date] → calcule automatiquement J-7/J-3/J-1

── Alertes automatiques ────────────────────────
  ✓ Alerte J-7 (7 jours avant)   [toggle]
  ✓ Alerte J-3 (3 jours avant)   [toggle]
  ✓ Alerte J-1 (veille)          [toggle]

── Message personnalisé ────────────────────────
  [Textarea optionnel]

── Aperçu ──────────────────────────────────────
  Vous recevrez des alertes le :
  • J-7 : [date calculée]
  • J-3 : [date calculée]
  • J-1 : [date calculée]

FOOTER : [Annuler] [Bell Programmer la relance]
```

### Calcul des dates d'alerte
```typescript
const calcAlerteDates = (echeance: string) => {
  const d = new Date(echeance)
  return {
    j7: new Date(d.getTime() - 7 * 86400000).toISOString(),
    j3: new Date(d.getTime() - 3 * 86400000).toISOString(),
    j1: new Date(d.getTime() - 1 * 86400000).toISOString(),
  }
}
```

---

## Câblage dans page.tsx

```typescript
// États
const [statusDossier, setStatusDossier]     = React.useState<Dossier | null>(null)
const [statusOpen, setStatusOpen]           = React.useState(false)
const [archiveDossier, setArchiveDossier]   = React.useState<Dossier | null>(null)
const [archiveOpen, setArchiveOpen]         = React.useState(false)
const [relanceDossier, setRelanceDossier]   = React.useState<Dossier | null>(null)
const [relanceOpen, setRelanceOpen]         = React.useState(false)

// Handlers
const handleStatusChange = (id: string, newStatus: DossierStatus, motif: string) => {
  setDossiers(prev => prev.map(d =>
    d.id === id ? { ...d, status: newStatus, dateDerniereModif: new Date().toISOString() } : d
  ))
  toast.success(`Statut → ${STATUS_META[newStatus].label}`, { position: "bottom-right" })
}

const handleArchive = (id: string) => {
  setDossiers(prev => prev.map(d => d.id === id ? { ...d, status: "cloture" } : d))
  toast.success("Dossier archivé — lecture seule", { position: "bottom-right" })
}

const handleRelance = (dossierId: string, alerte: Omit<Alerte, "id" | "dossierId">) => {
  setDossiers(prev => prev.map(d => d.id === dossierId ? {
    ...d,
    alertesActives: [...d.alertesActives, { ...alerte, id: `alert-${Date.now()}`, dossierId }]
  } : d))
  toast.success("Relance programmée", { position: "bottom-right" })
}

// Guards menu contextuel
const openArchive = (d: Dossier) => {
  if (d.status !== "cloture") {
    toast.error("Seuls les dossiers clôturés peuvent être archivés")
    return
  }
  setArchiveDossier(d); setArchiveOpen(true)
}
```

---

## Output attendu

```
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/statut-transition-sheet.tsx
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/archive-confirm-sheet.tsx
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/relance-sheet.tsx

FONCTIONNALITÉS :
  ✓ 4 états dont Suspendu (confirmé métier)
  ✓ Matrice transitions (suspendu ne peut pas → cloture directement)
  ✓ Motifs suggérés en chips cliquables par transition
  ✓ Motif personnalisé textarea (min. 10 caractères)
  ✓ Bloc légal (horodatage, traçabilité)
  ✓ Archive : Sheet gauche amber, implications listées
  ✓ Guard archivage (dossier doit être clôturé)
  ✓ Relance : types (signature, foncier…), J-7/J-3/J-1 avec aperçu dates
  ✓ Câblage complet dans page.tsx
```
