"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/loading-button"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Search,
  ChevronDown,
  Bookmark,
  Plus,
  Folder,
  Users,
  MapPin,
  FileText,
  User,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { IconRefresh, IconSparkles, IconPlus } from "@tabler/icons-react"
import {
  DOSSIERS_MOCK,
  STATUS_META,
  FAMILLE_META,
  getTypeLabel,
  formatDate,
  type Dossier,
  type DossierStatus,
  type FamilleDossier,
} from "../dossiers/_lib/dossiers-data"
import { AlerteBadge } from "../dossiers/_components/alerte-badge"
import {
  RECHERCHES_SAUVEGARDEES_MOCK,
  MOCK_NOTAIRES,
  MOCK_CLERCS,
  TYPES_ACTES,
  similarity,
  SEUIL_FUZZY,
  type CritereRecherche,
  type RechercheResult,
  type CategorieRecherche,
  type RechercheSauvegardee,
} from "./_lib/recherche-data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// ─── ResultCard ───────────────────────────────────────────────────────────────

function ResultCard({ result }: { result: RechercheResult }) {
  const dossier = result.dossier
  const statusMeta = STATUS_META[dossier.status]
  const familleMeta = FAMILLE_META[dossier.famille]
  const retardJours = dossier.retardJours ?? 0

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-dashed bg-card shadow-sm">
      {/* Header coloré */}
      <div className={cn("relative px-5 pt-9 pb-5", statusMeta.headerBg)}>
        {/* Badge statut — top right */}
        <div className="absolute top-3 right-4">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white",
            statusMeta.badgeBg
          )}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            {statusMeta.label.toUpperCase()}
          </span>
        </div>

        {/* Badge alerte — top left */}
        {dossier.alertesActives.length > 0 && (
          <div className="absolute top-3 left-4">
            <AlerteBadge alerte={dossier.alertesActives[0]} />
          </div>
        )}

        {/* Score fuzzy si < 100 */}
        {result.score < 100 && dossier.alertesActives.length === 0 && (
          <div className="absolute top-3 left-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
              ~{result.score}%
            </span>
          </div>
        )}

        {/* Référence */}
        <p className={cn("text-[10px] font-mono mb-1 opacity-70", statusMeta.headerText)}>
          {dossier.reference}
        </p>

        {/* Titre */}
        <h3 className={cn("text-xl font-bold leading-tight line-clamp-2", statusMeta.headerText)}>
          {dossier.intitule}
        </h3>

        {/* Famille + type */}
        <p className={cn("text-[11px] mt-1.5 opacity-70", statusMeta.headerText)}>
          {familleMeta.label} · {getTypeLabel(dossier.famille, dossier.typeOperation)}
        </p>
      </div>

      {/* Corps */}
      <div className="flex flex-col divide-y divide-dashed">
        {/* Notaire / Clerc */}
        <div className="grid grid-cols-2 divide-x divide-dashed">
          <div className="px-4 py-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Notaire</p>
            <p className="text-sm font-semibold truncate mt-0.5">{dossier.notaire}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Clerc</p>
            <p className="text-sm font-semibold truncate mt-0.5">{dossier.clerc}</p>
          </div>
        </div>

        {/* Date signature */}
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Date signature</p>
          <div className="text-right">
            <p className="text-xs font-semibold">{formatDate(dossier.dateSignaturePrevue)}</p>
            {retardJours > 0 && (
              <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5 justify-end">
                <AlertTriangle className="h-3 w-3" />
                +{retardJours} jours de retard
              </p>
            )}
          </div>
        </div>

        {/* Montant */}
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Montant prévisionnel</p>
          <p className="text-sm font-bold tabular-nums">
            {dossier.montantPrevisionnel > 0
              ? `${dossier.montantPrevisionnel.toLocaleString("fr-FR")} FCFA`
              : "—"}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm cursor-pointer hover:bg-muted transition-colors">
            Voir le dossier
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          {result.matchedField && (
            <span className="text-[10px] text-muted-foreground">
              via <span className="font-semibold text-foreground">{result.matchedField}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

const CRITERES_VIDES: CritereRecherche = {
  intitule: "", reference: "", notaire: "", clerc: "", status: "", famille: "",
  nomPartie: "", raisonSociale: "", numeroCNI: "",
  adresseBien: "", numeroTF: "", referenceCadastre: "",
  typeActe: "", dateActe: "", numeroActe: "",
  dateDebut: "", dateFin: "",
}

export default function RecherchePage() {
  const [criteres, setCriteres]       = React.useState<CritereRecherche>(CRITERES_VIDES)
  const [openSections, setOpenSections] = React.useState({
    dossier: true, partie: false, bien: false, acte: false,
  })
  const [resultats, setResultats]     = React.useState<RechercheResult[]>([])
  const [filtreCateg, setFiltreCateg] = React.useState<CategorieRecherche | "tous">("tous")
  const [isSearching, setIsSearching] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)
  const [recherches, setRecherches]   = React.useState<RechercheSauvegardee[]>(RECHERCHES_SAUVEGARDEES_MOCK)
  const [sauvegardeOpen, setSauvegardeOpen] = React.useState(false)
  const [nomSauvegarde, setNomSauvegarde]   = React.useState("")

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(p => ({ ...p, [key]: !p[key] }))
  }

  const getActiveCriteres = (cat: string): number => {
    const keys: Record<string, (keyof CritereRecherche)[]> = {
      dossier: ["intitule", "reference", "notaire", "clerc", "status", "famille", "dateDebut", "dateFin"],
      partie:  ["nomPartie", "raisonSociale", "numeroCNI"],
      bien:    ["adresseBien", "numeroTF", "referenceCadastre"],
      acte:    ["typeActe", "dateActe", "numeroActe"],
    }
    return (keys[cat] ?? []).filter(k => criteres[k] && criteres[k] !== "").length
  }

  const performSearch = async () => {
    setIsSearching(true)
    await new Promise(r => setTimeout(r, 800))

    const results: RechercheResult[] = []
    const dossiers: Dossier[] = DOSSIERS_MOCK

    for (const dossier of dossiers) {
      let score = 0
      let matchedField: string | undefined
      let highlight: string | undefined

      // Fuzzy sur intitulé
      if (criteres.intitule) {
        const s = similarity(dossier.intitule, criteres.intitule)
        if (s >= SEUIL_FUZZY) {
          score = s
          matchedField = "intitulé"
          highlight = dossier.intitule
        }
      }

      // Référence exacte
      if (criteres.reference && dossier.reference.toLowerCase().includes(criteres.reference.toLowerCase())) {
        score = Math.max(score, 95)
        matchedField = "référence"
        highlight = dossier.reference
      }

      // Notaire
      if (criteres.notaire && dossier.notaire === criteres.notaire) {
        score = Math.max(score, 100)
        if (!matchedField) { matchedField = "notaire"; highlight = dossier.notaire }
      }

      // Clerc
      if (criteres.clerc && dossier.clerc === criteres.clerc) {
        score = Math.max(score, 100)
        if (!matchedField) { matchedField = "clerc"; highlight = dossier.clerc }
      }

      // Statut
      if (criteres.status && dossier.status !== criteres.status) continue

      // Famille
      if (criteres.famille && dossier.famille !== criteres.famille) continue

      // Si aucun critère spécifique → inclure tout avec score 100
      const hasCritere = Object.values(criteres).some(v => v && v !== "")
      if (!hasCritere) { score = 100; matchedField = undefined; highlight = undefined }

      if (score > 0 || !hasCritere) {
        results.push({
          type: "dossier",
          score: score || 100,
          dossier,
          matchedField,
          highlight,
        })
      }
    }

    results.sort((a, b) => b.score - a.score)
    setResultats(results)
    setHasSearched(true)
    setIsSearching(false)
  }

  const appliquerRecherche = (criteresSauvegardes: CritereRecherche) => {
    setCriteres({ ...CRITERES_VIDES, ...criteresSauvegardes })
    setOpenSections({ dossier: true, partie: false, bien: false, acte: false })
  }

  const reinitialiser = () => {
    setCriteres(CRITERES_VIDES)
    setResultats([])
    setHasSearched(false)
    setFiltreCateg("tous")
  }

  const sauvegarderRecherche = () => {
    if (!nomSauvegarde.trim()) return
    const nouvelle: RechercheSauvegardee = {
      id: `rs-${Date.now()}`,
      nom: nomSauvegarde,
      criteres: { ...criteres },
      createdAt: new Date().toISOString(),
      utilisateur: "FALL Ibrahima",
    }
    setRecherches(p => [nouvelle, ...p])
    setSauvegardeOpen(false)
    setNomSauvegarde("")
    toast.success(`Recherche "${nomSauvegarde}" sauvegardée`, { position: "bottom-right" })
  }

  const filteredResultats = filtreCateg === "tous"
    ? resultats
    : resultats.filter(r => r.type === filtreCateg)

  const counts: Record<string, number> = {
    tous: resultats.length,
    dossier: resultats.filter(r => r.type === "dossier").length,
    partie: resultats.filter(r => r.type === "partie").length,
    bien: resultats.filter(r => r.type === "bien").length,
    acte: resultats.filter(r => r.type === "acte").length,
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
            <BreadcrumbPage className="text-xs font-semibold">Recherche globale</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <hr className="border-dashed" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between sm:bg-muted/30 sm:rounded-lg sm:px-4 sm:py-3">
        <div>
          <h1 className="text-xl font-bold">Recherche globale</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Recherchez parmi tous les dossiers, parties, biens et actes
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs cursor-pointer"
            onClick={() => setSauvegardeOpen(true)}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Sauvegarder
          </Button>
          <LoadingButton
            size="sm"
            variant="secondary"
            isLoading={false}
            className="border-0 shadow-none font-semibold text-xs cursor-pointer"
            onClick={reinitialiser}
          >
            <IconRefresh className="h-4 w-4" />
            Réinitialiser
          </LoadingButton>
        </div>
      </div>

      <hr className="border-dashed" />

      {/* Raccourcis sauvegardés */}
      <div className="flex flex-wrap gap-2">
        {recherches.map(rs => (
          <button
            key={rs.id}
            onClick={() => appliquerRecherche(rs.criteres)}
            className="flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-muted transition-colors"
          >
            <Bookmark className="h-3 w-3 text-foreground fill-foreground" />
            {rs.nom}
          </button>
        ))}
      </div>

      <hr className="border-dashed" />

      {/* Formulaire critères */}
      <div className="space-y-3">
        {[
          { key: "dossier" as const, label: "Dossier",           icon: Folder },
          { key: "partie"  as const, label: "Partie (client)",   icon: Users  },
          { key: "bien"    as const, label: "Bien immobilier",   icon: MapPin },
          { key: "acte"    as const, label: "Acte",              icon: FileText },
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
              <div className="px-5 pb-4 pt-1 border-t border-dashed">
                {cat.key === "dossier" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold">Intitulé / Noms des parties</Label>
                      <Input placeholder="ex: NDIAYE, Moussa…" value={criteres.intitule ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, intitule: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm" />
                      {criteres.intitule && (
                        <p className="text-[10px] text-blue-500 flex items-center gap-1">
                          <IconSparkles className="h-3 w-3" />
                          Recherche approximative activée (NDIAYE ≈ NDAYE ≈ N'DIAYE)
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Référence dossier</Label>
                      <Input placeholder="ex: IMM-2024-1042" value={criteres.reference ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, reference: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Statut</Label>
                      <Select value={criteres.status || "_all"} onValueChange={v => setCriteres(p => ({ ...p, status: v === "_all" ? "" : v as DossierStatus }))}>
                        <SelectTrigger className="border-0 bg-muted h-9 text-sm">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_all">Tous</SelectItem>
                          {(["en_cours","en_attente","suspendu","cloture"] as DossierStatus[]).map(s => (
                            <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Notaire</Label>
                      <Select value={criteres.notaire || "_all"} onValueChange={v => setCriteres(p => ({ ...p, notaire: v === "_all" ? "" : v }))}>
                        <SelectTrigger className="border-0 bg-muted h-9 text-sm">
                          <SelectValue placeholder="Tous les notaires" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_all">Tous</SelectItem>
                          {MOCK_NOTAIRES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Clerc</Label>
                      <Select value={criteres.clerc || "_all"} onValueChange={v => setCriteres(p => ({ ...p, clerc: v === "_all" ? "" : v }))}>
                        <SelectTrigger className="border-0 bg-muted h-9 text-sm">
                          <SelectValue placeholder="Tous les clercs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_all">Tous</SelectItem>
                          {MOCK_CLERCS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Période — Du</Label>
                      <Input type="date" value={criteres.dateDebut ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, dateDebut: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Au</Label>
                      <Input type="date" value={criteres.dateFin ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, dateFin: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm" />
                    </div>
                  </div>
                )}

                {cat.key === "partie" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold">Nom / Prénom</Label>
                      <Input placeholder="ex: NDIAYE Moussa" value={criteres.nomPartie ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, nomPartie: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Raison sociale</Label>
                      <Input placeholder="ex: SARL BÂTI PLUS" value={criteres.raisonSociale ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, raisonSociale: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">N° CNI</Label>
                      <Input placeholder="ex: 1234567890123" value={criteres.numeroCNI ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, numeroCNI: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm font-mono" />
                    </div>
                  </div>
                )}

                {cat.key === "bien" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold">Adresse du bien</Label>
                      <Input placeholder="ex: Rue 10, Dakar…" value={criteres.adresseBien ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, adresseBien: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold flex items-center gap-1.5">
                        N° Titre Foncier
                        <span className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[9px] px-1.5 font-bold">Fréquent</span>
                      </Label>
                      <Input placeholder="ex: TF-1042/DK" value={criteres.numeroTF ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, numeroTF: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Réf. cadastrale</Label>
                      <Input placeholder="ex: CAD-2024-0891" value={criteres.referenceCadastre ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, referenceCadastre: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm font-mono" />
                    </div>
                  </div>
                )}

                {cat.key === "acte" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Type d'acte</Label>
                      <Select value={criteres.typeActe || "_all"} onValueChange={v => setCriteres(p => ({ ...p, typeActe: v === "_all" ? "" : v }))}>
                        <SelectTrigger className="border-0 bg-muted h-9 text-sm">
                          <SelectValue placeholder="Tous les types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_all">Tous</SelectItem>
                          {TYPES_ACTES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Date de l'acte</Label>
                      <Input type="date" value={criteres.dateActe ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, dateActe: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">N° de l'acte</Label>
                      <Input placeholder="ex: ACTE-2024-0042" value={criteres.numeroActe ?? ""}
                        onChange={e => setCriteres(p => ({ ...p, numeroActe: e.target.value }))}
                        className="border-0 bg-muted h-9 text-sm font-mono" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-center pt-2">
          <LoadingButton
            isLoading={isSearching}
            onClick={performSearch}
            className="gap-2 px-8 cursor-pointer"
            size="lg"
          >
            <Search className="h-4 w-4" />
            Lancer la recherche
          </LoadingButton>
        </div>
      </div>

      <hr className="border-dashed" />

      {/* Résultats */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: "tous" as const,    label: "Tous" },
              { key: "dossier" as const, label: "Dossiers" },
              { key: "partie" as const,  label: "Parties" },
              { key: "bien" as const,    label: "Biens" },
              { key: "acte" as const,    label: "Actes" },
            ].map(tab => (
              <button key={tab.key}
                onClick={() => setFiltreCateg(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all",
                  filtreCateg === tab.key
                    ? "bg-foreground text-background border-foreground shadow"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  filtreCateg === tab.key ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                )}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          {filteredResultats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
              <Search className="h-8 w-8 opacity-20" />
              <p className="text-sm">Aucun résultat</p>
              <p className="text-xs">Élargissez vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResultats.map((r, i) => (
                <ResultCard key={`${r.dossier.id}-${i}`} result={r} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sheet sauvegarde */}
      <Sheet open={sauvegardeOpen} onOpenChange={setSauvegardeOpen}>
        <SheetContent side="right" className="sm:max-w-sm flex flex-col p-0 gap-0">
          <SheetHeader className="px-6 py-5 border-b border-dashed">
            <SheetTitle className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Sauvegarder la recherche
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Nom de la recherche</Label>
              <Input
                placeholder="ex: Mes ventes en cours"
                value={nomSauvegarde}
                onChange={e => setNomSauvegarde(e.target.value)}
                className="border-0 bg-muted h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Critères actifs
              </p>
              {Object.entries(criteres)
                .filter(([, v]) => v && v !== "")
                .map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2">
                    <span className="text-xs text-muted-foreground font-medium">{k}</span>
                    <span className="text-xs font-semibold ml-auto">{String(v)}</span>
                  </div>
                ))}
              {Object.values(criteres).every(v => !v || v === "") && (
                <p className="text-xs text-muted-foreground">Aucun critère actif</p>
              )}
            </div>
          </div>
          <SheetFooter className="px-6 py-4 border-t border-dashed flex gap-2">
            <Button variant="outline" onClick={() => setSauvegardeOpen(false)} className="flex-1 cursor-pointer">
              Annuler
            </Button>
            <Button onClick={sauvegarderRecherche} className="flex-1 cursor-pointer gap-2">
              <Bookmark className="h-4 w-4" />
              Sauvegarder
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

    </div>
  )
}
