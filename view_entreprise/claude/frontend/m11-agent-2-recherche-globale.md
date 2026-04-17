# Agent M11-2 — Recherche Globale Multicritère

## Responsabilité

Créer la page `/recherche` avec :
1. Formulaire de recherche multicritère (dossier + partie + bien + acte)
2. Résultats avec score de similarité (fuzzy matching)
3. Recherches sauvegardées (raccourcis personnels)
4. Filtres par catégorie et période

**M1 a déjà :** recherche simple dans `page.tsx` (filtre sur intitulé/référence/notaire/clerc).
**M11 ajoute :** recherche globale dédiée avec critères biens (TF, cadastre), parties (CNI), actes, fuzzy matching, sauvegarde.

---

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Design référence shop | `src/app/[locale]/(pages)/modules/shop/page.tsx` |
| Types M1 | `src/app/[locale]/(pages)/dossiers/_lib/dossiers-data.ts` |
| Types M11 | `src/app/[locale]/(pages)/recherche/_lib/recherche-data.ts` |
| LoadingButton | `src/components/loading-button.tsx` |
| Routes | `src/shared/constants/routes.ts` |

---

## Règles métier confirmées

- **Critères très variés** (Q23) : dossier + parties + biens (TF très fréquent, Q24) + actes
- **Fuzzy matching** (Q25) : NDIAYE / NDAYE / N'DIAYE → proposer correspondances proches
- **Recherches sauvegardées** (Q26) : raccourcis "Mes ventes en cours" accessibles en 1 clic
- **Multicritère + période** (Q27) : Vente + en_cours + clerc + date début/fin

---

## Structure de la page

```
┌──────────────────────────────────────────────────────┐
│ BREADCRUMB                                           │
│ Dossiers Notariaux > Recherche globale              │
├──────────────────────────────────────────────────────┤
│ HEADER                                               │
│ 🔍 Recherche globale     [+ Sauvegarder] [Réinitialiser] │
│ Recherchez parmi tous les dossiers, parties, biens  │
├──────────────────────────────────────────────────────┤
│ RACCOURCIS SAUVEGARDÉS (chips cliquables)            │
│ [⭐ Mes ventes en cours] [⭐ TF en attente] [+ Ajouter] │
├──────────────────────────────────────────────────────┤
│ FORMULAIRE CRITÈRES (accordion par catégorie)        │
│                                                      │
│ ▼ DOSSIER                                           │
│   [Intitulé/Noms]  [Référence]  [Statut▼]           │
│   [Famille▼]       [Notaire▼]   [Clerc▼]            │
│   [Date début]     [Date fin]                       │
│                                                      │
│ ▼ PARTIE (client)                                   │
│   [Nom/Prénom]     [Raison sociale]  [N° CNI]       │
│                                                      │
│ ▼ BIEN (immobilier)                                 │
│   [Adresse]  [N° Titre Foncier]  [Réf. cadastrale]  │
│                                                      │
│ ▼ ACTE                                              │
│   [Type acte▼]   [Date acte]   [N° acte]            │
│                                                      │
│              [🔍 Lancer la recherche]                │
├──────────────────────────────────────────────────────┤
│ RÉSULTATS                                            │
│ Onglets: [Tous (14)] [Dossiers (8)] [Parties (3)]   │
│          [Biens (2)]  [Actes (1)]                    │
│                                                      │
│ [ResultCard] [ResultCard] [ResultCard]               │
│ [ResultCard] [ResultCard] [ResultCard]               │
└──────────────────────────────────────────────────────┘
```

---

## Composant RechercheForm

```tsx
// Accordion par catégorie, chaque section s'ouvre/ferme
<div className="space-y-3">
  {[
    { key: "dossier", label: "Dossier", icon: Folder },
    { key: "partie",  label: "Partie (client)", icon: Users },
    { key: "bien",    label: "Bien immobilier", icon: MapPin },
    { key: "acte",    label: "Acte", icon: FileText },
  ].map(cat => (
    <div key={cat.key} className="rounded-xl border border-dashed">
      <button
        onClick={() => toggleSection(cat.key)}
        className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <cat.icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{cat.label}</span>
          {getActiveCriteres(cat.key) > 0 && (
            <span className="rounded-full bg-blue-500/15 text-blue-600 text-[10px] px-1.5 py-0.5 font-bold">
              {getActiveCriteres(cat.key)}
            </span>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform",
          openSections[cat.key] && "rotate-180"
        )} />
      </button>
      {openSections[cat.key] && (
        <div className="px-5 pb-4 pt-1 border-t border-dashed space-y-3">
          {/* champs selon catégorie */}
        </div>
      )}
    </div>
  ))}
</div>
```

### Section Dossier

```tsx
<div className="grid grid-cols-2 gap-3">
  <div className="col-span-2 space-y-1.5">
    <Label className="text-xs font-bold">Intitulé / Noms des parties</Label>
    <Input placeholder="ex: NDIAYE, Moussa…" value={criteres.intitule}
      onChange={e => setCriteres(p => ({ ...p, intitule: e.target.value }))}
      className="border-0 bg-muted h-9 text-sm" />
    {/* Indicateur fuzzy */}
    {criteres.intitule && (
      <p className="text-[10px] text-blue-500 flex items-center gap-1">
        <Sparkles className="h-3 w-3" />
        Recherche approximative activée (NDIAYE ≈ NDAYE ≈ N'DIAYE)
      </p>
    )}
  </div>
  <div className="space-y-1.5">
    <Label className="text-xs font-bold">Référence dossier</Label>
    <Input placeholder="ex: IMM-2024-1042" value={criteres.reference}
      onChange={e => setCriteres(p => ({ ...p, reference: e.target.value }))}
      className="border-0 bg-muted h-9 text-sm font-mono" />
  </div>
  <div className="space-y-1.5">
    <Label className="text-xs font-bold">Statut</Label>
    <Select value={criteres.status} onValueChange={v => setCriteres(p => ({ ...p, status: v as any }))}>
      <SelectTrigger className="border-0 bg-muted h-9 text-sm">
        <SelectValue placeholder="Tous les statuts" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Tous</SelectItem>
        {(["en_cours","en_attente","suspendu","cloture"] as DossierStatus[]).map(s => (
          <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  <div className="space-y-1.5">
    <Label className="text-xs font-bold">Notaire</Label>
    <Select value={criteres.notaire} onValueChange={v => setCriteres(p => ({ ...p, notaire: v }))}>
      <SelectTrigger className="border-0 bg-muted h-9 text-sm">
        <SelectValue placeholder="Tous les notaires" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Tous</SelectItem>
        {MOCK_NOTAIRES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
  <div className="space-y-1.5">
    <Label className="text-xs font-bold">Clerc</Label>
    <Select value={criteres.clerc} onValueChange={v => setCriteres(p => ({ ...p, clerc: v }))}>
      <SelectTrigger className="border-0 bg-muted h-9 text-sm">
        <SelectValue placeholder="Tous les clercs" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Tous</SelectItem>
        {MOCK_CLERCS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
  {/* Période (Q27) */}
  <div className="space-y-1.5">
    <Label className="text-xs font-bold">Période — Du</Label>
    <Input type="date" value={criteres.dateDebut}
      onChange={e => setCriteres(p => ({ ...p, dateDebut: e.target.value }))}
      className="border-0 bg-muted h-9 text-sm" />
  </div>
  <div className="space-y-1.5">
    <Label className="text-xs font-bold">Au</Label>
    <Input type="date" value={criteres.dateFin}
      onChange={e => setCriteres(p => ({ ...p, dateFin: e.target.value }))}
      className="border-0 bg-muted h-9 text-sm" />
  </div>
</div>
```

### Section Bien (très important — Q24 : oui très souvent)

```tsx
<div className="grid grid-cols-2 gap-3">
  <div className="col-span-2 space-y-1.5">
    <Label className="text-xs font-bold">Adresse du bien</Label>
    <Input placeholder="ex: Rue 10, Dakar…" value={criteres.adresseBien}
      onChange={e => setCriteres(p => ({ ...p, adresseBien: e.target.value }))}
      className="border-0 bg-muted h-9 text-sm" />
  </div>
  <div className="space-y-1.5">
    <Label className="text-xs font-bold flex items-center gap-1">
      N° Titre Foncier
      <span className="rounded-full bg-amber-100 text-amber-700 text-[9px] px-1.5 font-bold">Fréquent</span>
    </Label>
    <Input placeholder="ex: TF-1042/DK" value={criteres.numeroTF}
      onChange={e => setCriteres(p => ({ ...p, numeroTF: e.target.value }))}
      className="border-0 bg-muted h-9 text-sm font-mono" />
  </div>
  <div className="space-y-1.5">
    <Label className="text-xs font-bold">Réf. cadastrale</Label>
    <Input placeholder="ex: CAD-2024-0891" value={criteres.referenceCadastre}
      onChange={e => setCriteres(p => ({ ...p, referenceCadastre: e.target.value }))}
      className="border-0 bg-muted h-9 text-sm font-mono" />
  </div>
</div>
```

---

## Composant ResultCard

```tsx
function ResultCard({ result }: { result: RechercheResult }) {
  const iconMap: Record<CategorieRecherche, React.ElementType> = {
    dossier: Folder,
    partie:  User,
    bien:    MapPin,
    acte:    FileText,
  }
  const colorMap: Record<CategorieRecherche, string> = {
    dossier: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    partie:  "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
    bien:    "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    acte:    "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  }
  const Icon = iconMap[result.type]

  return (
    <div className={cn(
      "rounded-xl border border-dashed p-4 cursor-pointer transition-all hover:shadow-sm",
      colorMap[result.type]
    )}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/60">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {result.type}
            </span>
            {/* Score fuzzy */}
            {result.score < 100 && (
              <span className="text-[10px] text-blue-500 font-semibold">
                ~{result.score}% correspondance
              </span>
            )}
          </div>
          <p className="text-sm font-semibold truncate">{result.dossier.intitule}</p>
          <p className="text-xs font-mono text-muted-foreground">{result.dossier.reference}</p>
          {result.highlight && (
            <p className="text-xs text-muted-foreground mt-1">
              Trouvé dans : <span className="font-semibold text-foreground">{result.matchedField}</span>
              {" — "}{result.highlight}
            </p>
          )}
        </div>
        <div className="shrink-0">
          <span className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
            STATUS_META[result.dossier.status].bg,
            STATUS_META[result.dossier.status].text
          )}>
            {STATUS_META[result.dossier.status].label}
          </span>
        </div>
      </div>
    </div>
  )
}
```

---

## Recherches sauvegardées (Q26)

```tsx
{/* Chips raccourcis */}
<div className="flex flex-wrap gap-2">
  {recherches.map(rs => (
    <button
      key={rs.id}
      onClick={() => applquerRecherche(rs.criteres)}
      className="flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-muted transition-colors"
    >
      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
      {rs.nom}
    </button>
  ))}
  <button
    onClick={() => setSauvegardeOpen(true)}
    className="flex items-center gap-1.5 rounded-full border border-dashed border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
  >
    <Plus className="h-3 w-3" />
    Sauvegarder cette recherche
  </button>
</div>

{/* Sheet sauvegarde */}
{/* Input nom + chips critères actifs en résumé + bouton confirmer */}
```

---

## Logique fuzzy matching (Q25)

```typescript
// Similarité Levenshtein simplifiée (mock — à remplacer par vraie lib en prod)
function similarity(a: string, b: string): number {
  const s1 = a.toLowerCase().replace(/['\s-]/g, "")
  const s2 = b.toLowerCase().replace(/['\s-]/g, "")
  if (s1 === s2) return 100
  if (s1.includes(s2) || s2.includes(s1)) return 85
  // Calcul basique de distance
  let matches = 0
  const len = Math.max(s1.length, s2.length)
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] === s2[i]) matches++
  }
  return Math.round((matches / len) * 100)
}

// Seuil : score >= 70 → inclure dans résultats
const SEUIL_FUZZY = 70
```

---

## État local page

```typescript
const [criteres, setCriteres]         = React.useState<CritereRecherche>({})
const [openSections, setOpenSections] = React.useState({ dossier: true, partie: false, bien: false, acte: false })
const [resultats, setResultats]       = React.useState<RechercheResult[]>([])
const [filtreCategorie, setFiltreCategorie] = React.useState<CategorieRecherche | "tous">("tous")
const [isSearching, setIsSearching]   = React.useState(false)
const [recherches, setRecherches]     = React.useState(RECHERCHES_SAUVEGARDEES_MOCK)
const [sauvegardeOpen, setSauvegardeOpen] = React.useState(false)
const [nomSauvegarde, setNomSauvegarde]   = React.useState("")
```

---

## Output attendu

```
CRÉÉ : src/app/[locale]/(pages)/recherche/page.tsx
CRÉÉ : src/app/[locale]/(pages)/recherche/layout.tsx
CRÉÉ : src/app/[locale]/(pages)/recherche/_lib/recherche-data.ts
CRÉÉ : src/app/[locale]/(pages)/recherche/_components/result-card.tsx

FONCTIONNALITÉS :
  ✓ Formulaire accordion 4 catégories (dossier, partie, bien, acte)
  ✓ Champ TF badge "Fréquent" (Q24)
  ✓ Fuzzy matching avec indicateur ~X% correspondance (Q25)
  ✓ Chips sauvegarde + sheet "Nommer cette recherche" (Q26)
  ✓ Filtres période date début/fin (Q27)
  ✓ Onglets résultats par catégorie avec compteurs
  ✓ ResultCard avec couleur par type + highlight champ trouvé
  ✓ Bouton réinitialiser tous les critères
```
