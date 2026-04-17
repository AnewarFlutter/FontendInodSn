# Agent M11-1 — Architecture & Types (Fonctions Transverses)

## Responsabilité

Définir les types TypeScript, constantes, mock data et structure des fichiers pour le module M11.
**Ne pas toucher** à ce que M1 a déjà fait (`dossiers-data.ts`, `archive-confirm-sheet.tsx`, `handleDuplicate` basique).
Cet agent produit uniquement les fondations réutilisables par les agents M11-2 à M11-5.

---

## Ce que M1 a déjà fait — NE PAS DUPLIQUER

| Déjà fait dans M1 | Fichier M1 |
|-------------------|------------|
| ArchiveConfirmSheet (confirmation archivage) | `_components/archive-confirm-sheet.tsx` |
| handleDuplicate basique (copie simple) | `dossiers/page.tsx` |
| DossierStatus, Alerte, Dossier types | `_lib/dossiers-data.ts` |
| StatutTransitionSheet | `_components/statut-transition-sheet.tsx` |

---

## Structure des fichiers à créer

```
src/app/[locale]/(pages)/
├── recherche/
│   ├── page.tsx                         ← M11-2 : page recherche globale
│   ├── layout.tsx
│   └── _components/
│       ├── recherche-form.tsx
│       ├── recherche-results.tsx
│       ├── recherche-sauvegardee-sheet.tsx
│       └── result-card.tsx
├── archives/
│   ├── page.tsx                         ← M11-5 : browser archives lecture seule
│   ├── layout.tsx
│   └── _components/
│       ├── archive-card.tsx
│       └── archive-detail-sheet.tsx
└── dossiers/
    └── _components/
        ├── duplication-sheet.tsx        ← M11-3 : duplication avancée
        ├── impression-sheet.tsx         ← M11-4 : impression / export
        └── tracabilite-sheet.tsx        ← M11-5 : journal d'audit
```

---

## Types à définir dans `src/app/[locale]/(pages)/recherche/_lib/recherche-data.ts`

### CritereRecherche — critères multicritères

```typescript
// Catégories de recherche
type CategorieRecherche = "dossier" | "partie" | "bien" | "acte"

interface CritereRecherche {
  // Dossier
  intitule?: string
  reference?: string
  notaire?: string
  clerc?: string
  status?: DossierStatus | ""
  famille?: FamilleDossier | ""
  typeOperation?: string
  dateDebut?: string
  dateFin?: string

  // Partie (client)
  nomPartie?: string
  raisonSociale?: string
  numeroCNI?: string

  // Bien (immobilier)
  adresseBien?: string
  numeroTF?: string          // Titre foncier — très fréquent (Q24: oui très souvent)
  referenceCadastre?: string

  // Acte
  typeActe?: string
  dateActe?: string
  numeroActe?: string
}

interface RechercheResult {
  type: CategorieRecherche
  score: number              // score de similarité 0-100 (pour fuzzy matching Q25)
  dossier: Dossier
  highlight?: string         // texte mis en évidence
  matchedField?: string      // champ correspondant
}

// Recherche sauvegardée (Q26 : oui, raccourcis personnels)
interface RechercheSauvegardee {
  id: string
  nom: string                // ex: "Mes ventes en cours"
  criteres: CritereRecherche
  createdAt: string
  utilisateur: string
}
```

### Duplication avancée

```typescript
// M11-3 — Duplication avec options de destination (au-delà du handleDuplicate basique M1)
interface DuplicationOptions {
  sourceId: string
  type: "dossier_complet" | "acte" | "document"
  destination: "nouveau_dossier" | "dossier_existant"
  dossierDestinationId?: string
  inclureParties: boolean
  inclureBiens: boolean
  inclureDocuments: boolean
  // Métadonnées : repartir d'une fiche vierge (Q30 : oui, fiche vierge)
  resetMetadonnees: boolean
  // Fiche partie : possibilité de mettre à jour (Q28)
  modePartie: "copier_fige" | "lier_et_maj"
}
```

### Impression & Export

```typescript
// M11-4
type TypeImpression =
  | "acte_complet"
  | "expedition"           // copie authentique
  | "courrier"             // sur papier en-tête étude (Q32)
  | "attestation"          // sur papier en-tête étude (Q32)
  | "bordereau_depot"
  | "note_frais"
  | "fiche_recapitulatif"

type FormatExport = "pdf" | "excel" | "csv"

interface ImpressionOptions {
  dossierId: string
  type: TypeImpression
  format: FormatExport
  avecEnTete: boolean      // papier à en-tête étude (Q32)
  avecQRCode: boolean      // code QR pour rattachement scan (Q33 : utile)
  // Export tableur pour états/reporting (Q34 : oui)
  champsCsv?: string[]
}

// QR Code content
interface QRCodeData {
  reference: string
  dossierId: string
  typeDocument: string
  dateGeneration: string
  etude: string
}
```

### Archivage & Traçabilité

```typescript
// M11-5 — Archive (complément de ArchiveConfirmSheet M1)
interface DossierArchive {
  id: string
  reference: string
  intitule: string
  famille: FamilleDossier
  typeOperation: string
  notaire: string
  clerc: string
  dateArchivage: string
  dateCreation: string
  dateSignature: string
  montantPrevisionnel: number
  // Conservation légale (Q35 : 50 ans pour actes / distinction minutes vs autres)
  typeConservation: "minute" | "document" | "copie"
  dureeConservationAns: number   // 50 pour minutes (indéfinie), variable pour autres
  // Étiquette physique (Q35bis : bénéfique)
  etiquettePhysique?: string     // référence classement physique
  referenceRayon?: string
  // Restauration (Q35ter : par notaire/admin)
  restaurablePar: ("notaire" | "administrateur")[]
}

// Audit log (Q37 : exigence forte)
interface EvenementTracabilite {
  id: string
  dossierId: string
  utilisateur: string
  role: "clerc" | "secretaire" | "notaire" | "administrateur"
  action: ActionTracee
  objetType: "dossier" | "acte" | "document" | "partie" | "bien"
  objetId: string
  objetLabel: string
  timestamp: string
  // Historique avant/après (Q37 : pour chaque modification)
  valeurAvant?: Record<string, unknown>
  valeurApres?: Record<string, unknown>
  // Double confirmation requise (Q38)
  confirmeePar?: string
  necessiteConfirmation: boolean
}

// Actions qui nécessitent double confirmation (Q38 : signature, suppression, modification)
type ActionTracee =
  | "creation"
  | "modification"
  | "suppression"          // double confirmation
  | "signature"            // double confirmation
  | "changement_statut"
  | "archivage"
  | "restauration_archive"
  | "export_pdf"
  | "impression"
  | "duplication"
  | "ajout_partie"
  | "modification_acte"    // double confirmation
  | "clôture"

const ACTIONS_DOUBLE_CONFIRMATION: ActionTracee[] = [
  "suppression",
  "signature",
  "modification_acte",
]
```

---

## Constantes

```typescript
// Critères fréquents suggérés (Q23 : plus variés mieux c'est)
export const CRITERES_SUGGERES = [
  { label: "Mes ventes en cours",    criteres: { status: "en_cours", famille: "droit_immobilier", typeOperation: "vente_immobiliere" } },
  { label: "Dossiers en attente",    criteres: { status: "en_attente" } },
  { label: "Dossiers suspendus",     criteres: { status: "suspendu" } },
  { label: "Successions en cours",   criteres: { status: "en_cours", famille: "droit_famille" } },
  { label: "Constitutions société",  criteres: { status: "en_cours", famille: "droit_entreprise" } },
]

// Durées de conservation (Q35)
export const DUREES_CONSERVATION: Record<string, number> = {
  minute:   9999,   // conservation indéfinie (>50 ans)
  document: 50,
  copie:    30,
}

// Champs fuzzy match (Q25 : correspondances proches)
export const CHAMPS_FUZZY = ["intitule", "nomPartie", "raisonSociale"]

// Types d'actes pour recherche
export const TYPES_ACTES = [
  "Acte de vente", "Donation", "Testament", "Bail commercial",
  "Statuts société", "Acte de succession", "Hypothèque",
  "Mainlevée", "Procuration", "Contrat de mariage",
]

// Colonnes export CSV (Q34)
export const COLONNES_EXPORT_CSV = [
  { key: "reference",             label: "Référence" },
  { key: "intitule",              label: "Intitulé" },
  { key: "famille",               label: "Famille" },
  { key: "typeOperation",         label: "Type opération" },
  { key: "status",                label: "Statut" },
  { key: "notaire",               label: "Notaire" },
  { key: "clerc",                 label: "Clerc" },
  { key: "dateCreation",          label: "Date création" },
  { key: "dateSignaturePrevue",   label: "Date signature prévue" },
  { key: "montantPrevisionnel",   label: "Montant prévisionnel (FCFA)" },
]
```

---

## Mock data

### Recherches sauvegardées mock

```typescript
export const RECHERCHES_SAUVEGARDEES_MOCK: RechercheSauvegardee[] = [
  {
    id: "rs-1",
    nom: "Mes ventes en cours",
    criteres: { status: "en_cours", famille: "droit_immobilier", clerc: "FALL Ibrahima" },
    createdAt: "2026-01-15T10:00:00Z",
    utilisateur: "FALL Ibrahima",
  },
  {
    id: "rs-2",
    nom: "Dossiers en attente TF",
    criteres: { status: "en_attente", intitule: "titre foncier" },
    createdAt: "2026-02-10T09:00:00Z",
    utilisateur: "FALL Ibrahima",
  },
  {
    id: "rs-3",
    nom: "Successions Me SALL",
    criteres: { famille: "droit_famille", notaire: "Me SALL Amadou" },
    createdAt: "2026-03-01T14:00:00Z",
    utilisateur: "FALL Ibrahima",
  },
]
```

### Journal de traçabilité mock

```typescript
export const TRACABILITE_MOCK: EvenementTracabilite[] = [
  {
    id: "evt-1",
    dossierId: "dos-1",
    utilisateur: "FALL Ibrahima",
    role: "clerc",
    action: "modification",
    objetType: "dossier",
    objetId: "dos-1",
    objetLabel: "IMM-2024-1042 — Moussa NDIAYE / Awa DIOP",
    timestamp: "2026-04-17T09:23:00Z",
    valeurAvant: { status: "en_attente" },
    valeurApres: { status: "en_cours" },
    necessiteConfirmation: false,
  },
  {
    id: "evt-2",
    dossierId: "dos-2",
    utilisateur: "Me SALL Amadou",
    role: "notaire",
    action: "signature",
    objetType: "acte",
    objetId: "acte-2",
    objetLabel: "Acte de vente — SOC. IMMOBILIÈRE",
    timestamp: "2026-04-16T15:45:00Z",
    necessiteConfirmation: true,
    confirmeePar: "Me SALL Amadou",
  },
  {
    id: "evt-3",
    dossierId: "dos-3",
    utilisateur: "Aminata DIALLO",
    role: "secretaire",
    action: "changement_statut",
    objetType: "dossier",
    objetId: "dos-3",
    objetLabel: "FAM-2023-0156 — Succession DIALLO",
    timestamp: "2026-04-15T11:10:00Z",
    valeurAvant: { status: "en_cours" },
    valeurApres: { status: "suspendu" },
    necessiteConfirmation: false,
  },
  {
    id: "evt-4",
    dossierId: "dos-4",
    utilisateur: "FALL Ibrahima",
    role: "clerc",
    action: "export_pdf",
    objetType: "document",
    objetId: "doc-4",
    objetLabel: "Bordereau de dépôt — IMM-2023-0788",
    timestamp: "2026-04-14T16:30:00Z",
    necessiteConfirmation: false,
  },
  {
    id: "evt-5",
    dossierId: "dos-1",
    utilisateur: "Me NDIAYE Fatou",
    role: "notaire",
    action: "archivage",
    objetType: "dossier",
    objetId: "dos-5",
    objetLabel: "IMM-2023-0788 — Ibrahima FALL / Rokhaya DIENG",
    timestamp: "2026-04-13T10:00:00Z",
    necessiteConfirmation: false,
  },
]
```

### Archives mock

```typescript
export const ARCHIVES_MOCK: DossierArchive[] = [
  {
    id: "arch-1",
    reference: "IMM-2020-0145",
    intitule: "Karim WADE / Coumba FALL",
    famille: "droit_immobilier",
    typeOperation: "vente_immobiliere",
    notaire: "Me SALL Amadou",
    clerc: "FALL Ibrahima",
    dateArchivage: "2025-12-01T10:00:00Z",
    dateCreation: "2020-03-15T08:00:00Z",
    dateSignature: "2020-09-22T14:00:00Z",
    montantPrevisionnel: 55000000,
    typeConservation: "minute",
    dureeConservationAns: 9999,
    etiquettePhysique: "ARCH-IMM-2020-0145",
    referenceRayon: "Rayon A3 — Boîte 12",
    restaurablePar: ["notaire", "administrateur"],
  },
  {
    id: "arch-2",
    reference: "FAM-2019-0078",
    intitule: "Succession DIALLO Ibrahima",
    famille: "droit_famille",
    typeOperation: "declaration_succession",
    notaire: "Me NDIAYE Fatou",
    clerc: "Aminata DIALLO",
    dateArchivage: "2024-06-15T09:00:00Z",
    dateCreation: "2019-11-01T08:00:00Z",
    dateSignature: "2020-02-14T11:00:00Z",
    montantPrevisionnel: 12000000,
    typeConservation: "minute",
    dureeConservationAns: 9999,
    etiquettePhysique: "ARCH-FAM-2019-0078",
    referenceRayon: "Rayon B1 — Boîte 5",
    restaurablePar: ["notaire", "administrateur"],
  },
]
```

---

## Routes à ajouter dans `src/shared/constants/routes.ts`

```typescript
recherche: {
  root: "/recherche",
},
archives: {
  root: "/archives",
},
```

---

## Output attendu

```
CRÉÉ : src/app/[locale]/(pages)/recherche/_lib/recherche-data.ts
MODIFIÉ : src/shared/constants/routes.ts  (ajout recherche + archives)
MODIFIÉ : src/components/app-sidebar.tsx  (ajout Recherche + Archives)

TYPES DÉFINIS :
  ✓ CritereRecherche (multicritère : dossier + partie + bien + acte)
  ✓ RechercheResult avec score fuzzy
  ✓ RechercheSauvegardee (raccourcis personnels)
  ✓ DuplicationOptions (avancée, au-delà M1)
  ✓ ImpressionOptions (QR code, en-tête, CSV)
  ✓ DossierArchive (conservation 50 ans, étiquette physique)
  ✓ EvenementTracabilite (avant/après, double confirmation)
  ✓ ActionTracee (14 actions dont 3 avec double confirmation)

MOCKS :
  ✓ 3 recherches sauvegardées
  ✓ 5 événements de traçabilité
  ✓ 2 dossiers archivés
```
