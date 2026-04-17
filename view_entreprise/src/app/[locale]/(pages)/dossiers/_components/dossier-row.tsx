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
  formatDate,
  type Dossier,
} from "../_lib/dossiers-data"

interface DossierRowProps {
  dossier: Dossier
  onDetail: (d: Dossier) => void
  onDuplicate: (d: Dossier) => void
  onChangeStatus: (d: Dossier) => void
  onArchive: (d: Dossier) => void
  onRelance: (d: Dossier) => void
  onExport: (d: Dossier) => void
}

export function DossierRow({
  dossier,
  onDetail,
  onDuplicate,
  onChangeStatus,
  onArchive,
  onRelance,
  onExport,
}: DossierRowProps) {
  const statusMeta = STATUS_META[dossier.status]
  const familleMeta = FAMILLE_META[dossier.famille]
  const retardJours = dossier.retardJours ?? 0
  const firstLetter = dossier.famille.charAt(0).toUpperCase()

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-dashed bg-card px-5 py-4 hover:shadow-sm transition-shadow",
        `border-l-2`,
        statusMeta.border
      )}
    >
      {/* Avatar lettre */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
          statusMeta.bg,
          statusMeta.text
        )}
      >
        {firstLetter}
      </div>

      {/* Info principale */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-muted-foreground shrink-0">
            {dossier.reference}
          </span>
          <span
            className={cn(
              "rounded border px-1.5 py-px text-[10px] font-medium",
              familleMeta.color,
              "border-current/20"
            )}
          >
            {familleMeta.label}
          </span>
        </div>
        <p className="text-sm font-semibold truncate mt-0.5">{dossier.intitule}</p>
      </div>

      {/* Badge statut */}
      <span
        className={cn(
          "hidden sm:inline-flex items-center gap-1 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
          statusMeta.bg,
          statusMeta.text
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dot)} />
        {statusMeta.label}
      </span>

      {/* Notaire */}
      <p className="hidden sm:block text-xs text-muted-foreground truncate max-w-[140px] shrink-0">
        {dossier.notaire}
      </p>

      {/* Date */}
      <div className="shrink-0 text-right">
        <p className="text-xs tabular-nums">{formatDate(dossier.dateSignaturePrevue)}</p>
        {retardJours > 0 && (
          <p className="text-[10px] text-red-500 font-semibold flex items-center gap-0.5 justify-end mt-0.5">
            <AlertTriangle className="h-2.5 w-2.5" />
            +{retardJours}j
          </p>
        )}
      </div>

      {/* Montant */}
      <p className="shrink-0 text-sm font-bold tabular-nums hidden md:block">
        {dossier.montantPrevisionnel > 0
          ? `${dossier.montantPrevisionnel.toLocaleString("fr-FR")} FCFA`
          : "—"}
      </p>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 shrink-0 cursor-pointer">
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
  )
}
