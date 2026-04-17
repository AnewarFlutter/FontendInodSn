// ─── M1-1 : Architecture & Types — Dossiers Notariaux ────────────────────────

// ─── Statuts ──────────────────────────────────────────────────────────────────

export type DossierStatus = "en_cours" | "en_attente" | "suspendu" | "cloture"

// ─── Familles ─────────────────────────────────────────────────────────────────

export type FamilleDossier =
  | "droit_immobilier"
  | "droit_famille"
  | "droit_entreprise"
  | "divers"

// ─── Types d'opération ────────────────────────────────────────────────────────

export type TypeDroitImmobilier =
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

export type TypeDroitFamille =
  | "contrat_mariage" | "changement_regime_matrimonial" | "reprise_apports" | "certificat_communaute"
  | "acte_notoriete" | "declaration_succession" | "renonciation_succession"
  | "acceptation_pure_simple" | "acceptation_actif_net" | "partage_successoral" | "attribution_preferentielle"
  | "donation_simple" | "donation_partage" | "donation_transgenerationnelle"
  | "donation_reserve_usufruit" | "donation_dernier_vivant" | "rapport_reduction_liberalites"
  | "convention_divorce_consentement" | "convention_divorce_judiciaire" | "liquidation_regime_matrimonial"
  | "convention_separation_corps" | "prestation_compensatoire"
  | "mandat_protection_future" | "tutelle_curatelle" | "habilitation_familiale"
  | "reconnaissance_enfant" | "convention_indivision_famille" | "contrat_pacs" | "testament" | "revocation_testament"

export type TypeDroitEntreprise =
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

export type TypeDivers = "procuration" | "reconnaissance_dette"

export type TypeOperation = TypeDroitImmobilier | TypeDroitFamille | TypeDroitEntreprise | TypeDivers

// ─── Interfaces principales ───────────────────────────────────────────────────

export type AlerteType = "signature" | "depot_enregistrement" | "publicite_fonciere" | "retour_titre_foncier" | "relance"
export type AlerteNiveau = "j7" | "j3" | "j1" | "depasse"

export interface Alerte {
  id: string
  type: AlerteType
  niveau: AlerteNiveau
  message: string
  dateEcheance: string
  dossierId: string
}

export interface ConditionSuspensive {
  active: boolean
  motif?: "pret_bancaire" | "obtention_permis" | "autre"
  description?: string
}

export interface SousDossier {
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

export interface Dossier {
  id: string
  reference: string
  intitule: string
  famille: FamilleDossier
  typeOperation: TypeOperation
  conditionSuspensive?: ConditionSuspensive
  status: DossierStatus
  notaire: string
  clerc: string
  dateSignaturePrevue: string
  montantPrevisionnel: number
  dateCreation: string
  dateDerniereModif: string
  sousDossiers?: SousDossier[]
  parentId?: string
  nombreSousDossiers: number
  alertesActives: Alerte[]
  retardJours?: number
}

export interface CreateDossierPayload {
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

// ─── Constantes métier ────────────────────────────────────────────────────────

export const STATUS_META: Record<DossierStatus, {
  label: string; bg: string; text: string; dot: string; border: string; headerBg: string; headerText: string; badgeBg: string
}> = {
  en_cours: {
    label: "En cours",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-800",
    headerBg: "bg-blue-50 dark:bg-[#0d1b2e]",
    headerText: "text-blue-700 dark:text-blue-300",
    badgeBg: "bg-blue-500",
  },
  en_attente: {
    label: "En attente",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-800",
    headerBg: "bg-amber-50 dark:bg-[#2a1f0a]",
    headerText: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-500",
  },
  suspendu: {
    label: "Suspendu",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
    border: "border-orange-200 dark:border-orange-800",
    headerBg: "bg-orange-50 dark:bg-[#2a1500]",
    headerText: "text-orange-700 dark:text-orange-300",
    badgeBg: "bg-orange-500",
  },
  cloture: {
    label: "Clôturé",
    bg: "bg-slate-100 dark:bg-slate-800/40",
    text: "text-slate-500 dark:text-slate-400",
    dot: "bg-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    headerBg: "bg-slate-100 dark:bg-[#1e2025]",
    headerText: "text-slate-600 dark:text-slate-400",
    badgeBg: "bg-slate-500",
  },
}

export const FAMILLE_META: Record<FamilleDossier, {
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

export const TYPES_PAR_FAMILLE: Record<FamilleDossier, { value: TypeOperation; label: string }[]> = {
  droit_immobilier: [
    { value: "vente_immobiliere",              label: "Vente immobilière" },
    { value: "vente_vefa",                     label: "Vente en l'état futur d'achèvement (VEFA)" },
    { value: "promesse_unilaterale",           label: "Promesse unilatérale de vente" },
    { value: "promesse_synallagmatique",       label: "Promesse synallagmatique (compromis)" },
    { value: "cession_droit_bail",             label: "Cession de droit au bail" },
    { value: "cession_parts_sci",              label: "Cession de parts de société immobilière" },
    { value: "retractation",                   label: "Rétractation / Révocation" },
    { value: "bail_habitation",                label: "Bail d'habitation" },
    { value: "bail_commercial",                label: "Bail commercial" },
    { value: "bail_professionnel",             label: "Bail professionnel" },
    { value: "bail_emphyteotique",             label: "Bail emphytéotique" },
    { value: "convention_occupation_precaire", label: "Convention d'occupation précaire" },
    { value: "renouvellement_bail",            label: "Renouvellement / Cession de bail" },
    { value: "etat_descriptif_division",       label: "État descriptif de division" },
    { value: "reglement_copropriete",          label: "Règlement de copropriété" },
    { value: "constitution_servitude",         label: "Constitution de servitude" },
    { value: "mainlevee_hypotheque",           label: "Mainlevée d'hypothèque" },
    { value: "hypotheque",                     label: "Hypothèque conventionnelle" },
    { value: "pret_immobilier",                label: "Prêt immobilier" },
    { value: "licitation",                     label: "Licitation" },
    { value: "partage_immobilier",             label: "Partage immobilier" },
    { value: "constat_notarie",                label: "Constat notarié" },
    { value: "pv_adjudication",                label: "Procès-verbal d'adjudication" },
  ],
  droit_famille: [
    { value: "contrat_mariage",                   label: "Contrat de mariage" },
    { value: "changement_regime_matrimonial",     label: "Changement de régime matrimonial" },
    { value: "acte_notoriete",                    label: "Acte de notoriété" },
    { value: "declaration_succession",            label: "Déclaration de succession" },
    { value: "renonciation_succession",           label: "Renonciation à succession" },
    { value: "acceptation_pure_simple",           label: "Acceptation pure et simple" },
    { value: "partage_successoral",               label: "Partage successoral" },
    { value: "attribution_preferentielle",        label: "Attribution préférentielle" },
    { value: "donation_simple",                   label: "Donation simple" },
    { value: "donation_partage",                  label: "Donation-partage" },
    { value: "donation_reserve_usufruit",         label: "Donation avec réserve d'usufruit" },
    { value: "donation_dernier_vivant",           label: "Donation au dernier vivant" },
    { value: "convention_divorce_consentement",   label: "Convention de divorce par consentement mutuel" },
    { value: "liquidation_regime_matrimonial",    label: "Liquidation de régime matrimonial" },
    { value: "mandat_protection_future",          label: "Mandat de protection future" },
    { value: "tutelle_curatelle",                 label: "Tutelle / Curatelle" },
    { value: "testament",                         label: "Testament" },
    { value: "contrat_pacs",                      label: "Contrat de Pacs" },
  ],
  droit_entreprise: [
    { value: "statuts_societe",               label: "Statuts de société" },
    { value: "pv_assemblee",                  label: "Procès-verbal d'assemblée" },
    { value: "augmentation_capital",          label: "Augmentation de capital" },
    { value: "dissolution_liquidation",       label: "Dissolution et liquidation" },
    { value: "fusion_scission",               label: "Fusion / Scission" },
    { value: "cession_parts_sociales",        label: "Cession de parts sociales" },
    { value: "cession_actions",               label: "Cession d'actions" },
    { value: "cession_fonds_commerce",        label: "Cession de fonds de commerce" },
    { value: "apport_societe",                label: "Apport en société" },
    { value: "pacte_associes",                label: "Pacte d'associés / actionnaires" },
    { value: "nantissement_parts",            label: "Nantissement de parts / actions" },
    { value: "nantissement_fonds_commerce",   label: "Nantissement de fonds de commerce" },
    { value: "cautionnement",                 label: "Cautionnement" },
    { value: "bail_commercial_ent",           label: "Bail commercial" },
    { value: "bail_professionnel_ent",        label: "Bail professionnel" },
    { value: "liquidation_societe",           label: "Liquidation de société" },
  ],
  divers: [
    { value: "procuration",          label: "Procuration" },
    { value: "reconnaissance_dette", label: "Reconnaissance de dette" },
  ],
}

export const TRANSITIONS_AUTORISEES: Record<DossierStatus, DossierStatus[]> = {
  en_cours:   ["en_attente", "suspendu", "cloture"],
  en_attente: ["en_cours",   "suspendu", "cloture"],
  suspendu:   ["en_cours",   "en_attente"],
  cloture:    [],
}

export const MOTIFS_TRANSITION: Record<string, string[]> = {
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
  "en_cours->cloture": [
    "Acte signé et formalités finalisées",
    "Honoraires encaissés",
    "Dossier complet clôturé",
    "Opération abandonnée",
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
  "en_attente->cloture": [
    "Acte signé et formalités finalisées",
    "Honoraires encaissés",
    "Opération abandonnée",
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
}

// ─── Listes mock ──────────────────────────────────────────────────────────────

export const MOCK_NOTAIRES = [
  "Me SALL Ousmane", "Me DIALLO Aminata", "Me NDIAYE Cheikh", "Me MBAYE Fatou",
]

export const MOCK_CLERCS = [
  "FALL Ibrahima", "DIOP Awa", "THIAW Moussa", "SARR Marie", "BA Seydou",
]

export const MOCK_CLERC_CONNECTE = "FALL Ibrahima"

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateReference(famille: FamilleDossier): string {
  const PREFIXES: Record<FamilleDossier, string> = {
    droit_immobilier: "IMM",
    droit_famille:    "FAM",
    droit_entreprise: "ENT",
    divers:           "DIV",
  }
  const year = new Date().getFullYear()
  const seq  = String(Math.floor(Math.random() * 9000) + 1000)
  return `${PREFIXES[famille]}-${year}-${seq}`
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
  } catch { return "—" }
}

export function getTypeLabel(famille: FamilleDossier, type: TypeOperation): string {
  return TYPES_PAR_FAMILLE[famille]?.find(t => t.value === type)?.label ?? type
}

export function getMotifs(from: DossierStatus, to: DossierStatus): string[] {
  return MOTIFS_TRANSITION[`${from}->${to}`] ?? ["Autre"]
}

export function calcRetard(dateSignature: string): number {
  const diff = Date.now() - new Date(dateSignature).getTime()
  return diff > 0 ? Math.floor(diff / 86400000) : 0
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const today = new Date()
const inDays = (n: number) => new Date(today.getTime() + n * 86400000).toISOString()
const pastDays = (n: number) => new Date(today.getTime() - n * 86400000).toISOString()

export const DOSSIERS_MOCK: Dossier[] = [
  {
    id: "dos-001",
    reference: "IMM-2024-1042",
    intitule: "Moussa NDIAYE / Awa DIOP",
    famille: "droit_immobilier",
    typeOperation: "vente_immobiliere",
    status: "en_cours",
    notaire: "Me SALL Ousmane",
    clerc: "FALL Ibrahima",
    dateSignaturePrevue: inDays(6),
    montantPrevisionnel: 45_000_000,
    dateCreation: pastDays(45),
    dateDerniereModif: pastDays(2),
    nombreSousDossiers: 1,
    conditionSuspensive: { active: true, motif: "pret_bancaire" },
    alertesActives: [
      { id: "a1", type: "signature", niveau: "j7", message: "Signature prévue dans 6 jours", dateEcheance: inDays(6), dossierId: "dos-001" },
    ],
    sousDossiers: [
      { id: "sd-001", reference: "IMM-2024-1042-A", intitule: "Prêt CBAO — Moussa NDIAYE", typeOperation: "pret_immobilier", status: "en_cours", dateSignaturePrevue: inDays(6), montantPrevisionnel: 30_000_000, parentId: "dos-001", motif: "pret_bancaire" },
    ],
  },
  {
    id: "dos-002",
    reference: "IMM-2024-0887",
    intitule: "SOC. IMMOBILIÈRE DAKAR / Cheikh FALL",
    famille: "droit_immobilier",
    typeOperation: "vente_vefa",
    status: "en_attente",
    notaire: "Me DIALLO Aminata",
    clerc: "FALL Ibrahima",
    dateSignaturePrevue: inDays(2),
    montantPrevisionnel: 120_000_000,
    dateCreation: pastDays(90),
    dateDerniereModif: pastDays(5),
    nombreSousDossiers: 0,
    alertesActives: [
      { id: "a2", type: "retour_titre_foncier", niveau: "j3", message: "Retour titre foncier attendu dans 2 jours", dateEcheance: inDays(2), dossierId: "dos-002" },
    ],
  },
  {
    id: "dos-003",
    reference: "FAM-2024-0334",
    intitule: "Succession Mamadou SECK",
    famille: "droit_famille",
    typeOperation: "partage_successoral",
    status: "en_cours",
    notaire: "Me NDIAYE Cheikh",
    clerc: "DIOP Awa",
    dateSignaturePrevue: inDays(30),
    montantPrevisionnel: 85_000_000,
    dateCreation: pastDays(60),
    dateDerniereModif: pastDays(10),
    nombreSousDossiers: 2,
    alertesActives: [],
    sousDossiers: [
      { id: "sd-002", reference: "FAM-2024-0334-A", intitule: "Procuration — Fatou SECK", typeOperation: "procuration", status: "en_cours", dateSignaturePrevue: inDays(15), montantPrevisionnel: 0, parentId: "dos-003", motif: "procuration" },
      { id: "sd-003", reference: "FAM-2024-0334-B", intitule: "Attribution préférentielle — Ibou SECK", typeOperation: "attribution_preferentielle", status: "en_attente", dateSignaturePrevue: inDays(30), montantPrevisionnel: 40_000_000, parentId: "dos-003", motif: "succession" },
    ],
  },
  {
    id: "dos-004",
    reference: "IMM-2023-0521",
    intitule: "Résidence NGOR — Lot 12 / Oumar BA",
    famille: "droit_immobilier",
    typeOperation: "vente_immobiliere",
    status: "suspendu",
    notaire: "Me SALL Ousmane",
    clerc: "FALL Ibrahima",
    dateSignaturePrevue: pastDays(180),
    montantPrevisionnel: 18_500_000,
    dateCreation: pastDays(400),
    dateDerniereModif: pastDays(180),
    nombreSousDossiers: 0,
    retardJours: 180,
    alertesActives: [
      { id: "a3", type: "retour_titre_foncier", niveau: "depasse", message: "Retour titre foncier en attente depuis 6 mois", dateEcheance: pastDays(180), dossierId: "dos-004" },
    ],
  },
  {
    id: "dos-005",
    reference: "ENT-2024-0756",
    intitule: "SCI DAKAR INVEST / THIAW SA",
    famille: "droit_entreprise",
    typeOperation: "cession_parts_sociales",
    status: "en_cours",
    notaire: "Me MBAYE Fatou",
    clerc: "THIAW Moussa",
    dateSignaturePrevue: inDays(14),
    montantPrevisionnel: 200_000_000,
    dateCreation: pastDays(20),
    dateDerniereModif: pastDays(1),
    nombreSousDossiers: 0,
    alertesActives: [],
  },
  {
    id: "dos-006",
    reference: "FAM-2024-0112",
    intitule: "Fatou MBAYE / Seydou BA",
    famille: "droit_famille",
    typeOperation: "donation_simple",
    status: "en_cours",
    notaire: "Me NDIAYE Cheikh",
    clerc: "DIOP Awa",
    dateSignaturePrevue: inDays(21),
    montantPrevisionnel: 25_000_000,
    dateCreation: pastDays(15),
    dateDerniereModif: pastDays(3),
    nombreSousDossiers: 0,
    alertesActives: [],
  },
  {
    id: "dos-007",
    reference: "IMM-2024-0993",
    intitule: "Aliou GUEYE / Marie SARR",
    famille: "droit_immobilier",
    typeOperation: "bail_commercial",
    status: "en_attente",
    notaire: "Me DIALLO Aminata",
    clerc: "SARR Marie",
    dateSignaturePrevue: pastDays(5),
    montantPrevisionnel: 5_000_000,
    dateCreation: pastDays(30),
    dateDerniereModif: pastDays(5),
    retardJours: 5,
    nombreSousDossiers: 0,
    alertesActives: [
      { id: "a4", type: "depot_enregistrement", niveau: "depasse", message: "Dépôt enregistrement en retard de 5 jours", dateEcheance: pastDays(5), dossierId: "dos-007" },
    ],
  },
  {
    id: "dos-008",
    reference: "ENT-2024-0412",
    intitule: "SARL TECH SN / Moustapha DIALLO",
    famille: "droit_entreprise",
    typeOperation: "cession_fonds_commerce",
    status: "en_cours",
    notaire: "Me SALL Ousmane",
    clerc: "BA Seydou",
    dateSignaturePrevue: inDays(45),
    montantPrevisionnel: 75_000_000,
    dateCreation: pastDays(10),
    dateDerniereModif: pastDays(1),
    nombreSousDossiers: 0,
    alertesActives: [],
  },
  {
    id: "dos-009",
    reference: "IMM-2023-0788",
    intitule: "Ibrahima FALL / Rokhaya DIENG",
    famille: "droit_immobilier",
    typeOperation: "vente_immobiliere",
    status: "cloture",
    notaire: "Me NDIAYE Cheikh",
    clerc: "FALL Ibrahima",
    dateSignaturePrevue: pastDays(60),
    montantPrevisionnel: 32_000_000,
    dateCreation: pastDays(180),
    dateDerniereModif: pastDays(60),
    nombreSousDossiers: 0,
    alertesActives: [],
  },
  {
    id: "dos-010",
    reference: "FAM-2023-0445",
    intitule: "Succession Aminata WADE",
    famille: "droit_famille",
    typeOperation: "declaration_succession",
    status: "cloture",
    notaire: "Me MBAYE Fatou",
    clerc: "DIOP Awa",
    dateSignaturePrevue: pastDays(90),
    montantPrevisionnel: 60_000_000,
    dateCreation: pastDays(365),
    dateDerniereModif: pastDays(90),
    nombreSousDossiers: 0,
    alertesActives: [],
  },
  {
    id: "dos-011",
    reference: "DIV-2024-0089",
    intitule: "Procuration — Ndèye FALL",
    famille: "divers",
    typeOperation: "procuration",
    status: "en_cours",
    notaire: "Me SALL Ousmane",
    clerc: "THIAW Moussa",
    dateSignaturePrevue: inDays(3),
    montantPrevisionnel: 0,
    dateCreation: pastDays(5),
    dateDerniereModif: pastDays(1),
    nombreSousDossiers: 0,
    alertesActives: [
      { id: "a5", type: "signature", niveau: "j3", message: "Signature dans 3 jours", dateEcheance: inDays(3), dossierId: "dos-011" },
    ],
  },
  {
    id: "dos-012",
    reference: "ENT-2024-0234",
    intitule: "SARL DISTRIBAX — Constitution",
    famille: "droit_entreprise",
    typeOperation: "statuts_societe",
    status: "en_cours",
    notaire: "Me DIALLO Aminata",
    clerc: "BA Seydou",
    dateSignaturePrevue: inDays(1),
    montantPrevisionnel: 10_000_000,
    dateCreation: pastDays(7),
    dateDerniereModif: pastDays(1),
    nombreSousDossiers: 0,
    alertesActives: [
      { id: "a6", type: "signature", niveau: "j1", message: "Signature demain !", dateEcheance: inDays(1), dossierId: "dos-012" },
    ],
  },
  {
    id: "dos-013",
    reference: "IMM-2024-0667",
    intitule: "Contrat mariage — Amadou DIALLO / Coumba KANE",
    famille: "droit_famille",
    typeOperation: "contrat_mariage",
    status: "en_cours",
    notaire: "Me NDIAYE Cheikh",
    clerc: "SARR Marie",
    dateSignaturePrevue: inDays(10),
    montantPrevisionnel: 0,
    dateCreation: pastDays(8),
    dateDerniereModif: pastDays(2),
    nombreSousDossiers: 0,
    alertesActives: [],
  },
  {
    id: "dos-014",
    reference: "IMM-2022-0299",
    intitule: "Résidence ALMADIES — Lot 7 / Pape DIOUF",
    famille: "droit_immobilier",
    typeOperation: "vente_immobiliere",
    status: "suspendu",
    notaire: "Me SALL Ousmane",
    clerc: "FALL Ibrahima",
    dateSignaturePrevue: pastDays(540),
    montantPrevisionnel: 22_000_000,
    dateCreation: pastDays(730),
    dateDerniereModif: pastDays(540),
    retardJours: 540,
    nombreSousDossiers: 0,
    alertesActives: [
      { id: "a7", type: "retour_titre_foncier", niveau: "depasse", message: "Titre foncier en attente depuis 18 mois", dateEcheance: pastDays(540), dossierId: "dos-014" },
    ],
  },
]
