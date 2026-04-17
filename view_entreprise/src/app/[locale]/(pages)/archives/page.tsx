"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Archive,
  Lock,
  Eye,
  Search,
  Download,
  Printer,
  Tag,
} from "lucide-react"
import { RotateCcw } from "lucide-react"
import {
  ARCHIVES_MOCK,
  MOCK_NOTAIRES,
  type DossierArchive,
} from "../recherche/_lib/recherche-data"
import { FAMILLE_META, type FamilleDossier } from "../dossiers/_lib/dossiers-data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// ─── ArchiveCard ──────────────────────────────────────────────────────────────

function ArchiveCard({ archive, onDetail }: {
  archive: DossierArchive
  onDetail: (a: DossierArchive) => void
}) {
  const familleMeta = FAMILLE_META[archive.famille]
  const conservLabel = archive.typeConservation === "minute"
    ? "Minute — Conservation indéfinie"
    : archive.typeConservation === "document"
    ? `Document — ${archive.dureeConservationAns} ans`
    : `Copie — ${archive.dureeConservationAns} ans`

  return (
    <div className="rounded-2xl border border-dashed bg-card flex flex-col overflow-hidden">
      <div className="relative bg-slate-100 dark:bg-slate-900 px-5 py-4">
        <div className="absolute top-3 right-4">
          <span className="flex items-center gap-1 rounded-full bg-slate-600 text-white px-2 py-0.5 text-[10px] font-semibold">
            <Lock className="h-2.5 w-2.5" />
            Archivé
          </span>
        </div>
        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
          {archive.reference}
        </p>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight pr-16">
          {archive.intitule}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {familleMeta.label} · {archive.typeOperation.replace(/_/g, " ")}
        </p>
      </div>

      <div className="flex-1 divide-y divide-dashed text-xs">
        <div className="grid grid-cols-2 divide-x divide-dashed px-5 py-3">
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Archivé le</p>
            <p className="font-semibold mt-0.5">{new Date(archive.dateArchivage).toLocaleDateString("fr-FR")}</p>
          </div>
          <div className="pl-4">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Signé le</p>
            <p className="font-semibold mt-0.5">{new Date(archive.dateSignature).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>

        <div className="px-5 py-3 flex items-center gap-2">
          <Archive className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Conservation</p>
            <p className={cn("font-semibold",
              archive.typeConservation === "minute" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            )}>{conservLabel}</p>
          </div>
        </div>

        {archive.etiquettePhysique && (
          <div className="px-5 py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Classement physique</p>
            <p className="font-mono font-semibold mt-0.5">{archive.etiquettePhysique}</p>
            {archive.referenceRayon && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{archive.referenceRayon}</p>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-dashed flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs gap-1.5 cursor-pointer"
          onClick={() => onDetail(archive)}
        >
          <Eye className="h-3.5 w-3.5" />
          Consulter
        </Button>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          Lecture seule
        </div>
      </div>
    </div>
  )
}

// ─── ArchiveDetailSheet ───────────────────────────────────────────────────────

function ArchiveDetailSheet({ archive, open, onOpenChange }: {
  archive: DossierArchive | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  if (!archive) return null

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  })

  const infos = [
    { label: "Référence",         value: archive.reference },
    { label: "Intitulé",          value: archive.intitule },
    { label: "Famille",           value: FAMILLE_META[archive.famille].label },
    { label: "Type d'opération",  value: archive.typeOperation.replace(/_/g, " ") },
    { label: "Notaire",           value: archive.notaire },
    { label: "Clerc",             value: archive.clerc },
    { label: "Date de création",  value: formatDate(archive.dateCreation) },
    { label: "Date de signature", value: formatDate(archive.dateSignature) },
    { label: "Date d'archivage",  value: formatDate(archive.dateArchivage) },
    { label: "Montant",           value: archive.montantPrevisionnel.toLocaleString("fr-FR") + " FCFA" },
    { label: "Conservation",      value: archive.typeConservation === "minute" ? "Minute (indéfinie)" : `${archive.typeConservation} — ${archive.dureeConservationAns} ans` },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-2xl flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-5 border-b border-dashed">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900">
              <Archive className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-base font-bold">{archive.reference}</p>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">{archive.intitule}</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Bannière lecture seule */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30 px-4 py-3 flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-gray-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Dossier archivé — Lecture seule</p>
              <p className="text-[10px] text-gray-600/80 dark:text-gray-400/70">
                Archivé le {formatDate(archive.dateArchivage)} · Conservation{" "}
                {archive.typeConservation === "minute" ? "indéfinie (minute)" : `${archive.dureeConservationAns} ans`}
              </p>
            </div>
          </div>

          {/* Étiquette physique */}
          {archive.etiquettePhysique && (
            <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3 flex items-center gap-3">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold">{archive.etiquettePhysique}</p>
                <p className="text-[10px] text-muted-foreground">{archive.referenceRayon}</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto h-7 text-xs gap-1.5 cursor-pointer"
                onClick={() => toast.success("Impression étiquette en cours…", { position: "bottom-right" })}>
                <Printer className="h-3 w-3" />
                Imprimer étiquette
              </Button>
            </div>
          )}

          {/* Informations */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Informations du dossier
            </p>
            <div className="divide-y divide-dashed rounded-xl border border-dashed overflow-hidden">
              {infos.map(info => (
                <div key={info.label} className="flex items-center justify-between px-4 py-2.5 gap-4">
                  <span className="text-xs text-muted-foreground font-medium shrink-0">{info.label}</span>
                  <span className="text-xs font-semibold text-right">{info.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Restauration */}
          <div className="rounded-lg border border-dashed border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20 px-4 py-3 flex items-center gap-3">
            <RotateCcw className="h-4 w-4 text-purple-500 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">Restauration</p>
              <p className="text-[10px] text-purple-600/80 dark:text-purple-400/70">
                Autorisée pour : {archive.restaurablePar.join(", ")}
              </p>
            </div>
            <Button variant="outline" size="sm"
              className="h-7 text-xs border-purple-300 text-purple-700 dark:text-purple-300 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
              onClick={() => toast.success("Demande de restauration envoyée", { position: "bottom-right" })}>
              Restaurer
            </Button>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-dashed flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 cursor-pointer">
            Fermer
          </Button>
          <Button variant="outline" className="flex-1 cursor-pointer gap-2"
            onClick={() => toast.success("Impression de la fiche en cours…", { position: "bottom-right" })}>
            <Printer className="h-4 w-4" />
            Imprimer la fiche
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ─── Page Archives ────────────────────────────────────────────────────────────

type TypeConservFilter = "tous" | "minute" | "document" | "copie"

export default function ArchivesPage() {
  const [archives]             = React.useState<DossierArchive[]>(ARCHIVES_MOCK)
  const [filterType, setFilterType]     = React.useState<TypeConservFilter>("tous")
  const [filterFamille, setFilterFamille] = React.useState<FamilleDossier | "">("")
  const [filterNotaire, setFilterNotaire] = React.useState("")
  const [search, setSearch]    = React.useState("")
  const [detailArchive, setDetailArchive] = React.useState<DossierArchive | null>(null)
  const [detailOpen, setDetailOpen]       = React.useState(false)

  const filtered = React.useMemo(() => {
    let list = [...archives]
    if (filterType !== "tous") list = list.filter(a => a.typeConservation === filterType)
    if (filterFamille) list = list.filter(a => a.famille === filterFamille)
    if (filterNotaire) list = list.filter(a => a.notaire === filterNotaire)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.reference.toLowerCase().includes(q) ||
        a.intitule.toLowerCase().includes(q) ||
        a.notaire.toLowerCase().includes(q)
      )
    }
    return list
  }, [archives, filterType, filterFamille, filterNotaire, search])

  const openDetail = (a: DossierArchive) => {
    setDetailArchive(a)
    setDetailOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-6">

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dossiers" className="text-xs text-muted-foreground hover:text-foreground">
              Dossiers Notariaux
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-semibold">Archives</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <hr className="border-dashed" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between sm:bg-muted/30 sm:rounded-lg sm:px-4 sm:py-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Archive className="h-5 w-5 text-slate-500" />
            Archives Notariales
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consultation en lecture seule — Conservation 50 ans minimum
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Rechercher…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 border-0 bg-muted/50 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 w-48"
            />
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs cursor-pointer"
            onClick={() => toast.success("Export CSV en cours…", { position: "bottom-right" })}>
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>
        </div>
      </div>

      <hr className="border-dashed" />

      {/* Bannière lecture seule */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30 px-4 py-3 flex items-center gap-2.5">
        <Lock className="h-4 w-4 text-gray-500 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Dossiers archivés — Lecture seule stricte
          </p>
          <p className="text-[10px] text-gray-600/80 dark:text-gray-400/70">
            Restauration possible uniquement par notaire ou administrateur habilité.
          </p>
        </div>
      </div>

      <hr className="border-dashed" />

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type conservation */}
        <div className="flex items-center rounded-xl border bg-muted/50 p-1 gap-0.5">
          {[
            { key: "tous" as const,     label: "Tous" },
            { key: "minute" as const,   label: "Minutes (∞)" },
            { key: "document" as const, label: "Documents (50 ans)" },
            { key: "copie" as const,    label: "Copies" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilterType(f.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                filterType === f.key
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Famille */}
        <Select value={filterFamille || "_all"} onValueChange={v => setFilterFamille(v === "_all" ? "" : v as FamilleDossier)}>
          <SelectTrigger className="border-0 bg-muted/50 h-8 text-xs w-48">
            <SelectValue placeholder="Famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Toutes les familles</SelectItem>
            <SelectItem value="droit_immobilier">Droit Immobilier</SelectItem>
            <SelectItem value="droit_famille">Droit de la Famille</SelectItem>
            <SelectItem value="droit_entreprise">Droit de l'Entreprise</SelectItem>
            <SelectItem value="divers">Divers</SelectItem>
          </SelectContent>
        </Select>

        {/* Notaire */}
        <Select value={filterNotaire || "_all"} onValueChange={v => setFilterNotaire(v === "_all" ? "" : v)}>
          <SelectTrigger className="border-0 bg-muted/50 h-8 text-xs w-48">
            <SelectValue placeholder="Notaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Tous les notaires</SelectItem>
            {MOCK_NOTAIRES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} archive{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <hr className="border-dashed" />

      {/* Grille */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
          <Archive className="h-8 w-8 opacity-20" />
          <p className="text-sm">Aucune archive correspondante</p>
          <p className="text-xs">Modifiez vos filtres de recherche.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(a => (
            <ArchiveCard key={a.id} archive={a} onDetail={openDetail} />
          ))}
        </div>
      )}

      <ArchiveDetailSheet
        archive={detailArchive}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

    </div>
  )
}
