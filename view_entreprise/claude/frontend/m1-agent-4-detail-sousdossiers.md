# Agent M1-4 — Détail Dossier & Arborescence Sous-dossiers

## Responsabilité

Créer `_components/dossier-detail-sheet.tsx` et `_components/sous-dossier-tree.tsx`.
Sheet détail complet avec 2 colonnes (infos + onglets) et gestion des sous-dossiers.

---

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Référence layout 2 colonnes | `src/app/[locale]/(pages)/user-management/_components/user-profile-dialog.tsx` |
| Types & constantes (M1-1) | `src/app/[locale]/(pages)/dossiers/_lib/dossiers-data.ts` |
| LoadingButton | `src/components/loading-button.tsx` |

---

## Règles métier

- **Sous-dossiers** : utilisés principalement pour vente avec prêt bancaire, procurations, successions
- **Chaque lot lotissement** = dossier séparé (sauf si même acquéreur)
- **Un sous-dossier peut avoir ses propres parties** distinctes du parent
- **Dossiers suspendus** : peuvent durer des années (retour titre foncier) → afficher durée de suspension

---

## Structure Sheet — side="right" sm:max-w-4xl

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (border-b)                                       │
│  [Avatar lettre coloré] | Référence mono | Intitulé    │
│  [Badge statut] [Badge type] [Badge famille]   [✕ ×8]  │
├─────────────────────────────────────────────────────────┤
│ SOUS-HEADER (bg-muted/30, border-b)                     │
│  "Détails du dossier"          [Actualiser] [Éditer]    │
├─────────────────────────────────────────────────────────┤
│ BODY (flex row, flex-1 overflow-hidden)                  │
│                                                         │
│ ┌──────────────┐  ┌───────────────────────────────────┐ │
│ │ COL GAUCHE   │  │ COL DROITE (Tabs)                 │ │
│ │ w-[280px]    │  │ flex-1                            │ │
│ │ overflow-y   │  │                                   │ │
│ │              │  │ [Informations] [Sous-dossiers]    │ │
│ │ InfoRows:    │  │ [Historique]   [Alertes]          │ │
│ │ • Notaire    │  │                                   │ │
│ │ • Clerc      │  │                                   │ │
│ │ • Famille    │  │                                   │ │
│ │ • Type opér. │  │                                   │ │
│ │ • Condition  │  │                                   │ │
│ │   suspensive │  │                                   │ │
│ │ • Date sign. │  │                                   │ │
│ │   (+ retard) │  │                                   │ │
│ │ • Montant    │  │                                   │ │
│ │ • Sous-dos.  │  │                                   │ │
│ │ • Créé le    │  │                                   │ │
│ │ • Modifié le │  │                                   │ │
│ └──────────────┘  └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Header complet

```tsx
<SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
  <div className="flex items-center gap-3">
    {/* Avatar lettre selon statut */}
    <div className={cn(
      "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold shrink-0",
      STATUS_META[dossier.status].bg, STATUS_META[dossier.status].text
    )}>
      {dossier.famille.charAt(0).toUpperCase()}
    </div>

    <div className="flex-1 min-w-0">
      <SheetTitle className="text-xs font-mono text-muted-foreground tracking-wider">
        {dossier.reference}
      </SheetTitle>
      <p className="text-base font-bold truncate mt-0.5 leading-snug">{dossier.intitule}</p>
    </div>

    <div className="flex items-center gap-1.5 mr-8 shrink-0 flex-wrap justify-end">
      {/* Badge statut plein */}
      <span className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border",
        STATUS_META[dossier.status].text,
        STATUS_META[dossier.status].border,
        STATUS_META[dossier.status].bg
      )}>
        <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", STATUS_META[dossier.status].dot)} />
        {STATUS_META[dossier.status].label}
      </span>
      {/* Badge famille */}
      <Badge variant="secondary" className="text-xs rounded-md">
        {FAMILLE_META[dossier.famille].label}
      </Badge>
    </div>
  </div>
</SheetHeader>
```

---

## Colonne gauche — InfoRows

Pattern identique à user-profile-dialog.tsx :

```tsx
function InfoRow({ icon: Icon, label, value, valueClass, extra }: {
  icon: React.ElementType; label: string; value?: string | null
  valueClass?: string; extra?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-dashed">
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-medium truncate", valueClass)}>{value || "—"}</p>
        {extra}
      </div>
    </div>
  )
}
```

Lignes :
```tsx
<InfoRow icon={User}        label="Notaire responsable"  value={dossier.notaire} />
<InfoRow icon={UserCheck}   label="Clerc en charge"      value={dossier.clerc} />
<InfoRow icon={Tag}         label="Famille"              value={FAMILLE_META[dossier.famille].label} />
<InfoRow icon={FileText}    label="Type d'opération"     value={typeLabel} />

{/* Condition suspensive */}
{dossier.conditionSuspensive?.active && (
  <InfoRow icon={AlertCircle} label="Condition suspensive"
    value={dossier.conditionSuspensive.motif === "pret_bancaire" ? "Prêt bancaire"
         : dossier.conditionSuspensive.motif === "obtention_permis" ? "Permis de construire"
         : "Autre condition"}
    valueClass="text-amber-600"
  />
)}

{/* Date avec indicateur retard */}
<InfoRow icon={Calendar} label="Date de signature prévue"
  value={formatDate(dossier.dateSignaturePrevue)}
  extra={isRetard ? (
    <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5">
      <AlertTriangle className="h-3 w-3" />+{retardJours} jours de retard
    </p>
  ) : undefined}
/>

<InfoRow icon={Banknote}    label="Montant prévisionnel"
  value={`${dossier.montantPrevisionnel.toLocaleString("fr-FR")} FCFA`} />
<InfoRow icon={GitBranch}   label="Sous-dossiers"
  value={`${dossier.nombreSousDossiers} rattaché(s)`} />
<InfoRow icon={Clock}       label="Créé le"   value={formatDate(dossier.dateCreation)} />
<InfoRow icon={RefreshCw}   label="Modifié le" value={formatDate(dossier.dateDerniereModif)} />

{/* Durée de suspension si suspendu */}
{dossier.status === "suspendu" && (
  <div className="flex items-start gap-3 py-2 border-b border-dashed">
    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-orange-100 dark:bg-orange-950/30 shrink-0 mt-0.5">
      <PauseCircle className="w-3.5 h-3.5 text-orange-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">Dossier suspendu</p>
      <p className="text-sm font-medium text-orange-600">En attente retour titre foncier</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">Peut durer plusieurs années</p>
    </div>
  </div>
)}
```

---

## Colonne droite — 4 onglets

```tsx
<TabsList className="h-9 bg-muted/60 p-1 rounded-lg">
  <TabsTrigger value="informations" className="text-xs cursor-pointer gap-1.5">
    <Info className="h-3.5 w-3.5" />Informations
  </TabsTrigger>
  <TabsTrigger value="sous-dossiers" className="text-xs cursor-pointer gap-1.5">
    <GitBranch className="h-3.5 w-3.5" />
    Sous-dossiers
    {dossier.nombreSousDossiers > 0 && (
      <span className="rounded-full bg-blue-500/15 text-blue-600 text-[10px] px-1.5 py-0.5 font-bold">
        {dossier.nombreSousDossiers}
      </span>
    )}
  </TabsTrigger>
  <TabsTrigger value="historique" className="text-xs cursor-pointer gap-1.5">
    <History className="h-3.5 w-3.5" />Historique
  </TabsTrigger>
  <TabsTrigger value="alertes" className="text-xs cursor-pointer gap-1.5">
    <Bell className="h-3.5 w-3.5" />
    Alertes
    {dossier.alertesActives.length > 0 && (
      <span className="rounded-full bg-red-500/15 text-red-600 text-[10px] px-1.5 py-0.5 font-bold">
        {dossier.alertesActives.length}
      </span>
    )}
  </TabsTrigger>
</TabsList>
```

---

## Onglet Sous-dossiers — SousDossierTree

**Header :**
```tsx
<div className="flex items-center justify-between mb-4">
  <div>
    <h3 className="text-sm font-bold">Sous-dossiers rattachés</h3>
    <p className="text-xs text-muted-foreground mt-0.5">
      Prêts bancaires, procurations, lots de succession…
    </p>
  </div>
  <Button size="sm" className="gap-1.5 shadow-none cursor-pointer" onClick={onAddSousDossier}>
    <Plus className="h-3.5 w-3.5" />Ajouter
  </Button>
</div>
```

**Card sous-dossier :**
```tsx
{(dossier.sousDossiers ?? []).map(sd => (
  <div key={sd.id} className={cn(
    "flex items-start gap-3 rounded-xl border border-dashed p-4 bg-card",
    "border-l-2",
    STATUS_META[sd.status].border.split(" ")[0].replace("border-", "border-l-")
  )}>
    {/* Icône motif */}
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
      {sd.motif === "pret_bancaire" ? <Banknote className="h-4 w-4 text-muted-foreground" /> :
       sd.motif === "procuration"   ? <UserCog  className="h-4 w-4 text-muted-foreground" /> :
       sd.motif === "succession"    ? <Users    className="h-4 w-4 text-muted-foreground" /> :
                                      <FileText className="h-4 w-4 text-muted-foreground" />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono text-muted-foreground">{sd.reference}</span>
        <span className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border",
          STATUS_META[sd.status].text, STATUS_META[sd.status].border, STATUS_META[sd.status].bg
        )}>
          <span className={cn("h-1 w-1 rounded-full", STATUS_META[sd.status].dot)} />
          {STATUS_META[sd.status].label}
        </span>
      </div>
      <p className="text-sm font-semibold mt-0.5 truncate">{sd.intitule}</p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {formatDate(sd.dateSignaturePrevue)} · {sd.montantPrevisionnel.toLocaleString("fr-FR")} FCFA
      </p>
    </div>
    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0 cursor-pointer">
      <ChevronRight className="h-3.5 w-3.5" />
    </Button>
  </div>
))}
```

**État vide :**
```tsx
<div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
  <GitBranch className="h-10 w-10 opacity-20" />
  <p className="text-sm font-medium">Aucun sous-dossier</p>
  <p className="text-xs text-center max-w-48">
    Ajoutez un sous-dossier pour les prêts bancaires, procurations ou lots de succession.
  </p>
  <Button size="sm" variant="outline" className="border-dashed gap-1.5 cursor-pointer"
    onClick={onAddSousDossier}>
    <Plus className="h-3.5 w-3.5" />Créer un sous-dossier
  </Button>
</div>
```

---

## Onglet Historique — Timeline

Mock de 6 événements avec types colorés :

```typescript
const MOCK_HISTORIQUE = [
  { date: "2024-01-15T09:30:00Z", action: "Dossier créé",                   auteur: "Me SALL Ousmane", type: "creation" },
  { date: "2024-01-20T14:15:00Z", action: "Clerc assigné : FALL Ibrahima", auteur: "Me SALL Ousmane", type: "info"     },
  { date: "2024-02-03T10:00:00Z", action: "Statut → En attente",            auteur: "FALL Ibrahima",   type: "statut"   },
  { date: "2024-02-10T11:45:00Z", action: "Statut → En cours",              auteur: "Me SALL Ousmane", type: "statut"   },
  { date: "2024-03-01T16:00:00Z", action: "Date signature modifiée",        auteur: "FALL Ibrahima",   type: "info"     },
  { date: "2024-03-15T09:00:00Z", action: "Sous-dossier créé (prêt)",       auteur: "FALL Ibrahima",   type: "creation" },
]
```

Timeline avec ligne verticale pointillée et puces colorées :
```tsx
<div className="relative pl-8">
  <div className="absolute left-3.5 top-2 bottom-2 w-px border-l border-dashed border-muted-foreground/20" />
  {MOCK_HISTORIQUE.map((e, i) => (
    <div key={i} className="relative mb-4 last:mb-0">
      <div className={cn(
        "absolute -left-5 top-1 h-3 w-3 rounded-full border-2 border-background",
        e.type === "creation" ? "bg-blue-500" :
        e.type === "statut"   ? "bg-amber-500" : "bg-slate-400"
      )} />
      <p className="text-sm font-semibold">{e.action}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{e.auteur} · {formatDate(e.date)}</p>
    </div>
  ))}
</div>
```

---

## Onglet Alertes

Liste des alertes actives avec leur niveau et échéance :

```tsx
{dossier.alertesActives.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
    <CheckCircle2 className="h-10 w-10 opacity-20" />
    <p className="text-sm">Aucune alerte active</p>
  </div>
) : (
  <div className="space-y-2">
    {dossier.alertesActives.map(a => (
      <div key={a.id} className={cn(
        "flex items-start gap-3 rounded-xl border border-dashed px-4 py-3",
        a.niveau === "j1" || a.niveau === "depasse"
          ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
          : a.niveau === "j3"
            ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
            : "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
      )}>
        <Bell className={cn("h-4 w-4 shrink-0 mt-0.5",
          a.niveau === "depasse" || a.niveau === "j1" ? "text-red-500" :
          a.niveau === "j3" ? "text-orange-500" : "text-amber-500"
        )} />
        <div className="flex-1">
          <p className="text-sm font-semibold">{a.message}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Échéance : {formatDate(a.dateEcheance)}
          </p>
        </div>
        <AlerteBadge alerte={a} />
      </div>
    ))}
  </div>
)}
```

---

## Output attendu

```
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/dossier-detail-sheet.tsx
CRÉÉ : src/app/[locale]/(pages)/dossiers/_components/sous-dossier-tree.tsx

FONCTIONNALITÉS :
  ✓ Header avec référence mono, intitulé, badges statut + famille
  ✓ Colonne gauche : 10 InfoRows dont condition suspensive et indicateur retard
  ✓ Bannière suspension (dossier suspendu — retour titre foncier)
  ✓ Onglet Informations : sections éditables
  ✓ Onglet Sous-dossiers : cards avec motif (prêt/procuration/succession) + état vide
  ✓ Onglet Historique : timeline 6 événements
  ✓ Onglet Alertes : liste J-7/J-3/J-1/EN RETARD avec couleurs
  ✓ Bouton Ajouter sous-dossier → CreateDossierSheet(parentId)
```
