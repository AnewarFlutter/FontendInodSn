# Agent M1-1 — Architecture & Types (Dossiers Notariaux)

## Responsabilité

Définir l'architecture complète du module M1 — Gestion des dossiers notariaux :
types TypeScript, mock data, constantes, structure des fichiers à créer.
Cet agent **ne génère pas de UI**, il produit uniquement les fondations réutilisables par les agents suivants.

---

## Références obligatoires

| Ressource | Chemin |
|-----------|--------|
| Pages existantes (design référence) | `src/app/[locale]/(pages)/modules/shop/page.tsx` |
| Page user-management (référence) | `src/app/[locale]/(pages)/user-management/page.tsx` |
| Routes | `src/shared/constants/routes.ts` |
| Images | `src/shared/constants/images.ts` |
| Utils | `src/lib/utils.ts` |

---

## Types à définir

### DossierStatus — 4 états (confirmé par étude)
```typescript
type DossierStatus = "en_cours" | "en_attente" | "suspendu" | "cloture"
```

### FamilleDossier — 4 familles principales (confirmé par étude)
```typescript
type FamilleDossier =
  | "droit_immobilier"
  | "droit_famille"
  | "droit_entreprise"
  | "divers"
```

### TypeOperation — hiérarchie complète par famille

> Chaque famille a ses propres types. La sélection se fait en deux étapes : famille → type.

```typescript
// Droit Immobilier
type TypeDroitImmobilier =
  | "vente_immobiliere" | "vente_vefa" | "promesse_unilaterale" | "promesse_synallagmatique"
  | "cession_droit_bail" | "cession_parts_sci" | "retractation"
  | "bail_habitation" | "bail_commercial" | "bail_professionnel" | "bail_emphyteotique"
  | "convention_occupation_precaire" | "renouvellement_bail"
  | "etat_descriptif_division" | "reglement_copropriete" | "modification_reglement_copropriete" | "cession_lots"
  | "constitution_servitude" | "constatation_servitude" | "extinction_servitude" | "mitoyennete" | "bornage"
  | "pret_immobilier" | "pret_particuliers" | "privilege_preteur_deniers" | "hypotheque" | "mainlevee_hypotheque" | "subrogation"
  | "mandat_gestion_immobiliere" | "convention_indivision" | "attribution_lots" | "partage_immobilier" | "licitation"
  | "ccmi" | "promotion_immobiliere" | "certificat_urbanisme" | "declaration_achevement"
  | "constat_notarie" | "pv_adjudication" | "expertise_amiable"

// Droit de la Famille
type TypeDroitFamille =
  | "contrat_mariage" | "changement_regime_matrimonial" | "reprise_apports" | "certificat_communaute"
  | "acte_notoriete" | "declaration_succession" | "renonciation_succession"
  | "acceptation_pure_simple" | "acceptation_actif_net" | "partage_successoral" | "attribution_preferentielle"
  | "donation_simple" | "donation_partage" | "donation_transgenerationnelle"
  | "donation_reserve_usufruit" | "donation_dernier_vivant" | "rapport_reduction_liberalites"
  | "convention_divorce_consentement" | "convention_divorce_judiciaire" | "liquidation_regime_matrimonial"
  | "convention_separation_corps" | "prestation_compensatoire"
  | "mandat_protection_future" | "tutelle_curatelle" | "habilitation_familiale"
  | "reconnaissance_enfant" | "convention_indivision_famille" | "contrat_pacs" | "testament" | "revocation_testament"

// Droit de l'Entreprise
type TypeDroitEntreprise =
  | "statuts_societe" | "nomination_gerant" | "declaration_conformite" | "pv_assemblee"
  | "augmentation_capital" | "reduction_capital" | "transformation_societe" | "dissolution_liquidation"
  | "fusion_scission" | "apport_partiel_actif"
  | "cession_parts_sociales" | "cession_actions" | "cession_fonds_commerce"
  | "cession_bail_commercial_ent" | "apport_societe" | "pacte_associes" | "promesse_cession"
  | "nantissement_parts" | "nantissement_fonds_commerce" | "cautionnement"
  | "privilege_preteur_deniers_ent" | "hypotheque_professionnelle" | "delegation_pouvoir"
  | "bail_commercial_ent" | "bail_professionnel_ent" | "convention_occupation_precaire_ent"
  | "renouvellement_bail_commercial" | "cession_bail_commercial_loc" | "clause_garantie_autonome"
  | "pv_decisions_collectives" | "nomination_expert" | "convention_compte_courant"
  | "pret_intra_groupe" | "mandat_gestion_ent"
  | "depot_comptes_annuels" | "regularisation_erreurs" | "publicite_fonciere" | "attestation_propriete" | "liquidation_societe"

// Divers
type TypeDivers = "procuration" | "reconnaissance_dette"

type TypeOperation = TypeDroitImmobilier | TypeDroitFamille | TypeDroitEntreprise | TypeDivers
```

### Condition suspensive (confirmé par étude)
```typescript
interface ConditionSuspensive {
  active: boolean
  motif?: "pret_bancaire" | "obtention_permis" | "autre"
  description?: string
}
```

### Interface Dossier principale
```typescript
interface Dossier {
  id: string
  reference: string                    // ex: "DOS-2024-0042" — généré automatiquement
  intitule: string                     // "Prénom Nom vendeur / Prénom Nom acquéreur"
  famille: FamilleDossier
  typeOperation: TypeOperation
  conditionSuspensive?: ConditionSuspensive
  status: DossierStatus
  notaire: string
  clerc: string
  dateSignaturePrevue: string          // ISO date
  montantPrevisionnel: number          // FCFA
  dateCreation: string                 // ISO date
  dateDerniereModif: string
  sousDossiers?: SousDossier[]
  parentId?: string
  nombreSousDossiers: number
  // Alertes
  alertesActives: Alerte[]
  retardJours?: number                 // nb jours de retard si dépassé
}
```

### Alertes (confirmé par étude — système de relance périodique)
```typescript
type AlerteType = "signature" | "depot_enregistrement" | "publicite_fonciere" | "retour_titre_foncier" | "relance"
type AlerteNiveau = "j7" | "j3" | "j1" | "depasse"

interface Alerte {
  id: string
  type: AlerteType
  niveau: AlerteNiveau
  message: string
  dateEcheance: string
  dossierId: string
}
```

### Sous-dossier (utilisés principalement pour : vente avec prêt bancaire, procuration, succession)
```typescript
interface SousDossier {
  id: string
  reference: string
  intitule: string
  typeOperation: TypeOperation
  status: DossierStatus
  dateSignaturePrevue: string
  montantPrevisionnel: number
  parentId: string
  motif: "pret_bancaire" | "procuration" | "succession" | "autre"
}
```

---

## Constantes à définir

### STATUS_META — 4 états
```typescript
const STATUS_META: Record<DossierStatus, {
  label: string; bg: string; text: string; dot: string; border: string; headerBg: string; headerText: string
}> = {
  en_cours:   {
    label: "En cours",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-800",
    headerBg: "bg-blue-50 dark:bg-[#0d1b2e]",
    headerText: "text-blue-700 dark:text-blue-300",
  },
  en_attente: {
    label: "En attente",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-800",
    headerBg: "bg-amber-50 dark:bg-[#2a1f0a]",
    headerText: "text-amber-700 dark:text-amber-300",
  },
  suspendu:   {
    label: "Suspendu",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
    border: "border-orange-200 dark:border-orange-800",
    headerBg: "bg-orange-50 dark:bg-[#2a1500]",
    headerText: "text-orange-700 dark:text-orange-300",
  },
  cloture:    {
    label: "Clôturé",
    bg: "bg-slate-100 dark:bg-slate-800/40",
    text: "text-slate-500 dark:text-slate-400",
    dot: "bg-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    headerBg: "bg-slate-100 dark:bg-[#1e2025]",
    headerText: "text-slate-600 dark:text-slate-400",
  },
}
```

### FAMILLE_META — 4 familles réelles
```typescript
const FAMILLE_META: Record<FamilleDossier, {
  label: string; description: string; color: string; dot: string
}> = {
  droit_immobilier: {
    label: "Droit Immobilier",
    description: "Ventes, baux, copropriété, servitudes, prêts immobiliers",
    color: "text-emerald-600", dot: "bg-emerald-500",
  },
  droit_famille: {
    label: "Droit de la Famille",
    description: "Successions, donations, régimes matrimoniaux, tutelles",
    color: "text-purple-600", dot: "bg-purple-500",
  },
  droit_entreprise: {
    label: "Droit de l'Entreprise",
    description: "Sociétés, cessions, baux commerciaux, garanties",
    color: "text-blue-600", dot: "bg-blue-500",
  },
  divers: {
    label: "Divers",
    description: "Procurations, reconnaissances de dette",
    color: "text-slate-600", dot: "bg-slate-400",
  },
}
```

### Types par famille (pour la sélection en 2 étapes)
```typescript
const TYPES_PAR_FAMILLE: Record<FamilleDossier, { value: TypeOperation; label: string; icon?: string }[]> = {
  droit_immobilier: [
    { value: "vente_immobiliere",          label: "Vente immobilière" },
    { value: "vente_vefa",                 label: "Vente en l'état futur d'achèvement (VEFA)" },
    { value: "promesse_unilaterale",       label: "Promesse unilatérale de vente" },
    { value: "promesse_synallagmatique",   label: "Promesse synallagmatique (compromis)" },
    { value: "cession_droit_bail",         label: "Cession de droit au bail" },
    { value: "cession_parts_sci",          label: "Cession de parts de société immobilière" },
    { value: "retractation",               label: "Rétractation / Révocation" },
    { value: "bail_habitation",            label: "Bail d'habitation" },
    { value: "bail_commercial",            label: "Bail commercial" },
    { value: "bail_professionnel",         label: "Bail professionnel" },
    { value: "bail_emphyteotique",         label: "Bail emphytéotique" },
    { value: "convention_occupation_precaire", label: "Convention d'occupation précaire" },
    { value: "renouvellement_bail",        label: "Renouvellement / Cession de bail" },
    { value: "etat_descriptif_division",   label: "État descriptif de division" },
    { value: "reglement_copropriete",      label: "Règlement de copropriété" },
    { value: "constitution_servitude",     label: "Constitution de servitude" },
    { value: "mainlevee_hypotheque",       label: "Mainlevée d'hypothèque" },
    { value: "hypotheque",                 label: "Hypothèque conventionnelle" },
    { value: "pret_immobilier",            label: "Prêt immobilier" },
    { value: "licitation",                 label: "Licitation" },
    { value: "partage_immobilier",         label: "Partage immobilier" },
    { value: "constat_notarie",            label: "Constat notarié" },
    { value: "pv_adjudication",            label: "Procès-verbal d'adjudication" },
  ],
  droit_famille: [
    { value: "contrat_mariage",            label: "Contrat de mariage" },
    { value: "changement_regime_matrimonial", label: "Changement de régime matrimonial" },
    { value: "acte_notoriete",             label: "Acte de notoriété" },
    { value: "declaration_succession",     label: "Déclaration de succession" },
    { value: "renonciation_succession",    label: "Renonciation à succession" },
    { value: "acceptation_pure_simple",    label: "Acceptation pure et simple" },
    { value: "partage_successoral",        label: "Partage successoral" },
    { value: "attribution_preferentielle", label: "Attribution préférentielle" },
    { value: "donation_simple",            label: "Donation simple" },
    { value: "donation_partage",           label: "Donation-partage" },
    { value: "donation_reserve_usufruit",  label: "Donation avec réserve d'usufruit" },
    { value: "donation_dernier_vivant",    label: "Donation au dernier vivant" },
    { value: "convention_divorce_consentement", label: "Convention de divorce par consentement mutuel" },
    { value: "liquidation_regime_matrimonial", label: "Liquidation de régime matrimonial" },
    { value: "mandat_protection_future",   label: "Mandat de protection future" },
    { value: "tutelle_curatelle",          label: "Tutelle / Curatelle" },
    { value: "testament",                  label: "Testament" },
    { value: "contrat_pacs",               label: "Contrat de Pacs" },
  ],
  droit_entreprise: [
    { value: "statuts_societe",            label: "Statuts de société" },
    { value: "pv_assemblee",               label: "Procès-verbal d'assemblée" },
    { value: "augmentation_capital",       label: "Augmentation de capital" },
    { value: "dissolution_liquidation",    label: "Dissolution et liquidation" },
    { value: "fusion_scission",            label: "Fusion / Scission" },
    { value: "cession_parts_sociales",     label: "Cession de parts sociales" },
    { value: "cession_actions",            label: "Cession d'actions" },
    { value: "cession_fonds_commerce",     label: "Cession de fonds de commerce" },
    { value: "apport_societe",             label: "Apport en société" },
    { value: "pacte_associes",             label: "Pacte d'associés / actionnaires" },
    { value: "nantissement_parts",         label: "Nantissement de parts / actions" },
    { value: "nantissement_fonds_commerce",label: "Nantissement de fonds de commerce" },
    { value: "cautionnement",              label: "Cautionnement" },
    { value: "bail_commercial_ent",        label: "Bail commercial" },
    { value: "bail_professionnel_ent",     label: "Bail professionnel" },
    { value: "liquidation_societe",        label: "Liquidation de société" },
  ],
  divers: [
    { value: "procuration",                label: "Procuration" },
    { value: "reconnaissance_dette",       label: "Reconnaissance de dette" },
  ],
}
```

### Transitions d'état autorisées (confirmé par étude)
```typescript
const TRANSITIONS_AUTORISEES: Record<DossierStatus, DossierStatus[]> = {
  en_cours:   ["en_attente", "suspendu", "cloture"],
  en_attente: ["en_cours",   "suspendu", "cloture"],
  suspendu:   ["en_cours",   "en_attente"],          // ne peut pas clôturer depuis suspendu
  cloture:    [],                                     // état terminal
}
```

### Mock notaires et clercs
```typescript
const MOCK_NOTAIRES = ["Me SALL Ousmane", "Me DIALLO Aminata", "Me NDIAYE Cheikh", "Me MBAYE Fatou"]
const MOCK_CLERCS   = ["FALL Ibrahima", "DIOP Awa", "THIAW Moussa", "SARR Marie", "BA Seydou"]
```

---

## Mock Data obligatoire

Créer `DOSSIERS_MOCK` : 14 dossiers couvrant toutes les familles, tous les statuts et tous les cas d'usage.

**Format intitulé : "Prénom Nom / Prénom Nom"** (confirmé par étude)

Exemples réalistes :
- "Moussa NDIAYE / Awa DIOP" (Vente immobilière, en cours)
- "Ibrahima SOC. IMMOBILIÈRE DAKAR / Cheikh FALL" (VEFA, en_attente — retour titre foncier)
- "Succession Mamadou SECK" (Succession, en cours)
- "Fatou MBAYE / Seydou BA" (Donation, en cours)
- "SCI DAKAR INVEST / THIAW SA" (Cession parts SCI, suspendu)
- "Lotissement NGOR — Lot 1 à 6" (parent avec 6 sous-dossiers, en cours)

Inclure au moins :
- 2 dossiers avec alertes J-7 et J-3
- 1 dossier avec retard (dateSignaturePrevue dans le passé)
- 2 dossiers avec sous-dossiers (1 vente avec prêt bancaire + 1 succession)
- 1 dossier suspendu (retour titre foncier — peut durer des années)
- 2 dossiers clôturés

---

## Génération automatique de référence

```typescript
function generateReference(famille: FamilleDossier): string {
  const PREFIXES: Record<FamilleDossier, string> = {
    droit_immobilier: "IMM",
    droit_famille:    "FAM",
    droit_entreprise: "ENT",
    divers:           "DIV",
  }
  const year  = new Date().getFullYear()
  const seq   = String(Math.floor(Math.random() * 9000) + 1000)
  return `${PREFIXES[famille]}-${year}-${seq}`
}
```

---

## Structure des fichiers à créer

```
src/app/[locale]/(pages)/dossiers/
├── page.tsx                              ← Agent M1-2
├── layout.tsx                            ← Agent M1-2
└── _components/
    ├── Breadcrumb.tsx                    ← Agent M1-2
    ├── dossier-card.tsx                  ← Agent M1-2
    ├── dossier-row.tsx                   ← Agent M1-2
    ├── alerte-badge.tsx                  ← Agent M1-2
    ├── create-dossier-sheet.tsx          ← Agent M1-3
    ├── dossier-detail-sheet.tsx          ← Agent M1-4
    ├── sous-dossier-tree.tsx             ← Agent M1-4
    ├── statut-transition-sheet.tsx       ← Agent M1-5
    ├── archive-confirm-sheet.tsx         ← Agent M1-5
    └── relance-sheet.tsx                 ← Agent M1-5
src/app/[locale]/(pages)/dossiers/_lib/
    └── dossiers-data.ts                  ← Agent M1-1 (ce fichier)
```

---

## Output attendu

```
ARCHITECTURE M1 — Dossiers Notariaux

TYPES DÉFINIS : Dossier, SousDossier, DossierStatus (4), FamilleDossier (4), TypeOperation (complet), Alerte
CONSTANTES : STATUS_META, FAMILLE_META, TYPES_PAR_FAMILLE, TRANSITIONS_AUTORISEES
MOCK DATA : 14 dossiers (dont 2 avec sous-dossiers, alertes, retard)
FICHIER CRÉÉ : src/app/[locale]/(pages)/dossiers/_lib/dossiers-data.ts

PRÊT POUR : Agents M1-2, M1-3, M1-4, M1-5
```
