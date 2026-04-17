"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingButton } from "@/components/loading-button"
import { IconRefresh } from "@tabler/icons-react"
import {
  User,
  UserCheck,
  Tag,
  FileText,
  Calendar,
  Banknote,
  GitBranch,
  Clock,
  RefreshCw,
  AlertCircle,
  PauseCircle,
  AlertTriangle,
  CheckCircle2,
  Bell,
} from "lucide-react"
import {
  STATUS_META,
  FAMILLE_META,
  getTypeLabel,
  formatDate,
  type Dossier,
  type DossierStatus,
} from "../_lib/dossiers-data"
import { SousDossierTree } from "./sous-dossier-tree"
import { AlerteBadge } from "./alerte-badge"

interface DossierDetailSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onStatusChange: (id: string, s: DossierStatus, motif: string) => void
  onAddSousDossier: (parentId: string) => void
  onOpenParent?: (parentId: string) => void
}

function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType
  label: string
  value?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-start gap-3 py-2 border-b border-dashed", className)}>
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium">{value ?? "—"}</div>
      </div>
    </div>
  )
}

// Mock timeline events
const buildTimeline = (dossier: Dossier) => [
  { date: dossier.dateCreation,        label: "Dossier créé",                       color: "bg-blue-500" },
  { date: dossier.dateDerniereModif,   label: "Dernière modification",               color: "bg-slate-400" },
  { date: dossier.dateSignaturePrevue, label: "Date de signature prévue",            color: "bg-emerald-500" },
  { date: dossier.dateCreation,        label: "Affectation notaire",                 color: "bg-purple-500" },
  { date: dossier.dateDerniereModif,   label: "Alerte programmée",                  color: "bg-amber-500" },
  { date: dossier.dateCreation,        label: "Dossier ouvert en étude",             color: "bg-indigo-500" },
]

export function DossierDetailSheet({
  dossier,
  open,
  onOpenChange,
  onStatusChange,
  onAddSousDossier,
  onOpenParent,
}: DossierDetailSheetProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("informations")

  React.useEffect(() => {
    if (!open) {
      setActiveTab("informations")
      setIsRefreshing(false)
    }
  }, [open])

  if (!dossier) return null

  const statusMeta = STATUS_META[dossier.status]
  const familleMeta = FAMILLE_META[dossier.famille]
  const firstLetter = dossier.intitule.charAt(0).toUpperCase()
  const retardJours = dossier.retardJours ?? 0
  const timeline = buildTimeline(dossier)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 600))
    setIsRefreshing(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-4xl flex flex-col gap-0 p-0 overflow-hidden">

        {/* Header */}
        <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold",
              statusMeta.bg,
              statusMeta.text
            )}>
              {firstLetter}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <SheetTitle className="text-base truncate">{dossier.intitule}</SheetTitle>
              </div>
              <SheetDescription className="font-mono text-xs mt-0.5">{dossier.reference}</SheetDescription>
            </div>
            <div className="flex items-center gap-1.5 mr-8 flex-wrap">
              <span className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                statusMeta.bg,
                statusMeta.text
              )}>
                <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dot)} />
                {statusMeta.label}
              </span>
              <span className={cn(
                "rounded border px-2 py-0.5 text-[10px] font-medium",
                familleMeta.color
              )}>
                {familleMeta.label}
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Sous-header actualiser */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b bg-muted/30 shrink-0">
          <span className="text-xs font-medium text-muted-foreground">Détails du dossier</span>
          <div className="flex items-center gap-1 mr-8">
            <LoadingButton
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 px-2.5 text-xs gap-1.5 border-0 shadow-none font-semibold cursor-pointer"
              isLoading={isRefreshing}
              onClick={handleRefresh}
            >
              <IconRefresh className="h-3.5 w-3.5" />
              Actualiser
            </LoadingButton>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Colonne gauche */}
          <div className="w-[280px] shrink-0 flex flex-col border-r overflow-y-auto">
            <div className="flex-1 px-5 py-4 space-y-0">

              <InfoRow icon={User}       label="Notaire"        value={dossier.notaire} />
              <InfoRow icon={UserCheck}  label="Clerc"          value={dossier.clerc} />
              <InfoRow icon={Tag}        label="Famille"        value={familleMeta.label} />
              <InfoRow icon={FileText}   label="Type"           value={getTypeLabel(dossier.famille, dossier.typeOperation)} />
              <InfoRow
                icon={Calendar}
                label="Date signature prévue"
                value={
                  <div>
                    <p className="text-sm font-medium">{formatDate(dossier.dateSignaturePrevue)}</p>
                    {retardJours > 0 && (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="h-3 w-3" />
                        +{retardJours} jours de retard
                      </p>
                    )}
                  </div>
                }
              />
              <InfoRow
                icon={Banknote}
                label="Montant prévisionnel"
                value={dossier.montantPrevisionnel > 0
                  ? `${dossier.montantPrevisionnel.toLocaleString("fr-FR")} FCFA`
                  : "—"}
              />
              <InfoRow
                icon={GitBranch}
                label="Sous-dossiers"
                value={dossier.nombreSousDossiers > 0 ? `${dossier.nombreSousDossiers} rattaché(s)` : "Aucun"}
              />
              <InfoRow icon={Clock}      label="Créé le"        value={formatDate(dossier.dateCreation)} />
              <InfoRow icon={RefreshCw}  label="Modifié le"     value={formatDate(dossier.dateDerniereModif)} />

              {/* Condition suspensive */}
              {dossier.conditionSuspensive?.active && (
                <div className="flex items-start gap-3 py-2 border-b border-dashed">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-900/30 shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-600 dark:text-amber-400">Condition suspensive active</p>
                    <p className="text-sm font-medium">
                      {dossier.conditionSuspensive.motif === "pret_bancaire" ? "Prêt bancaire" :
                       dossier.conditionSuspensive.motif === "obtention_permis" ? "Obtention permis" :
                       "Autre"}
                    </p>
                  </div>
                </div>
              )}

              {/* Dossier suspendu */}
              {dossier.status === "suspendu" && (
                <div className="flex items-start gap-3 py-2 border-b border-dashed">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-orange-100 dark:bg-orange-900/30 shrink-0 mt-0.5">
                    <PauseCircle className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-orange-600 dark:text-orange-400">Motif suspension</p>
                    <p className="text-sm font-medium">Retour titre foncier (durée indéterminée)</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Colonne droite : Onglets */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-3 border-b shrink-0">
                <TabsList className="h-9 bg-muted/60 p-1 rounded-lg">
                  <TabsTrigger value="informations" className="text-xs cursor-pointer">Informations</TabsTrigger>
                  <TabsTrigger value="sous-dossiers" className="text-xs gap-1.5 cursor-pointer">
                    Sous-dossiers
                    {dossier.nombreSousDossiers > 0 && (
                      <span className="rounded-full bg-blue-500/15 text-blue-600 text-[10px] px-1.5 py-0.5 font-semibold leading-none">
                        {dossier.nombreSousDossiers}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="historique"   className="text-xs cursor-pointer">Historique</TabsTrigger>
                  <TabsTrigger value="alertes"      className="text-xs gap-1.5 cursor-pointer">
                    Alertes
                    {dossier.alertesActives.length > 0 && (
                      <span className="rounded-full bg-red-500/15 text-red-600 text-[10px] px-1.5 py-0.5 font-semibold leading-none">
                        {dossier.alertesActives.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Onglet Informations */}
              <TabsContent value="informations" className="flex-1 overflow-y-auto px-6 py-5 mt-0">
                <div className="space-y-4">
                  <div className="rounded-xl border border-dashed bg-muted/30 px-5 py-4 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Récapitulatif</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {[
                        { label: "Référence",   value: dossier.reference },
                        { label: "Statut",      value: STATUS_META[dossier.status].label },
                        { label: "Famille",     value: FAMILLE_META[dossier.famille].label },
                        { label: "Notaire",     value: dossier.notaire },
                        { label: "Clerc",       value: dossier.clerc },
                        { label: "Montant",     value: dossier.montantPrevisionnel > 0 ? `${dossier.montantPrevisionnel.toLocaleString("fr-FR")} FCFA` : "—" },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                          <p className="text-xs font-semibold mt-0.5 truncate">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-dashed bg-muted/30 px-5 py-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Type d'opération</p>
                    <p className="text-sm font-semibold">{getTypeLabel(dossier.famille, dossier.typeOperation)}</p>
                  </div>
                </div>
              </TabsContent>

              {/* Onglet Sous-dossiers */}
              <TabsContent value="sous-dossiers" className="flex-1 overflow-y-auto px-6 py-5 mt-0">
                <SousDossierTree
                  sousDossiers={dossier.sousDossiers ?? []}
                  onAdd={() => onAddSousDossier(dossier.id)}
                  onOpenParent={onOpenParent}
                />
              </TabsContent>

              {/* Onglet Historique */}
              <TabsContent value="historique" className="flex-1 overflow-y-auto px-6 py-5 mt-0">
                <div className="space-y-2">
                  {timeline.map((event, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-dashed px-4 py-3">
                      <div className={cn("h-2 w-2 shrink-0 rounded-full", event.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold">{event.label}</p>
                        <p className="text-[11px] text-muted-foreground">{formatDate(event.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Onglet Alertes */}
              <TabsContent value="alertes" className="flex-1 overflow-y-auto px-6 py-5 mt-0">
                {dossier.alertesActives.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 opacity-50" />
                    <div>
                      <p className="text-sm font-semibold">Aucune alerte active</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Ce dossier n'a pas d'alertes en cours.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dossier.alertesActives.map(alerte => {
                      const colors: Record<string, string> = {
                        j1:      "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20",
                        j3:      "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20",
                        j7:      "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20",
                        depasse: "border-red-300 dark:border-red-700 bg-red-100 dark:bg-red-950/40",
                      }
                      return (
                        <div
                          key={alerte.id}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border px-4 py-3",
                            colors[alerte.niveau] ?? colors.j7
                          )}
                        >
                          <Bell className="h-4 w-4 shrink-0 mt-0.5 text-current opacity-70" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold">{alerte.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Échéance : {formatDate(alerte.dateEcheance)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>

            </Tabs>
          </div>

        </div>

      </SheetContent>
    </Sheet>
  )
}
