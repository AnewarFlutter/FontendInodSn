"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/loading-button"
import { toast } from "sonner"
import {
  Search,
  LayoutGrid,
  List,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Bell,
} from "lucide-react"
import { IconRefresh, IconPlus } from "@tabler/icons-react"
import {
  DOSSIERS_MOCK,
  STATUS_META,
  FAMILLE_META,
  generateReference,
  type Dossier,
  type DossierStatus,
  type FamilleDossier,
  type CreateDossierPayload,
  type Alerte,
  MOCK_CLERC_CONNECTE,
} from "./_lib/dossiers-data"
import { BreadcrumbDossiers } from "./_components/Breadcrumb"
import { DossierCard } from "./_components/dossier-card"
import { DossierRow } from "./_components/dossier-row"
import { CreateDossierSheet } from "./_components/create-dossier-sheet"
import { DossierDetailSheet } from "./_components/dossier-detail-sheet"
import { StatutTransitionSheet } from "./_components/statut-transition-sheet"
import { ArchiveConfirmSheet } from "./_components/archive-confirm-sheet"
import { RelanceSheet } from "./_components/relance-sheet"
import { DuplicationSheet } from "./_components/duplication-sheet"
import { ImpressionSheet } from "./_components/impression-sheet"
import { TracabiliteSheet } from "./_components/tracabilite-sheet"
import type { DuplicationOptions, ImpressionOptions } from "../recherche/_lib/recherche-data"

const FAMILLES_FILTER: { key: "tous" | FamilleDossier; label: string; desc: string }[] = [
  { key: "tous",             label: "Tous les dossiers",    desc: "Voir l'ensemble des dossiers notariaux." },
  { key: "droit_immobilier", label: "Droit Immobilier",     desc: "Ventes, baux, copropriété, servitudes, prêts." },
  { key: "droit_famille",    label: "Droit de la Famille",  desc: "Successions, donations, régimes matrimoniaux." },
  { key: "droit_entreprise", label: "Droit de l'Entreprise",desc: "Sociétés, cessions, baux commerciaux." },
  { key: "divers",           label: "Divers",               desc: "Procurations, reconnaissances de dette." },
]

const STATUTS_FILTER: { key: "tous" | DossierStatus; label: string }[] = [
  { key: "tous",       label: "Tous" },
  { key: "en_cours",   label: "En cours" },
  { key: "en_attente", label: "En attente" },
  { key: "suspendu",   label: "Suspendu" },
  { key: "cloture",    label: "Clôturé" },
]

export default function DossiersPage() {
  const [dossiers, setDossiers]               = React.useState<Dossier[]>(DOSSIERS_MOCK)
  const [vueEtude, setVueEtude]               = React.useState<boolean | null>(false)
  const [filterFamille, setFilterFamille]     = React.useState<"tous" | FamilleDossier>("tous")
  const [filterStatut, setFilterStatut]       = React.useState<"tous" | DossierStatus>("tous")
  const [search, setSearch]                   = React.useState("")
  const [view, setView]                       = React.useState<"grid" | "list">("grid")
  const [page, setPage]                       = React.useState(1)
  const [isRefreshing, setIsRefreshing]       = React.useState(false)
  const [createOpen, setCreateOpen]           = React.useState(false)
  const [detailDossier, setDetailDossier]     = React.useState<Dossier | null>(null)
  const [detailOpen, setDetailOpen]           = React.useState(false)
  const [statusDossier, setStatusDossier]     = React.useState<Dossier | null>(null)
  const [statusOpen, setStatusOpen]           = React.useState(false)
  const [archiveDossier, setArchiveDossier]   = React.useState<Dossier | null>(null)
  const [archiveOpen, setArchiveOpen]         = React.useState(false)
  const [relanceDossier, setRelanceDossier]   = React.useState<Dossier | null>(null)
  const [relanceOpen, setRelanceOpen]         = React.useState(false)
  const [dupliqueOpen, setDupliqueOpen]       = React.useState(false)
  const [dupliqueDossier, setDupliqueDossier] = React.useState<Dossier | null>(null)
  const [impressionOpen, setImpressionOpen]   = React.useState(false)
  const [impressionDossier, setImpressionDossier] = React.useState<Dossier | null>(null)
  const [tracabiliteOpen, setTracabiliteOpen] = React.useState(false)
  const [tracabiliteDossier, setTracabiliteDossier] = React.useState<Dossier | null>(null)
  const [parentIdForCreate, setParentIdForCreate] = React.useState<string | undefined>()

  const PAGE_SIZE = view === "grid" ? 8 : 10

  // Filtrage
  const filtered = React.useMemo(() => {
    let list = [...dossiers]

    // Vue clerc
    if (vueEtude === false) {
      list = list.filter(d => d.clerc === MOCK_CLERC_CONNECTE)
    }

    // Famille
    if (filterFamille !== "tous") {
      list = list.filter(d => d.famille === filterFamille)
    }

    // Statut
    if (filterStatut !== "tous") {
      list = list.filter(d => d.status === filterStatut)
    }

    // Recherche
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(d =>
        d.intitule.toLowerCase().includes(q) ||
        d.reference.toLowerCase().includes(q) ||
        d.notaire.toLowerCase().includes(q) ||
        d.clerc.toLowerCase().includes(q)
      )
    }

    return list
  }, [dossiers, vueEtude, filterFamille, filterStatut, search])

  // Reset page
  React.useEffect(() => { setPage(1) }, [filterFamille, filterStatut, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Alertes urgentes
  const alertesUrgentes = dossiers.flatMap(d => d.alertesActives).filter(a =>
    ["j1", "j3", "j7", "depasse"].includes(a.niveau)
  )

  // Stats
  const counts = {
    total:      dossiers.length,
    en_cours:   dossiers.filter(d => d.status === "en_cours").length,
    en_attente: dossiers.filter(d => d.status === "en_attente").length,
    suspendu:   dossiers.filter(d => d.status === "suspendu").length,
    cloture:    dossiers.filter(d => d.status === "cloture").length,
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handleCreate = (data: CreateDossierPayload) => {
    const newDossier: Dossier = {
      id: `dos-${Date.now()}`,
      reference: generateReference(data.famille),
      intitule: data.intitule,
      famille: data.famille,
      typeOperation: data.typeOperation,
      conditionSuspensive: data.conditionSuspensive,
      status: "en_cours",
      notaire: data.notaire,
      clerc: data.clerc,
      dateSignaturePrevue: data.dateSignaturePrevue,
      montantPrevisionnel: data.montantPrevisionnel,
      dateCreation: new Date().toISOString(),
      dateDerniereModif: new Date().toISOString(),
      nombreSousDossiers: 0,
      alertesActives: [],
      parentId: data.parentId,
    }
    setDossiers(prev => [newDossier, ...prev])
    toast.success(`Dossier ${newDossier.reference} créé`, { position: "bottom-right" })
  }

  const handleDuplicate = (d: Dossier) => {
    const ref = generateReference(d.famille)
    const dup: Dossier = {
      ...d,
      id: `dos-${Date.now()}`,
      reference: ref,
      status: "en_cours",
      dateCreation: new Date().toISOString(),
      dateDerniereModif: new Date().toISOString(),
      alertesActives: [],
      retardJours: undefined,
      nombreSousDossiers: 0,
      sousDossiers: [],
    }
    setDossiers(prev => [dup, ...prev])
    toast.success(`Dossier dupliqué : ${ref}`, { position: "bottom-right" })
  }

  const handleStatusChange = (id: string, newStatus: DossierStatus, motif: string) => {
    setDossiers(prev => prev.map(d =>
      d.id === id
        ? { ...d, status: newStatus, dateDerniereModif: new Date().toISOString() }
        : d
    ))
    toast.success(`Statut mis à jour : ${STATUS_META[newStatus].label}`, { position: "bottom-right" })
  }

  const handleArchive = (id: string) => {
    const dossier = dossiers.find(d => d.id === id)
    if (!dossier) return
    if (dossier.status !== "cloture") {
      toast.error("Seuls les dossiers clôturés peuvent être archivés", { position: "bottom-right" })
      return
    }
    setDossiers(prev => prev.filter(d => d.id !== id))
    toast.success("Dossier archivé définitivement", { position: "bottom-right" })
  }

  const handleRelance = (dossierId: string, alerte: Omit<Alerte, "id" | "dossierId">) => {
    setDossiers(prev => prev.map(d =>
      d.id === dossierId
        ? {
            ...d,
            alertesActives: [
              ...d.alertesActives,
              { ...alerte, id: `a-${Date.now()}`, dossierId },
            ],
          }
        : d
    ))
    toast.success("Relance programmée", { position: "bottom-right" })
  }

  const handleExport = (d: Dossier) => {
    setImpressionDossier(d)
    setImpressionOpen(true)
  }

  const handleImpression = (options: ImpressionOptions) => {
    const typeLabel = options.type.replace(/_/g, " ")
    const formatLabel = options.format.toUpperCase()
    toast.success(`${typeLabel} — ${formatLabel} en cours de génération…`, { position: "bottom-right" })
  }

  const handleDuplicationAvancee = (options: DuplicationOptions) => {
    const source = dossiers.find(d => d.id === options.sourceId)
    if (!source) return
    const copy: Dossier = {
      ...source,
      id: `dos-${Date.now()}`,
      reference: generateReference(source.famille),
      intitule: `${source.intitule} (copie)`,
      status: "en_cours",
      dateCreation: new Date().toISOString(),
      dateDerniereModif: new Date().toISOString(),
      alertesActives: [],
      retardJours: undefined,
      nombreSousDossiers: 0,
      sousDossiers: [],
    }
    setDossiers(prev => [copy, ...prev])
    toast.success(`Duplication effectuée — ${copy.reference}`, { position: "bottom-right" })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 600))
    setDossiers(DOSSIERS_MOCK)
    setIsRefreshing(false)
    toast.success("Données actualisées", { position: "bottom-right" })
  }

  const openDetail = (d: Dossier) => {
    setDetailDossier(d)
    setDetailOpen(true)
  }

  const openChangeStatus = (d: Dossier) => {
    setStatusDossier(d)
    setStatusOpen(true)
  }

  const openArchive = (d: Dossier) => {
    setArchiveDossier(d)
    setArchiveOpen(true)
  }

  const openRelance = (d: Dossier) => {
    setRelanceDossier(d)
    setRelanceOpen(true)
  }

  const handleAddSousDossier = (parentId: string) => {
    setParentIdForCreate(parentId)
    setDetailOpen(false)
    setTimeout(() => setCreateOpen(true), 200)
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-6">

      {/* Breadcrumb */}
      <BreadcrumbDossiers />

      <hr className="border-dashed" />

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total",      value: counts.total,      color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950/30" },
          { label: "En cours",   value: counts.en_cours,   color: "text-blue-600",   bg: STATUS_META.en_cours.bg },
          { label: "En attente", value: counts.en_attente, color: "text-amber-600",  bg: STATUS_META.en_attente.bg },
          { label: "Suspendus",  value: counts.suspendu,   color: "text-orange-600", bg: STATUS_META.suspendu.bg },
          { label: "Clôturés",   value: counts.cloture,    color: "text-slate-600",  bg: STATUS_META.cloture.bg },
        ].map(s => (
          <div key={s.label} className={cn("rounded-xl px-5 py-4", s.bg)}>
            <p className={cn("text-xs font-medium", s.color)}>{s.label}</p>
            <p className={cn("text-3xl font-bold mt-1 tabular-nums", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      <hr className="border-dashed" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between sm:bg-muted/30 sm:rounded-lg sm:px-4 sm:py-3">
        <div>
          <h1 className="text-xl font-bold">Dossiers Notariaux</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {vueEtude
              ? "Vue complète de l'étude — tous les dossiers."
              : `Mes dossiers — ${MOCK_CLERC_CONNECTE}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Toggle vue */}
          <div className="flex items-center rounded-xl border bg-muted/50 p-1 gap-0.5">
            {[
              { label: "Tous",      value: "tous" },
              { label: "Mes dossiers", value: "mes" },
              { label: "Vue étude", value: "etude" },
            ].map(opt => {
              const active =
                opt.value === "tous"  ? (vueEtude === null) :
                opt.value === "mes"   ? (vueEtude === false) :
                                        (vueEtude === true)
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    opt.value === "tous"  ? setVueEtude(null as any) :
                    opt.value === "mes"   ? setVueEtude(false) :
                                           setVueEtude(true)
                  }
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    active
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          <LoadingButton
            size="sm"
            variant="secondary"
            isLoading={isRefreshing}
            className="border-0 shadow-none font-semibold text-xs cursor-pointer"
            onClick={handleRefresh}
          >
            <IconRefresh className="h-4 w-4" />
            Rafraîchir
          </LoadingButton>

          <Button
            size="sm"
            className="shadow-none font-semibold gap-1.5 cursor-pointer"
            onClick={() => { setParentIdForCreate(undefined); setCreateOpen(true) }}
          >
            <IconPlus className="h-4 w-4" />
            Nouveau dossier
          </Button>
        </div>
      </div>

      <hr className="border-dashed" />

      {/* Filtres famille */}
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {FAMILLES_FILTER.map(f => {
          const active = filterFamille === f.key
          const meta = f.key !== "tous" ? FAMILLE_META[f.key as FamilleDossier] : null
          const count = f.key === "tous"
            ? filtered.length
            : dossiers.filter(d => d.famille === f.key).length

          return (
            <button
              key={f.key}
              onClick={() => setFilterFamille(f.key)}
              className={cn(
                "relative flex flex-col shrink-0 w-52 rounded-xl border border-dashed p-4 text-left transition-all cursor-pointer",
                active
                  ? "bg-foreground text-background border-foreground shadow"
                  : "bg-card hover:bg-muted/50"
              )}
            >
              <span className={cn("text-sm font-bold leading-snug", active ? "text-background" : "text-foreground")}>
                {f.label}
              </span>
              <span className={cn("text-[11px] mt-1 leading-relaxed line-clamp-2", active ? "text-background/60" : "text-muted-foreground")}>
                {f.desc}
              </span>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {meta ? (
                    <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-background/60" : meta.dot)} />
                  ) : (
                    <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-background/60" : "bg-blue-400")} />
                  )}
                  <span className={cn("text-[11px]", active ? "text-background/60" : "text-muted-foreground")}>
                    {f.key === "tous" ? "Catalogue complet" : meta?.label ?? ""}
                  </span>
                </div>
                <span className={cn(
                  "rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums",
                  active ? "bg-background/15 text-background" : "bg-muted text-foreground"
                )}>
                  {count}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <hr className="border-dashed" />

      {/* Barre filtres statut + search + toggle vue */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Pills statut */}
        <div className="flex items-center rounded-xl border bg-muted/50 p-1 gap-0.5 shrink-0">
          {STATUTS_FILTER.map(s => {
            const active = filterStatut === s.key
            const meta = s.key !== "tous" ? STATUS_META[s.key as DossierStatus] : null
            return (
              <button
                key={s.key}
                onClick={() => setFilterStatut(s.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {meta && (
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    active ? "bg-background" : meta.dot
                  )} />
                )}
                {s.label}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un dossier…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 border-0 bg-muted/50 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Vue grille/liste */}
        <div className="flex items-center rounded-md border bg-muted/40 p-0.5 ml-auto">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "rounded p-1.5 transition-colors cursor-pointer",
              view === "grid" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "rounded p-1.5 transition-colors cursor-pointer",
              view === "list" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <hr className="border-dashed" />

      {/* Résultats */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
          <Search className="h-8 w-8 opacity-20" />
          <p className="text-sm">Aucun dossier correspondant</p>
          <p className="text-xs">Modifiez vos filtres ou créez un nouveau dossier.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map(d => (
            <DossierCard
              key={d.id}
              dossier={d}
              onDetail={openDetail}
              onDuplicate={() => { setDupliqueDossier(d); setDupliqueOpen(true) }}
              onChangeStatus={openChangeStatus}
              onArchive={openArchive}
              onRelance={openRelance}
              onExport={handleExport}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {paginated.map(d => (
            <DossierRow
              key={d.id}
              dossier={d}
              onDetail={openDetail}
              onDuplicate={() => { setDupliqueDossier(d); setDupliqueOpen(true) }}
              onChangeStatus={openChangeStatus}
              onArchive={openArchive}
              onRelance={openRelance}
              onExport={handleExport}
            />
          ))}
        </div>
      )}

      <hr className="border-dashed" />

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-foreground">
            Page {page} sur {totalPages}
          </span>
          <div className="flex items-center gap-1">
            {[
              { icon: ChevronsLeft,  action: () => setPage(1),           disabled: page === 1 },
              { icon: ChevronLeft,   action: () => setPage(p => p - 1),  disabled: page === 1 },
              { icon: ChevronRight,  action: () => setPage(p => p + 1),  disabled: page === totalPages },
              { icon: ChevronsRight, action: () => setPage(totalPages),  disabled: page === totalPages },
            ].map(({ icon: Icon, action, disabled }, i) => (
              <button
                key={i}
                onClick={action}
                disabled={disabled}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border border-dashed transition-colors cursor-pointer",
                  disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-muted"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Sheets ───────────────────────────────────────────────────────────── */}

      <CreateDossierSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        parentId={parentIdForCreate}
      />

      <DossierDetailSheet
        dossier={detailDossier}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusChange={handleStatusChange}
        onAddSousDossier={handleAddSousDossier}
        onOpenParent={(parentId) => {
          const parent = dossiers.find(d => d.id === parentId)
          if (parent) openDetail(parent)
        }}
      />

      <StatutTransitionSheet
        dossier={statusDossier}
        open={statusOpen}
        onOpenChange={setStatusOpen}
        onConfirm={handleStatusChange}
      />

      <ArchiveConfirmSheet
        dossier={archiveDossier}
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        onConfirm={handleArchive}
      />

      <RelanceSheet
        dossier={relanceDossier}
        open={relanceOpen}
        onOpenChange={setRelanceOpen}
        onConfirm={handleRelance}
      />

      <DuplicationSheet
        dossier={dupliqueDossier}
        open={dupliqueOpen}
        onOpenChange={setDupliqueOpen}
        onConfirm={handleDuplicationAvancee}
        dossiersList={dossiers}
      />

      <ImpressionSheet
        dossier={impressionDossier}
        open={impressionOpen}
        onOpenChange={setImpressionOpen}
        onConfirm={handleImpression}
      />

      <TracabiliteSheet
        dossier={tracabiliteDossier}
        open={tracabiliteOpen}
        onOpenChange={setTracabiliteOpen}
      />

    </div>
  )
}
