"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Archive } from "lucide-react"
import {
  FAMILLE_META,
  formatDate,
  type Dossier,
} from "../_lib/dossiers-data"

interface ArchiveConfirmSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (id: string) => void
}

export function ArchiveConfirmSheet({
  dossier,
  open,
  onOpenChange,
  onConfirm,
}: ArchiveConfirmSheetProps) {
  if (!dossier) return null

  const familleMeta = FAMILLE_META[dossier.famille]

  const handleConfirm = () => {
    onConfirm(dossier.id)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden">
        <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 shrink-0">
              <Archive className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <SheetTitle className="text-base text-left">Archivage définitif</SheetTitle>
              <SheetDescription className="text-left mt-0.5 text-xs">
                Cette action est permanente et irréversible.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* Bannière amber */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-4 space-y-2">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-amber-500 shrink-0" />
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Archivage définitif</p>
            </div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
              Une fois archivé, ce dossier sera déplacé dans les archives et ne pourra plus être modifié.
              Il restera consultable en lecture seule.
            </p>
          </div>

          {/* Récap dossier */}
          <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dossier concerné</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">Référence</p>
                <p className="text-xs font-mono font-semibold">{dossier.reference}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">Intitulé</p>
                <p className="text-xs font-semibold truncate max-w-[200px] text-right">{dossier.intitule}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">Famille</p>
                <p className="text-xs font-medium">{familleMeta.label}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">Montant</p>
                <p className="text-xs font-bold tabular-nums">
                  {dossier.montantPrevisionnel > 0
                    ? `${dossier.montantPrevisionnel.toLocaleString("fr-FR")} FCFA`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Implications */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Implications de l'archivage</p>
            <ul className="space-y-1.5">
              {[
                "Le dossier sera déplacé dans les archives du cabinet.",
                "Toutes les modifications seront définitivement verrouillées.",
                "Les alertes et relances associées seront désactivées.",
                "Le dossier restera consultable en mode lecture seule.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="h-px w-3 bg-amber-400 dark:bg-amber-600 shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <SheetFooter className="px-6 py-4 border-t shrink-0 flex gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 cursor-pointer"
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 gap-2 cursor-pointer"
          >
            <Archive className="h-4 w-4" />
            Archiver définitivement
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
