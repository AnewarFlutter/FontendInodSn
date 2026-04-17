# Agent M1-3 — Formulaire Création & Paramétrage Dossier

## Responsabilité

Créer `_components/create-dossier-sheet.tsx` : Sheet side="right" pour créer/modifier un dossier.
Sélection en **2 étapes** : famille → type. Intitulé en "Prénom Nom / Prénom Nom".
Référence générée automatiquement par l'application.

---

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Design Sheet référence | `src/app/[locale]/(pages)/modules/shop/page.tsx` |
| Types & constantes (M1-1) | `src/app/[locale]/(pages)/dossiers/_lib/dossiers-data.ts` |
| LoadingButton | `src/components/loading-button.tsx` |

---

## Interface du composant

```typescript
interface CreateDossierSheetProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (data: CreateDossierPayload) => void
  dossier?: Dossier | null     // mode édition si fourni
  parentId?: string             // sous-dossier si fourni
}

interface CreateDossierPayload {
  intitule: string
  famille: FamilleDossier
  typeOperation: TypeOperation
  conditionSuspensive?: ConditionSuspensive
  notaire: string
  clerc: string
  dateSignaturePrevue: string
  montantPrevisionnel: number
  parentId?: string
}
```

---

## Structure visuelle — Sheet side="right" sm:max-w-lg

```
┌──────────────────────────────────────────┐
│ HEADER                                   │
│  📁 Nouveau dossier notarial             │
│     Remplissez les informations ci-dessous│
├──────────────────────────────────────────┤
│ BODY (overflow-y-auto, space-y-6)        │
│                                          │
│ ── ÉTAPE 1 : FAMILLE ─────────────────── │
│  [Droit Immobilier] [Droit Famille]      │
│  [Droit Entreprise] [Divers]             │
│  (4 cards colorées, 2×2)                 │
│                                          │
│ ── ÉTAPE 2 : TYPE D'OPÉRATION ─────────  │
│  (apparaît après sélection famille)      │
│  Liste scrollable des types de la famille│
│  avec searchbox interne                  │
│                                          │
│ ── IDENTIFICATION ─────────────────────  │
│  Intitulé (Prénom Nom / Prénom Nom)      │
│  Condition suspensive (switch + champ)   │
│                                          │
│ ── AFFECTATION ────────────────────────  │
│  Notaire (Select)   Clerc (Select)       │
│                                          │
│ ── PLANIFICATION ──────────────────────  │
│  Date signature prévue                   │
│  Montant prévisionnel (FCFA live format) │
│                                          │
│  [Si parentId → bannière sous-dossier]   │
├──────────────────────────────────────────┤
│ FOOTER                                   │
│ [Annuler]   [Créer le dossier →]         │
└──────────────────────────────────────────┘
```

---

## Étape 1 — Sélection famille (4 cards)

```tsx
<div className="grid grid-cols-2 gap-3">
  {(Object.entries(FAMILLE_META) as [FamilleDossier, typeof FAMILLE_META[FamilleDossier]][]).map(([key, meta]) => (
    <button key={key} onClick={() => { setFamille(key); setTypeOperation("") }}
      className={cn(
        "flex flex-col items-start gap-1.5 rounded-xl border border-dashed p-4 text-left transition-all cursor-pointer",
        famille === key
          ? "bg-foreground text-background border-foreground shadow"
          : "bg-muted/40 hover:bg-muted"
      )}>
      <div className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full shrink-0", famille === key ? "bg-background" : meta.dot)} />
        <span className={cn("text-sm font-bold", famille === key ? "text-background" : "text-foreground")}>
          {meta.label}
        </span>
      </div>
      <p className={cn("text-[11px] leading-relaxed", famille === key ? "text-background/60" : "text-muted-foreground")}>
        {meta.description}
      </p>
    </button>
  ))}
</div>
```

---

## Étape 2 — Sélection type d'opération

Apparaît uniquement quand une famille est sélectionnée. Liste scrollable avec barre de recherche interne.

```tsx
{famille && (
  <div className="space-y-2">
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
      <Input placeholder="Filtrer les types…" value={typeSearch} onChange={e => setTypeSearch(e.target.value)}
        className="pl-8 h-8 border-0 bg-muted/50 text-xs" />
    </div>
    <div className="max-h-48 overflow-y-auto rounded-lg border border-dashed divide-y divide-dashed">
      {TYPES_PAR_FAMILLE[famille]
        .filter(t => t.label.toLowerCase().includes(typeSearch.toLowerCase()))
        .map(t => (
          <button key={t.value} onClick={() => setTypeOperation(t.value)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 text-left text-sm transition-colors cursor-pointer",
              typeOperation === t.value
                ? "bg-foreground text-background"
                : "hover:bg-muted/50"
            )}>
            <span className={typeOperation === t.value ? "text-background font-semibold" : "text-foreground"}>
              {t.label}
            </span>
            {typeOperation === t.value && <Check className="h-3.5 w-3.5 text-background shrink-0" />}
          </button>
        ))}
    </div>
    {errors.typeOperation && <p className="text-xs text-red-500">{errors.typeOperation}</p>}
  </div>
)}
```

---

## Champ Intitulé

Format attendu : **"Prénom Nom partie1 / Prénom Nom partie2"**

```tsx
<div className="space-y-1.5">
  <Label className="text-xs font-bold">Intitulé du dossier <span className="text-red-500">*</span></Label>
  <Input
    placeholder="ex: Moussa NDIAYE / Awa DIOP"
    value={intitule}
    onChange={e => setIntitule(e.target.value)}
    className="border-0 bg-muted"
  />
  <p className="text-[10px] text-muted-foreground">Format : Prénom Nom partie 1 / Prénom Nom partie 2</p>
  {errors.intitule && <p className="text-xs text-red-500">{errors.intitule}</p>}
</div>
```

---

## Condition suspensive (confirmé métier)

Pour les opérations de vente et crédit, possibilité d'indiquer une condition suspensive :

```tsx
<div className="rounded-lg border border-dashed px-4 py-3 space-y-3">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold">Condition suspensive</p>
      <p className="text-[11px] text-muted-foreground">L'acte ne peut être réalisé que si la condition est remplie</p>
    </div>
    <Switch checked={conditionSuspensive} onCheckedChange={setConditionSuspensive} />
  </div>
  {conditionSuspensive && (
    <div className="space-y-2 pt-1 border-t border-dashed">
      <Label className="text-xs font-bold">Motif</Label>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { v: "pret_bancaire", label: "Prêt bancaire" },
          { v: "obtention_permis", label: "Permis de construire" },
          { v: "autre", label: "Autre" },
        ].map(m => (
          <button key={m.v} onClick={() => setMotifCondition(m.v as any)}
            className={cn(
              "rounded-lg border border-dashed px-2 py-1.5 text-[11px] font-semibold cursor-pointer transition-all",
              motifCondition === m.v ? "bg-foreground text-background" : "bg-muted/40 hover:bg-muted"
            )}>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
```

---

## Sélection Notaire / Clerc

```tsx
<div className="grid grid-cols-2 gap-3">
  <div className="space-y-1.5">
    <Label className="text-xs font-bold">Notaire responsable <span className="text-red-500">*</span></Label>
    <Select value={notaire} onValueChange={setNotaire}>
      <SelectTrigger className="border-0 bg-muted h-9 text-sm">
        <SelectValue placeholder="Sélectionner…" />
      </SelectTrigger>
      <SelectContent>
        {MOCK_NOTAIRES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
      </SelectContent>
    </Select>
    {errors.notaire && <p className="text-xs text-red-500">{errors.notaire}</p>}
  </div>
  <div className="space-y-1.5">
    <Label className="text-xs font-bold">Clerc en charge <span className="text-red-500">*</span></Label>
    <Select value={clerc} onValueChange={setClerc}>
      <SelectTrigger className="border-0 bg-muted h-9 text-sm">
        <SelectValue placeholder="Sélectionner…" />
      </SelectTrigger>
      <SelectContent>
        {MOCK_CLERCS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
      </SelectContent>
    </Select>
    {errors.clerc && <p className="text-xs text-red-500">{errors.clerc}</p>}
  </div>
</div>
```

---

## Champ Montant — formatage FCFA live

```tsx
<div className="relative">
  <Input type="text" placeholder="0"
    value={montantDisplay}
    onChange={e => {
      const raw = e.target.value.replace(/\s/g, "").replace(/\D/g, "")
      setMontant(Number(raw))
      setMontantDisplay(Number(raw).toLocaleString("fr-FR"))
    }}
    className="border-0 bg-muted pr-14" />
  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">FCFA</span>
</div>
```

---

## Bannière sous-dossier (si parentId fourni)

```tsx
{parentId && (
  <div className="flex items-center gap-3 rounded-xl border border-dashed border-purple-300
                  bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20 px-4 py-3">
    <GitBranch className="h-4 w-4 text-purple-500 shrink-0" />
    <div>
      <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">Sous-dossier rattaché</p>
      <p className="text-[11px] text-purple-600/70">Ce dossier sera lié au dossier parent.</p>
    </div>
  </div>
)}
```

---

## Validation

```typescript
const validate = (): boolean => {
  const e: Record<string, string> = {}
  if (!famille)                          e.famille = "Sélectionnez une famille"
  if (!typeOperation)                    e.typeOperation = "Sélectionnez un type d'opération"
  if (!intitule.trim() || intitule.trim().length < 5) e.intitule = "Intitulé trop court (min. 5 caractères)"
  if (!notaire)                          e.notaire = "Sélectionnez un notaire"
  if (!clerc)                            e.clerc = "Sélectionnez un clerc"
  if (!dateSignature)                    e.dateSignature = "Date requise"
  if (montant <= 0)                      e.montant = "Montant invalide"
  setErrors(e)
  return Object.keys(e).length === 0
}
```

---

## Sections visuelles

Chaque section est séparée par un titre :
```tsx
<div className="space-y-3">
  <div className="flex items-center gap-2 pb-1 border-b border-dashed">
    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      Étape 1 — Famille
    </span>
  </div>
  {/* contenu */}
</div>
```

---

## Output attendu

```
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/create-dossier-sheet.tsx

FONCTIONNALITÉS :
  ✓ Sélection famille en 2×2 cards colorées
  ✓ Sélection type avec filtre interne scrollable
  ✓ Intitulé "Prénom Nom / Prénom Nom" avec hint format
  ✓ Condition suspensive (switch + motif)
  ✓ Notaire / Clerc (Select listes mock)
  ✓ Date signature
  ✓ Montant FCFA avec formatage live
  ✓ Bannière sous-dossier si parentId
  ✓ Validation complète avec messages
  ✓ Mode édition (pré-remplissage si dossier fourni)
  ✓ Reset complet à la fermeture
```
