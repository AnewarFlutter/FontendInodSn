# Agent M11-3 — Duplication Avancée

## Responsabilité

Créer `duplication-sheet.tsx` : duplication avancée d'un dossier complet, d'un acte ou d'un document.

**M1 a déjà :** `handleDuplicate` basique dans `page.tsx` (copie simple d'un dossier avec nouvelle référence).
**M11 ajoute :** Sheet dédiée avec options — type de duplication, destination, inclusion parties/biens/documents,
mode fiche partie (figée vs liée avec possibilité MAJ — Q28), fiche vierge pour métadonnées (Q30).

---

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Sheet référence (gauche destructive) | `src/app/[locale]/(pages)/modules/shop/page.tsx` (UnsubscribeSheet) |
| Types M1 | `src/app/[locale]/(pages)/dossiers/_lib/dossiers-data.ts` |
| Types M11 | `src/app/[locale]/(pages)/recherche/_lib/recherche-data.ts` |
| LoadingButton | `src/components/loading-button.tsx` |

---

## Règles métier confirmées

- **Fiche partie** (Q28) : possibilité de mettre à jour si informations changées (adresse, situation matrimoniale)
- **Duplication acte** (Q29) : opération fréquente, dossier de destination configurable
- **Métadonnées document** (Q30) : fiche vierge pour le document dans dossier destination (pas de conservation des métadonnées d'origine)

---

## Props

```typescript
interface DuplicationSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (options: DuplicationOptions) => void
  dossiersList: Dossier[]   // pour sélection destination
}
```

---

## Structure — Sheet side="right", sm:max-w-lg

```
┌──────────────────────────────────────────┐
│ HEADER                                   │
│  [Copy] Dupliquer un élément             │
│         Moussa NDIAYE / Awa DIOP         │
├──────────────────────────────────────────┤
│ BODY                                     │
│                                          │
│ ── Que souhaitez-vous dupliquer ? ─────  │
│   [Dossier complet] [Acte] [Document]    │
│   (3 cards sélectionnables)              │
│                                          │
│ ── Destination ────────────────────────  │
│   (●) Nouveau dossier (auto-référence)  │
│   (○) Dossier existant [Select…]        │
│                                          │
│ ── Options d'inclusion ────────────────  │
│   [✓] Inclure les parties               │
│   [✓] Inclure les biens                 │
│   [✓] Inclure les documents             │
│                                          │
│ ── Gestion des fiches parties ─────────  │
│   (●) Copie figée (version indépendante) │
│   (○) Liée — MAJ possible si changement │
│                                          │
│ ── Métadonnées documents ──────────────  │
│   [✓] Fiche vierge dans dossier dest.  │
│   ℹ Date réception / demande réinitialisée│
│                                          │
│ ── Récapitulatif ──────────────────────  │
│   [Card résumé de la duplication]        │
│                                          │
├──────────────────────────────────────────┤
│ FOOTER                                   │
│ [Annuler]    [Copy Dupliquer →]          │
└──────────────────────────────────────────┘
```

---

## Cards type de duplication

```tsx
{[
  {
    value: "dossier_complet",
    label: "Dossier complet",
    desc:  "Copie tous les paramètres, parties et biens",
    icon:  FolderCopy,
  },
  {
    value: "acte",
    label: "Acte",
    desc:  "Copie un acte vers un autre dossier",
    icon:  FileStack,
  },
  {
    value: "document",
    label: "Document",
    desc:  "Copie un document avec fiche vierge",
    icon:  Files,
  },
].map(opt => (
  <button
    key={opt.value}
    onClick={() => setType(opt.value as any)}
    className={cn(
      "flex items-start gap-3 rounded-xl border border-dashed p-4 text-left transition-all cursor-pointer w-full",
      type === opt.value
        ? "bg-foreground text-background border-foreground shadow"
        : "bg-muted/40 hover:bg-muted"
    )}
  >
    <opt.icon className={cn("h-4 w-4 mt-0.5 shrink-0",
      type === opt.value ? "text-background" : "text-muted-foreground"
    )} />
    <div>
      <p className={cn("text-sm font-semibold",
        type === opt.value ? "text-background" : "text-foreground"
      )}>{opt.label}</p>
      <p className={cn("text-[11px] mt-0.5",
        type === opt.value ? "text-background/60" : "text-muted-foreground"
      )}>{opt.desc}</p>
    </div>
    {type === opt.value && <Check className="h-4 w-4 text-background ml-auto shrink-0 mt-0.5" />}
  </button>
))}
```

---

## Sélection destination

```tsx
<div className="space-y-3">
  {[
    { value: "nouveau_dossier",   label: "Nouveau dossier",    desc: "Référence générée automatiquement" },
    { value: "dossier_existant",  label: "Dossier existant",   desc: "Choisir parmi les dossiers en cours" },
  ].map(opt => (
    <label key={opt.value}
      className="flex items-center gap-3 rounded-xl border border-dashed p-4 cursor-pointer hover:bg-muted/50 transition-colors">
      <input type="radio" name="destination" value={opt.value}
        checked={destination === opt.value}
        onChange={() => setDestination(opt.value as any)}
        className="accent-foreground" />
      <div>
        <p className="text-sm font-semibold">{opt.label}</p>
        <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
      </div>
    </label>
  ))}

  {/* Select dossier existant */}
  {destination === "dossier_existant" && (
    <div className="space-y-1.5 pl-1">
      <Label className="text-xs font-bold">Dossier de destination</Label>
      <Select value={dossierDestId} onValueChange={setDossierDestId}>
        <SelectTrigger className="border-0 bg-muted h-9 text-sm">
          <SelectValue placeholder="Sélectionner un dossier…" />
        </SelectTrigger>
        <SelectContent>
          {dossiersList
            .filter(d => d.id !== dossier?.id && d.status !== "cloture")
            .map(d => (
              <SelectItem key={d.id} value={d.id}>
                <span className="font-mono text-xs text-muted-foreground mr-2">{d.reference}</span>
                {d.intitule}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )}
</div>
```

---

## Options inclusion

```tsx
{[
  { key: "inclureParties",    label: "Inclure les parties",   desc: "Noms, contacts, références" },
  { key: "inclureBiens",      label: "Inclure les biens",     desc: "Biens immobiliers, TF, cadastre" },
  { key: "inclureDocuments",  label: "Inclure les documents", desc: "Avec fiche vierge dans destination" },
].map(opt => (
  <label key={opt.key}
    className="flex items-center gap-3 rounded-xl border border-dashed px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors">
    <div className={cn(
      "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
      options[opt.key as keyof typeof options]
        ? "bg-foreground border-foreground"
        : "border-muted-foreground/40"
    )}>
      {options[opt.key as keyof typeof options] && <Check className="h-3 w-3 text-background" />}
    </div>
    <input type="checkbox" className="sr-only"
      checked={options[opt.key as keyof typeof options] as boolean}
      onChange={e => setOptions(p => ({ ...p, [opt.key]: e.target.checked }))} />
    <div>
      <p className="text-sm font-semibold">{opt.label}</p>
      <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
    </div>
  </label>
))}
```

---

## Mode fiche partie (Q28)

```tsx
{options.inclureParties && (
  <div className="space-y-2 pl-1">
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      Gestion des fiches parties
    </p>
    {[
      {
        value: "copier_fige",
        label: "Copie figée",
        desc:  "Version indépendante — les modifications futures n'affectent pas ce dossier",
      },
      {
        value: "lier_et_maj",
        label: "Liée avec mise à jour possible",
        desc:  "Fiche partagée — possibilité de MAJ si adresse ou situation matrimoniale change (Q28)",
      },
    ].map(opt => (
      <label key={opt.value}
        className="flex items-center gap-3 rounded-xl border border-dashed p-3 cursor-pointer hover:bg-muted/40 transition-colors">
        <input type="radio" name="modePartie" value={opt.value}
          checked={modePartie === opt.value}
          onChange={() => setModePartie(opt.value as any)}
          className="accent-foreground" />
        <div>
          <p className="text-xs font-semibold">{opt.label}</p>
          <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
        </div>
      </label>
    ))}
  </div>
)}
```

---

## Bloc métadonnées (Q30 : fiche vierge)

```tsx
{options.inclureDocuments && (
  <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3 space-y-1.5">
    <div className="flex items-center gap-2">
      <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
      <p className="text-xs font-semibold">Métadonnées des documents</p>
    </div>
    <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
      Les documents dupliqués repartent d'une fiche vierge dans le dossier de destination.
      La date de réception et la date de demande d'origine ne sont pas conservées. (Q30)
    </p>
  </div>
)}
```

---

## Récapitulatif avant confirmation

```tsx
<div className="rounded-xl border border-dashed bg-muted/30 px-4 py-4 space-y-2">
  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Récapitulatif</p>
  {[
    { label: "Source",      value: dossier?.reference + " — " + dossier?.intitule },
    { label: "Type",        value: type === "dossier_complet" ? "Dossier complet" : type === "acte" ? "Acte" : "Document" },
    { label: "Destination", value: destination === "nouveau_dossier" ? "Nouveau dossier (auto)" : dossiersList.find(d => d.id === dossierDestId)?.reference ?? "—" },
    { label: "Parties",     value: options.inclureParties ? (modePartie === "lier_et_maj" ? "Liées (MAJ possible)" : "Copie figée") : "Non incluses" },
    { label: "Biens",       value: options.inclureBiens ? "Inclus" : "Non inclus" },
    { label: "Documents",   value: options.inclureDocuments ? "Inclus (fiche vierge)" : "Non inclus" },
  ].map(row => (
    <div key={row.label} className="flex items-start justify-between gap-3 text-xs">
      <span className="text-muted-foreground font-medium shrink-0">{row.label}</span>
      <span className="font-semibold text-right">{row.value}</span>
    </div>
  ))}
</div>
```

---

## Câblage dans dossiers/page.tsx

```typescript
// Nouveaux états (complément de handleDuplicate M1)
const [dupliqueOpen, setDupliqueOpen]     = React.useState(false)
const [dupliqueDossier, setDupliqueDossier] = React.useState<Dossier | null>(null)

// Handler avancé (M11 remplace handleDuplicate de M1 via ce sheet)
const handleDuplicationAvancee = (options: DuplicationOptions) => {
  const source = dossiers.find(d => d.id === options.sourceId)
  if (!source) return

  const copy: Dossier = {
    ...source,
    id:           `dos-${Date.now()}`,
    reference:    generateReference(source.famille),
    intitule:     `${source.intitule} (copie)`,
    status:       "en_cours",
    dateCreation: new Date().toISOString(),
    dateDerniereModif: new Date().toISOString(),
    sousDossiers:      options.inclureDocuments ? source.sousDossiers : [],
    nombreSousDossiers: 0,
    alertesActives:     [],
  }
  setDossiers(prev => [copy, ...prev])
  toast.success("Duplication effectuée — " + copy.reference, { position: "bottom-right" })
}

// Dans le menu contextuel, remplacer onDuplicate basique par onDuplication:
// onClick={() => { setDupliqueDossier(d); setDupliqueOpen(true) }}
```

---

## Output attendu

```
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/duplication-sheet.tsx
MODIFIÉ : src/app/[locale]/(pages)/dossiers/page.tsx
  → ajout états dupliqueOpen / dupliqueDossier
  → ajout handleDuplicationAvancee
  → menu contextuel → DuplicationSheet
  → import DuplicationSheet

FONCTIONNALITÉS :
  ✓ 3 types duplication : dossier_complet, acte, document
  ✓ Destination : nouveau dossier (auto) ou dossier existant (Select)
  ✓ Options : parties, biens, documents (checkboxes)
  ✓ Mode partie : figée vs liée-MAJ (Q28)
  ✓ Fiche vierge métadonnées documents (Q30)
  ✓ Récapitulatif avant confirmation
  ✓ Toast confirmation avec référence générée
```
