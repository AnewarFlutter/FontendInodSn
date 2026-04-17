# Agent M11-4 — Impression & Export (PDF, QR Code, CSV)

## Responsabilité

Créer `impression-sheet.tsx` : Sheet de configuration impression/export pour un dossier.
Gère : type de document, format (PDF/Excel/CSV), en-tête étude, code QR, aperçu colonnes CSV.

**M1 n'a pas** de fonctionnalité d'impression/export (juste `handleExport` toast mock).
**M11 crée** une UI complète avec options configurables.

---

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Sheet référence | `src/app/[locale]/(pages)/modules/shop/page.tsx` |
| Types M1 | `src/app/[locale]/(pages)/dossiers/_lib/dossiers-data.ts` |
| Types M11 | `src/app/[locale]/(pages)/recherche/_lib/recherche-data.ts` |
| LoadingButton | `src/components/loading-button.tsx` |

---

## Règles métier confirmées

- **Tous les documents imprimés** (Q31) : acte, expéditions, courriers, bordereaux, notes de frais
- **Papier en-tête** (Q32) : pour courriers et attestations uniquement
- **Code QR** (Q33) : pas encore en place mais utile pour rattacher les scans automatiquement
- **Export Excel/CSV** (Q34) : pour états et reporting en dehors du logiciel

---

## Props

```typescript
interface ImpressionSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (options: ImpressionOptions) => void
}
```

---

## Structure — Sheet side="right", sm:max-w-lg

```
┌──────────────────────────────────────────┐
│ HEADER                                   │
│  [Printer] Impression & Export           │
│            Moussa NDIAYE / Awa DIOP      │
├──────────────────────────────────────────┤
│ BODY                                     │
│                                          │
│ ── Type de document ───────────────────  │
│   [Acte complet] [Expédition] [Courrier] │
│   [Attestation]  [Bordereau dépôt]       │
│   [Note de frais][Fiche récapitulatif]   │
│                                          │
│ ── Format de sortie ───────────────────  │
│   [PDF] [Excel] [CSV]                    │
│                                          │
│ ── Options ────────────────────────────  │
│   [✓] En-tête officielle de l'étude      │
│       (courriers et attestations)        │
│   [✓] Code QR de rattachement            │
│       (scan auto des actes retournés)    │
│                                          │
│ ── Colonnes CSV (si format CSV) ───────  │
│   [✓] Référence [✓] Intitulé            │
│   [✓] Famille   [✓] Statut              │
│   [✓] Notaire   [✓] Clerc               │
│   [✓] Date sig. [✓] Montant             │
│                                          │
│ ── Aperçu QR Code ─────────────────────  │
│   [Carré QR stylisé] Réf + Dossier ID   │
│                                          │
│ ── Information légale ─────────────────  │
│   ℹ Document généré horodaté            │
│   ℹ Format juridique préservé           │
│                                          │
├──────────────────────────────────────────┤
│ FOOTER                                   │
│ [Annuler]   [Printer Générer →]          │
└──────────────────────────────────────────┘
```

---

## Cards type de document (Q31)

```tsx
const TYPES_IMPRESSION: { value: TypeImpression; label: string; desc: string; avecEnTete: boolean }[] = [
  { value: "acte_complet",        label: "Acte complet",         desc: "L'acte notarié dans son intégralité",          avecEnTete: false },
  { value: "expedition",          label: "Expédition",           desc: "Copie authentique signée du notaire",           avecEnTete: false },
  { value: "courrier",            label: "Courrier",             desc: "Sur papier à en-tête de l'étude",               avecEnTete: true  },
  { value: "attestation",         label: "Attestation",          desc: "Attestation officielle sur papier en-tête",     avecEnTete: true  },
  { value: "bordereau_depot",     label: "Bordereau de dépôt",   desc: "Bordereau pour dépôt enregistrement/foncier",   avecEnTete: false },
  { value: "note_frais",          label: "Note de frais",        desc: "Note d'honoraires et frais",                    avecEnTete: false },
  { value: "fiche_recapitulatif", label: "Fiche récapitulatif",  desc: "Résumé exportable du dossier",                  avecEnTete: false },
]

// Grille 2 colonnes
<div className="grid grid-cols-2 gap-2">
  {TYPES_IMPRESSION.map(opt => (
    <button key={opt.value}
      onClick={() => {
        setTypeDoc(opt.value)
        // Auto-activer en-tête si le type l'exige (Q32)
        if (opt.avecEnTete) setAvecEnTete(true)
      }}
      className={cn(
        "flex flex-col items-start gap-1 rounded-xl border border-dashed p-3 text-left transition-all cursor-pointer",
        typeDoc === opt.value
          ? "bg-foreground text-background border-foreground shadow"
          : "bg-muted/40 hover:bg-muted"
      )}
    >
      <p className={cn("text-xs font-semibold",
        typeDoc === opt.value ? "text-background" : "text-foreground"
      )}>{opt.label}</p>
      <p className={cn("text-[10px] leading-relaxed",
        typeDoc === opt.value ? "text-background/60" : "text-muted-foreground"
      )}>{opt.desc}</p>
      {opt.avecEnTete && (
        <span className={cn(
          "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
          typeDoc === opt.value
            ? "bg-background/20 text-background"
            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        )}>En-tête officielle</span>
      )}
    </button>
  ))}
</div>
```

---

## Sélection format

```tsx
<div className="flex gap-2">
  {(["pdf","excel","csv"] as FormatExport[]).map(fmt => {
    const meta = {
      pdf:   { label: "PDF",   icon: FileType,   desc: "Mise en forme juridique" },
      excel: { label: "Excel", icon: Sheet,       desc: "Tableur pour reporting" },
      csv:   { label: "CSV",   icon: FileText,    desc: "Données brutes" },
    }[fmt]
    return (
      <button key={fmt}
        onClick={() => setFormat(fmt)}
        className={cn(
          "flex-1 flex flex-col items-center gap-1.5 rounded-xl border border-dashed py-3 px-2 text-center transition-all cursor-pointer",
          format === fmt
            ? "bg-foreground text-background border-foreground shadow"
            : "bg-muted/40 hover:bg-muted"
        )}
      >
        <meta.icon className={cn("h-4 w-4", format === fmt ? "text-background" : "text-muted-foreground")} />
        <p className={cn("text-xs font-bold", format === fmt ? "text-background" : "text-foreground")}>
          {meta.label}
        </p>
        <p className={cn("text-[10px]", format === fmt ? "text-background/60" : "text-muted-foreground")}>
          {meta.desc}
        </p>
      </button>
    )
  })}
</div>
```

---

## Options en-tête + QR Code

```tsx
{[
  {
    key:   "avecEnTete",
    label: "En-tête officielle de l'étude",
    desc:  "Pour courriers et attestations — papier à en-tête pré-imprimé (Q32)",
    disabled: !["courrier","attestation"].includes(typeDoc),
    disabledMsg: "Disponible uniquement pour courriers et attestations",
  },
  {
    key:   "avecQRCode",
    label: "Code QR de rattachement",
    desc:  "Permet de rattacher automatiquement les actes et courriers scannés (Q33)",
    disabled: format !== "pdf",
    disabledMsg: "Disponible uniquement en format PDF",
  },
].map(opt => {
  const val = opt.key === "avecEnTete" ? avecEnTete : avecQRCode
  const setter = opt.key === "avecEnTete" ? setAvecEnTete : setAvecQRCode
  return (
    <div key={opt.key}
      className={cn(
        "rounded-xl border border-dashed px-4 py-3 space-y-1.5 transition-opacity",
        opt.disabled && "opacity-40"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{opt.label}</p>
          <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
        </div>
        <Switch
          checked={val && !opt.disabled}
          onCheckedChange={v => !opt.disabled && setter(v)}
          disabled={opt.disabled}
        />
      </div>
      {opt.disabled && (
        <p className="text-[10px] text-muted-foreground italic">{opt.disabledMsg}</p>
      )}
    </div>
  )
})}
```

---

## Sélection colonnes CSV (Q34)

```tsx
{format === "csv" && (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Colonnes à exporter
      </p>
      <button onClick={() => setColonnes(COLONNES_EXPORT_CSV.map(c => c.key))}
        className="text-[10px] text-blue-500 font-semibold cursor-pointer hover:underline">
        Tout sélectionner
      </button>
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      {COLONNES_EXPORT_CSV.map(col => (
        <label key={col.key}
          className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 cursor-pointer hover:bg-muted/40 transition-colors">
          <div className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
            colonnes.includes(col.key)
              ? "bg-foreground border-foreground"
              : "border-muted-foreground/40"
          )}>
            {colonnes.includes(col.key) && <Check className="h-2.5 w-2.5 text-background" />}
          </div>
          <input type="checkbox" className="sr-only"
            checked={colonnes.includes(col.key)}
            onChange={e => setColonnes(prev =>
              e.target.checked ? [...prev, col.key] : prev.filter(k => k !== col.key)
            )} />
          <span className="text-xs font-medium">{col.label}</span>
        </label>
      ))}
    </div>
  </div>
)}
```

---

## Aperçu QR Code (Q33)

```tsx
{avecQRCode && format === "pdf" && dossier && (
  <div className="space-y-2">
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      Aperçu code QR
    </p>
    <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-4 flex items-center gap-4">
      {/* Simulation visuelle QR Code — carré SVG pixelisé */}
      <div className="h-16 w-16 shrink-0 rounded-lg border-2 border-foreground/20 bg-white p-1.5">
        <svg viewBox="0 0 21 21" className="h-full w-full">
          {/* Coins positionnement */}
          <rect x="0" y="0" width="7" height="7" fill="none" stroke="black" strokeWidth="1" />
          <rect x="1" y="1" width="5" height="5" fill="black" />
          <rect x="14" y="0" width="7" height="7" fill="none" stroke="black" strokeWidth="1" />
          <rect x="15" y="1" width="5" height="5" fill="black" />
          <rect x="0" y="14" width="7" height="7" fill="none" stroke="black" strokeWidth="1" />
          <rect x="1" y="15" width="5" height="5" fill="black" />
          {/* Points data simulés */}
          {[9,11,13,9,11,13,9,11].map((x, i) => (
            <rect key={i} x={x} y={9 + i * 1.2} width="1" height="1" fill="black" />
          ))}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold">{dossier.reference}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono break-all">
          {dossier.intitule}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          Généré le {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>
    </div>
    <p className="text-[10px] text-muted-foreground">
      Le scan de ce code QR permettra de rattacher automatiquement le document numérisé au dossier.
    </p>
  </div>
)}
```

---

## Câblage dans dossiers/page.tsx

```typescript
const [impressionOpen, setImpressionOpen]     = React.useState(false)
const [impressionDossier, setImpressionDossier] = React.useState<Dossier | null>(null)

const handleImpression = (options: ImpressionOptions) => {
  const typeLabel = options.type.replace(/_/g, " ")
  const formatLabel = options.format.toUpperCase()
  toast.success(
    `${typeLabel} — ${formatLabel} en cours de génération…`,
    { position: "bottom-right" }
  )
}

// Menu contextuel :
// <DropdownMenuItem onClick={() => { setImpressionDossier(d); setImpressionOpen(true) }}>
//   <Printer className="h-4 w-4 mr-2" /> Impression & Export
// </DropdownMenuItem>
```

---

## Output attendu

```
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/impression-sheet.tsx
MODIFIÉ : src/app/[locale]/(pages)/dossiers/page.tsx
  → états impressionOpen / impressionDossier
  → handleImpression
  → menu contextuel → ImpressionSheet

FONCTIONNALITÉS :
  ✓ 7 types de documents (acte, expédition, courrier, attestation, bordereau, note frais, fiche recap)
  ✓ Badge "En-tête officielle" sur courrier/attestation (Q32)
  ✓ 3 formats : PDF, Excel, CSV (Q34)
  ✓ Switch en-tête étude (désactivé si pas courrier/attestation)
  ✓ Switch code QR (désactivé si pas PDF) — Q33
  ✓ Sélection colonnes CSV avec toggle "Tout sélectionner"
  ✓ Aperçu QR Code SVG avec référence et date
  ✓ Toast génération avec type + format
```
