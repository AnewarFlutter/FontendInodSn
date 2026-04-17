// ─── M11-1 : Types & Mocks — Fonctions Transverses ───────────────────────────

import type { DossierStatus, FamilleDossier, Dossier } from "../../dossiers/_lib/dossiers-data"
import { DOSSIERS_MOCK } from "../../dossiers/_lib/dossiers-data"

// ─── Recherche ────────────────────────────────────────────────────────────────

export type CategorieRecherche = "dossier" | "partie" | "bien" | "acte"

export interface CritereRecherche {
  intitule?: string
  reference?: string
  notaire?: string
  clerc?: string
  status?: DossierStatus | ""
  famille?: FamilleDossier | ""
  typeOperation?: string
  dateDebut?: string
  dateFin?: string
  nomPartie?: string
  raisonSociale?: string
  numeroCNI?: string
  adresseBien?: string
  numeroTF?: string
  referenceCadastre?: string
  typeActe?: string
  dateActe?: string
  numeroActe?: string
}

export interface RechercheResult {
  type: CategorieRecherche
  score: number
  dossier: Dossier
  highlight?: string
  matchedField?: string
}

export interface RechercheSauvegardee {
  id: string
  nom: string
  criteres: CritereRecherche
  createdAt: string
  utilisateur: string
}

// ─── Duplication ──────────────────────────────────────────────────────────────

export interface DuplicationOptions {
  sourceId: string
  type: "dossier_complet" | "acte" | "document"
  destination: "nouveau_dossier" | "dossier_existant"
  dossierDestinationId?: string
  inclureParties: boolean
  inclureBiens: boolean
  inclureDocuments: boolean
  resetMetadonnees: boolean
  modePartie: "copier_fige" | "lier_et_maj"
}

// ─── Impression & Export ──────────────────────────────────────────────────────

export type TypeImpression =
  | "acte_complet"
  | "expedition"
  | "courrier"
  | "attestation"
  | "bordereau_depot"
  | "note_frais"
  | "fiche_recapitulatif"

export type FormatExport = "pdf" | "excel" | "csv"

export interface ImpressionOptions {
  dossierId: string
  type: TypeImpression
  format: FormatExport
  avecEnTete: boolean
  avecQRCode: boolean
  champsCsv?: string[]
}

export interface QRCodeData {
  reference: string
  dossierId: string
  typeDocument: string
  dateGeneration: string
  etude: string
}

// ─── Archivage & Traçabilité ──────────────────────────────────────────────────

export interface DossierArchive {
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
  typeConservation: "minute" | "document" | "copie"
  dureeConservationAns: number
  etiquettePhysique?: string
  referenceRayon?: string
  restaurablePar: ("notaire" | "administrateur")[]
}

export type ActionTracee =
  | "creation"
  | "modification"
  | "suppression"
  | "signature"
  | "changement_statut"
  | "archivage"
  | "restauration_archive"
  | "export_pdf"
  | "impression"
  | "duplication"
  | "ajout_partie"
  | "modification_acte"
  | "clôture"

export interface EvenementTracabilite {
  id: string
  dossierId: string
  utilisateur: string
  role: "clerc" | "secretaire" | "notaire" | "administrateur"
  action: ActionTracee
  objetType: "dossier" | "acte" | "document" | "partie" | "bien"
  objetId: string
  objetLabel: string
  timestamp: string
  valeurAvant?: Record<string, unknown>
  valeurApres?: Record<string, unknown>
  confirmeePar?: string
  necessiteConfirmation: boolean
}

// ─── Constantes ───────────────────────────────────────────────────────────────

export const ACTIONS_DOUBLE_CONFIRMATION: ActionTracee[] = [
  "suppression",
  "signature",
  "modification_acte",
]

export const CRITERES_SUGGERES = [
  { label: "Mes ventes en cours",   criteres: { status: "en_cours" as DossierStatus, famille: "droit_immobilier" as FamilleDossier } },
  { label: "Dossiers en attente",   criteres: { status: "en_attente" as DossierStatus } },
  { label: "Dossiers suspendus",    criteres: { status: "suspendu" as DossierStatus } },
  { label: "Successions en cours",  criteres: { status: "en_cours" as DossierStatus, famille: "droit_famille" as FamilleDossier } },
  { label: "Constitutions société", criteres: { status: "en_cours" as DossierStatus, famille: "droit_entreprise" as FamilleDossier } },
]

export const DUREES_CONSERVATION: Record<string, number> = {
  minute: 9999,
  document: 50,
  copie: 30,
}

export const COLONNES_EXPORT_CSV = [
  { key: "reference",           label: "Référence" },
  { key: "intitule",            label: "Intitulé" },
  { key: "famille",             label: "Famille" },
  { key: "typeOperation",       label: "Type opération" },
  { key: "status",              label: "Statut" },
  { key: "notaire",             label: "Notaire" },
  { key: "clerc",               label: "Clerc" },
  { key: "dateCreation",        label: "Date création" },
  { key: "dateSignaturePrevue", label: "Date signature prévue" },
  { key: "montantPrevisionnel", label: "Montant prévisionnel (FCFA)" },
]

export const TYPES_ACTES = [
  "Acte de vente", "Donation", "Testament", "Bail commercial",
  "Statuts société", "Acte de succession", "Hypothèque",
  "Mainlevée", "Procuration", "Contrat de mariage",
]

export const MOCK_NOTAIRES = ["Me SALL Amadou", "Me NDIAYE Fatou", "Me DIOP Ousmane"]
export const MOCK_CLERCS   = ["FALL Ibrahima", "Aminata DIALLO", "Moussa BA"]

// ─── Fuzzy matching ───────────────────────────────────────────────────────────

export function similarity(a: string, b: string): number {
  const s1 = a.toLowerCase().replace(/['\s-]/g, "")
  const s2 = b.toLowerCase().replace(/['\s-]/g, "")
  if (s1 === s2) return 100
  if (s1.includes(s2) || s2.includes(s1)) return 85
  let matches = 0
  const len = Math.max(s1.length, s2.length)
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] === s2[i]) matches++
  }
  return Math.round((matches / len) * 100)
}

export const SEUIL_FUZZY = 70

// ─── Mock data ────────────────────────────────────────────────────────────────

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
  {
    id: "arch-3",
    reference: "ENT-2021-0312",
    intitule: "Constitution SARL BÂTI PLUS",
    famille: "droit_entreprise",
    typeOperation: "statuts_societe",
    notaire: "Me DIOP Ousmane",
    clerc: "Moussa BA",
    dateArchivage: "2024-11-10T14:00:00Z",
    dateCreation: "2021-04-20T09:00:00Z",
    dateSignature: "2021-07-05T10:00:00Z",
    montantPrevisionnel: 8000000,
    typeConservation: "document",
    dureeConservationAns: 50,
    etiquettePhysique: "ARCH-ENT-2021-0312",
    referenceRayon: "Rayon C2 — Boîte 3",
    restaurablePar: ["notaire", "administrateur"],
  },
  {
    id: "arch-4",
    reference: "IMM-2018-0099",
    intitule: "Hypothèque NIANG Abdou",
    famille: "droit_immobilier",
    typeOperation: "hypotheque",
    notaire: "Me SALL Amadou",
    clerc: "FALL Ibrahima",
    dateArchivage: "2023-08-22T10:00:00Z",
    dateCreation: "2018-06-10T08:00:00Z",
    dateSignature: "2018-09-15T11:00:00Z",
    montantPrevisionnel: 25000000,
    typeConservation: "copie",
    dureeConservationAns: 30,
    etiquettePhysique: "ARCH-IMM-2018-0099",
    referenceRayon: "Rayon A1 — Boîte 7",
    restaurablePar: ["administrateur"],
  },
]
