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
  STATUS_META,
  formatDate,
  type SousDossier,
} from "../_lib/dossiers-data"

interface SousDossierTreeProps {
  sousDossiers: SousDossier[]
  onAdd: () => void
}

function getMotifIcon(motif: SousDossier["motif"]) {
  switch (motif) {
    case "pret_bancaire": return Banknote
    case "procuration":   return UserCog
    case "succession":    return Users
    default:              return FileText
  }
}

export function SousDossierTree({ sousDossiers, onAdd }: SousDossierTreeProps) {
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
    <div className="space-y-2">
      {sousDossiers.map(sd => {
        const statusMeta = STATUS_META[sd.status]
        const MotifIcon = getMotifIcon(sd.motif)

        return (
          <div
            key={sd.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-dashed bg-card px-4 py-3 hover:shadow-sm transition-shadow",
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
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0 cursor-pointer">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
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
  )
}
