"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  GitBranch,
  Banknote,
  UserCog,
  Users,
  FileText,
} from "lucide-react"
import { IconPlus } from "@tabler/icons-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  STATUS_META,
  formatDate,
  type SousDossier,
} from "../_lib/dossiers-data"

interface SousDossierTreeProps {
  sousDossiers: SousDossier[]
  onAdd: () => void
  onOpenParent?: (parentId: string) => void
}

function getMotifIcon(motif: SousDossier["motif"]) {
  switch (motif) {
    case "pret_bancaire": return Banknote
    case "procuration":   return UserCog
    case "succession":    return Users
    default:              return FileText
  }
}

function getMotifLabel(motif: SousDossier["motif"]) {
  switch (motif) {
    case "pret_bancaire": return "Prêt bancaire"
    case "procuration":   return "Procuration"
    case "succession":    return "Succession"
    default:              return "Autre"
  }
}

function SousDossierDetail({ sd, open, onClose, onOpenParent }: { sd: SousDossier; open: boolean; onClose: () => void; onOpenParent?: (parentId: string) => void }) {
  const statusMeta = STATUS_META[sd.status]
  const MotifIcon = getMotifIcon(sd.motif)

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col gap-0 p-0 overflow-hidden">
        <SheetHeader className="px-6 pt-5 pb-4 border-b border-dashed shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", statusMeta.bg)}>
              <MotifIcon className={cn("h-4 w-4", statusMeta.text)} />
            </div>
            <div>
              <SheetTitle className="text-sm leading-snug">{sd.intitule}</SheetTitle>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{sd.reference}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Statut */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Statut</p>
            <span className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
              statusMeta.bg, statusMeta.text
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dot)} />
              {statusMeta.label}
            </span>
          </div>

          <hr className="border-dashed" />

          {/* Détails */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Informations</p>
            <div className="space-y-3">
              {[
                { label: "Référence",          value: sd.reference,                       mono: true },
                { label: "Motif",              value: getMotifLabel(sd.motif),             mono: false },
                { label: "Type d'opération",   value: sd.typeOperation.replace(/_/g, " "), mono: false },
                { label: "Date signature",      value: formatDate(sd.dateSignaturePrevue), mono: false },
                { label: "Montant prévisionnel",
                  value: sd.montantPrevisionnel > 0
                    ? `${sd.montantPrevisionnel.toLocaleString("fr-FR")} FCFA`
                    : "Non renseigné",
                  mono: sd.montantPrevisionnel > 0,
                },
              ].map(row => (
                <div key={row.label} className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted-foreground text-xs shrink-0">{row.label}</span>
                  <span className={cn("text-xs font-semibold text-right", row.mono && "font-mono")}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-dashed" />

          {/* Rattachement */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Rattachement</p>
            <button
              type="button"
              onClick={() => { onOpenParent?.(sd.parentId); onClose() }}
              className="w-full rounded-lg border border-dashed bg-muted/20 px-4 py-3 flex items-center justify-between gap-2 hover:bg-muted/50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Ouvrir le dossier parent <span className="font-mono font-semibold text-foreground">{sd.parentId}</span>
                </p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  )
}

export function SousDossierTree({ sousDossiers, onAdd, onOpenParent }: SousDossierTreeProps) {
  const [selected, setSelected] = React.useState<SousDossier | null>(null)

  if (sousDossiers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <GitBranch className="h-10 w-10 opacity-20" />
        <div>
          <p className="text-sm font-semibold">Aucun sous-dossier</p>
          <p className="text-xs text-muted-foreground mt-0.5">Ce dossier n'a pas encore de sous-dossiers rattachés.</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 cursor-pointer mt-1"
          onClick={onAdd}
        >
          <IconPlus className="h-3.5 w-3.5" />
          Créer un sous-dossier
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {sousDossiers.map(sd => {
          const statusMeta = STATUS_META[sd.status]
          const MotifIcon = getMotifIcon(sd.motif)

          return (
            <button
              key={sd.id}
              type="button"
              onClick={() => setSelected(sd)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg border border-dashed bg-card px-4 py-3 text-left transition-all cursor-pointer hover:bg-muted/40",
                "border-l-2",
                statusMeta.border
              )}
            >
              {/* Icône motif */}
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                statusMeta.bg
              )}>
                <MotifIcon className={cn("h-4 w-4", statusMeta.text)} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-muted-foreground">{sd.reference}</span>
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    statusMeta.bg,
                    statusMeta.text
                  )}>
                    <span className={cn("h-1 w-1 rounded-full", statusMeta.dot)} />
                    {statusMeta.label}
                  </span>
                </div>
                <p className="text-xs font-semibold truncate mt-0.5">{sd.intitule}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-[10px] text-muted-foreground">{formatDate(sd.dateSignaturePrevue)}</p>
                  {sd.montantPrevisionnel > 0 && (
                    <p className="text-[10px] font-semibold tabular-nums">
                      {sd.montantPrevisionnel.toLocaleString("fr-FR")} FCFA
                    </p>
                  )}
                </div>
              </div>

              {/* Action */}
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>
          )
        })}

        {/* Bouton ajouter */}
        <button
          type="button"
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <IconPlus className="h-3.5 w-3.5" />
          Ajouter un sous-dossier
        </button>
      </div>

      {selected && (
        <SousDossierDetail
          sd={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          onOpenParent={onOpenParent}
        />
      )}
    </>
  )
}
