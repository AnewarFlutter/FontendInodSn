"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Shield,
  ChevronDown,
  Plus,
  Trash2,
  RefreshCw,
  Archive,
  FileDown,
  Printer,
  Copy,
  UserPlus,
  CheckCircle2,
  Download,
} from "lucide-react"
import { IconPencil } from "@tabler/icons-react"
import { PenLine, RotateCcw, FilePen } from "lucide-react"
import type { Dossier } from "../_lib/dossiers-data"
import {
  TRACABILITE_MOCK,
  ACTIONS_DOUBLE_CONFIRMATION,
  type EvenementTracabilite,
  type ActionTracee,
} from "../../recherche/_lib/recherche-data"

interface TracabiliteSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

type FiltreAction = "Tous" | "Modifications" | "Signatures" | "Exports" | "Suppressions" | "Statuts"

const FILTRES: FiltreAction[] = ["Tous", "Modifications", "Signatures", "Exports", "Suppressions", "Statuts"]

function matchFiltre(evt: EvenementTracabilite, filtre: FiltreAction): boolean {
  switch (filtre) {
    case "Modifications":  return ["modification", "modification_acte"].includes(evt.action)
    case "Signatures":     return evt.action === "signature"
    case "Exports":        return ["export_pdf", "impression"].includes(evt.action)
    case "Suppressions":   return evt.action === "suppression"
    case "Statuts":        return evt.action === "changement_statut"
    default:               return true
  }
}

const ACTION_META: Record<ActionTracee, { label: string; color: string; icon: React.ElementType }> = {
  creation:             { label: "Création",           color: "bg-blue-500",    icon: Plus },
  modification:         { label: "Modification",        color: "bg-amber-500",   icon: IconPencil },
  suppression:          { label: "Suppression",         color: "bg-red-600",     icon: Trash2 },
  signature:            { label: "Signature",           color: "bg-emerald-500", icon: PenLine },
  changement_statut:    { label: "Changement statut",  color: "bg-purple-500",  icon: RefreshCw },
  archivage:            { label: "Archivage",           color: "bg-slate-500",   icon: Archive },
  restauration_archive: { label: "Restauration",        color: "bg-indigo-500",  icon: RotateCcw },
  export_pdf:           { label: "Export PDF",          color: "bg-sky-500",     icon: FileDown },
  impression:           { label: "Impression",          color: "bg-sky-400",     icon: Printer },
  duplication:          { label: "Duplication",         color: "bg-teal-500",    icon: Copy },
  ajout_partie:         { label: "Ajout partie",        color: "bg-violet-500",  icon: UserPlus },
  modification_acte:    { label: "Modif. acte",         color: "bg-orange-600",  icon: FilePen },
  "clôture":            { label: "Clôture",             color: "bg-slate-600",   icon: CheckCircle2 },
}

function EvenementRow({ evt }: { evt: EvenementTracabilite }) {
  const [diffOpen, setDiffOpen] = React.useState(false)
  const meta = ACTION_META[evt.action]
  const needsConfirm = ACTIONS_DOUBLE_CONFIRMATION.includes(evt.action)

  return (
    <div className="relative flex items-start gap-3">
      <div className={cn(
        "relative z-10 h-4 w-4 shrink-0 rounded-full border-2 border-background shadow-sm mt-0.5",
        meta.color
      )} />

      <div className="flex-1 min-w-0 rounded-xl border border-dashed bg-card px-4 py-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold text-white",
              meta.color
            )}>{meta.label}</span>
            {needsConfirm && (
              <span className="rounded-full border border-dashed px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                Double confirmation
              </span>
            )}
            {evt.confirmeePar && (
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ Confirmé par {evt.confirmeePar}
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground shrink-0">
            {new Date(evt.timestamp).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold">{evt.objetLabel}</p>
          <p className="text-[10px] text-muted-foreground">
            Par <span className="font-semibold">{evt.utilisateur}</span>
            {" "}({evt.role}) · {evt.objetType}
          </p>
        </div>

        {(evt.valeurAvant || evt.valeurApres) && (
          <button
            onClick={() => setDiffOpen(!diffOpen)}
            className="flex items-center gap-1 text-[10px] text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform", diffOpen && "rotate-180")} />
            {diffOpen ? "Masquer" : "Voir"} les changements
          </button>
        )}

        {diffOpen && (evt.valeurAvant || evt.valeurApres) && (
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed">
            {evt.valeurAvant && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-3 py-2">
                <p className="text-[10px] font-bold text-red-600 mb-1">Avant</p>
                {Object.entries(evt.valeurAvant).map(([k, v]) => (
                  <p key={k} className="text-[10px] text-red-700 dark:text-red-300">
                    {k}: <span className="font-semibold">{String(v)}</span>
                  </p>
                ))}
              </div>
            )}
            {evt.valeurApres && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-3 py-2">
                <p className="text-[10px] font-bold text-emerald-600 mb-1">Après</p>
                {Object.entries(evt.valeurApres).map(([k, v]) => (
                  <p key={k} className="text-[10px] text-emerald-700 dark:text-emerald-300">
                    {k}: <span className="font-semibold">{String(v)}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function TracabiliteSheet({ dossier, open, onOpenChange }: TracabiliteSheetProps) {
  const [filtre, setFiltre] = React.useState<FiltreAction>("Tous")

  const evenements = dossier
    ? TRACABILITE_MOCK.filter(e => e.dossierId === dossier.id)
    : TRACABILITE_MOCK

  const evenementsFiltres = evenements
    .filter(e => filtre === "Tous" || matchFiltre(e, filtre))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-5 border-b border-dashed">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Shield className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-base font-bold">Journal de traçabilité</p>
              {dossier && (
                <p className="text-xs font-normal text-muted-foreground mt-0.5">
                  {dossier.reference} — {dossier.intitule}
                </p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="relative">
            <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />
            <div className="space-y-4">

              {/* Filtres */}
              <div className="flex flex-wrap gap-1.5 pl-7">
                {FILTRES.map(f => (
                  <button key={f}
                    onClick={() => setFiltre(f)}
                    className={cn(
                      "rounded-full border border-dashed px-2.5 py-1 text-[11px] font-semibold cursor-pointer transition-all",
                      filtre === f
                        ? "bg-foreground text-background border-foreground"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >{f}</button>
                ))}
              </div>

              {/* Bannière légale */}
              <div className="ml-7 rounded-lg border border-dashed bg-muted/30 px-4 py-2 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <p className="text-[10px] text-muted-foreground">
                  Journal en écriture seule — non modifiable. Requis pour conformité légale et litiges.
                </p>
              </div>

              {/* Événements */}
              {evenementsFiltres.length === 0 ? (
                <div className="ml-7 flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                  <Shield className="h-6 w-6 opacity-20" />
                  <p className="text-xs">Aucun événement pour ce filtre</p>
                </div>
              ) : (
                evenementsFiltres.map(evt => (
                  <EvenementRow key={evt.id} evt={evt} />
                ))
              )}

            </div>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-dashed flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 cursor-pointer">
            Fermer
          </Button>
          <Button variant="outline" className="flex-1 cursor-pointer gap-2">
            <Download className="h-4 w-4" />
            Exporter le journal
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
