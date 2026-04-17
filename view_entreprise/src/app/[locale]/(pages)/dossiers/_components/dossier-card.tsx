"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronRight,
  MoreHorizontal,
  AlertTriangle,
  Copy,
  RefreshCw,
  Archive,
  Bell,
  FileDown,
  FolderOpen,
} from "lucide-react"
import {
  STATUS_META,
  FAMILLE_META,
  getTypeLabel,
  formatDate,
  type Dossier,
} from "../_lib/dossiers-data"
import { AlerteBadge } from "./alerte-badge"

interface DossierCardProps {
  dossier: Dossier
  onDetail: (d: Dossier) => void
  onDuplicate: (d: Dossier) => void
  onChangeStatus: (d: Dossier) => void
  onArchive: (d: Dossier) => void
  onRelance: (d: Dossier) => void
  onExport: (d: Dossier) => void
}

export function DossierCard({
  dossier,
  onDetail,
  onDuplicate,
  onChangeStatus,
  onArchive,
  onRelance,
  onExport,
}: DossierCardProps) {
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

        {/* Référence */}
        <p className={cn("text-[10px] font-mono mb-1 opacity-70", statusMeta.headerText)}>
          {dossier.reference}
        </p>

        {/* Titre */}
        <h3 className={cn("text-xl font-bold leading-tight line-clamp-2", statusMeta.headerText)}>
          {dossier.intitule}
        </h3>

        {/* Sous-titre famille + type */}
        <p className={cn("text-[11px] mt-1.5", statusMeta.headerText, "opacity-70")}>
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

        {/* Sous-dossiers */}
        {dossier.nombreSousDossiers > 0 && (
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Sous-dossiers</p>
            <p className="text-sm font-semibold">{dossier.nombreSousDossiers} rattaché(s)</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs cursor-pointer"
            onClick={() => onDetail(dossier)}
          >
            Voir le dossier
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onDetail(dossier)}>
                <FolderOpen className="h-3.5 w-3.5" />
                Ouvrir
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onDuplicate(dossier)}>
                <Copy className="h-3.5 w-3.5" />
                Dupliquer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onChangeStatus(dossier)}>
                <RefreshCw className="h-3.5 w-3.5" />
                Changer statut
              </DropdownMenuItem>
              {dossier.status === "cloture" && (
                <DropdownMenuItem className="cursor-pointer gap-2 text-amber-600" onClick={() => onArchive(dossier)}>
                  <Archive className="h-3.5 w-3.5" />
                  Archiver
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onRelance(dossier)}>
                <Bell className="h-3.5 w-3.5" />
                Relance
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onExport(dossier)}>
                <FileDown className="h-3.5 w-3.5" />
                Exporter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
