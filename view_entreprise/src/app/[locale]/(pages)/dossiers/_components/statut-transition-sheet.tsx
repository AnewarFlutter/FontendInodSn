"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { LoadingButton } from "@/components/loading-button"
import { Check, Info } from "lucide-react"
import {
  STATUS_META,
  TRANSITIONS_AUTORISEES,
  getMotifs,
  type Dossier,
  type DossierStatus,
} from "../_lib/dossiers-data"

interface StatutTransitionSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (id: string, newStatus: DossierStatus, motif: string) => void
}

const ALL_STATUTS: DossierStatus[] = ["en_cours", "en_attente", "suspendu", "cloture"]

export function StatutTransitionSheet({
  dossier,
  open,
  onOpenChange,
  onConfirm,
}: StatutTransitionSheetProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<DossierStatus | null>(null)
  const [motif, setMotif] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [motifError, setMotifError] = React.useState("")

  React.useEffect(() => {
    if (!open) {
      setSelectedStatus(null)
      setMotif("")
      setMotifError("")
      setIsLoading(false)
    }
  }, [open])

  if (!dossier) return null

  const currentStatus = dossier.status
  const allowedTransitions = TRANSITIONS_AUTORISEES[currentStatus]
  const suggestedMotifs = selectedStatus ? getMotifs(currentStatus, selectedStatus) : []

  const handleConfirm = async () => {
    if (!selectedStatus) return
    if (motif.trim().length < 10) {
      setMotifError("Le motif doit contenir au moins 10 caractères")
      return
    }
    setMotifError("")
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setIsLoading(false)
    onConfirm(dossier.id, selectedStatus, motif.trim())
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden">
        <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <SheetTitle className="text-base">Changer le statut</SheetTitle>
          <SheetDescription className="text-xs">
            Dossier : <span className="font-mono font-semibold text-foreground">{dossier.reference}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Statut actuel */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Statut actuel</p>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold",
                STATUS_META[currentStatus].bg,
                STATUS_META[currentStatus].text
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", STATUS_META[currentStatus].dot)} />
              {STATUS_META[currentStatus].label}
            </span>
          </div>

          {/* Nouveaux statuts */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Nouveau statut
            </p>
            <div className="space-y-2">
              {ALL_STATUTS.filter(s => s !== currentStatus).map(s => {
                const isAllowed = allowedTransitions.includes(s)
                const isSelected = selectedStatus === s
                const meta = STATUS_META[s]
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={!isAllowed}
                    onClick={() => isAllowed && setSelectedStatus(s)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-xl border border-dashed px-4 py-3 text-left transition-all",
                      isAllowed ? "cursor-pointer" : "opacity-25 cursor-not-allowed",
                      isSelected
                        ? "bg-foreground text-background border-foreground"
                        : isAllowed ? "hover:bg-muted/50" : ""
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          isSelected ? "bg-background/70" : meta.dot
                        )} />
                        <span className={cn("text-sm font-semibold", isSelected ? "text-background" : "")}>
                          {meta.label}
                        </span>
                      </div>
                      {!isAllowed && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 ml-4">
                          Transition non autorisée depuis cet état
                        </p>
                      )}
                    </div>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-background" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chips motifs suggérés */}
          {selectedStatus && suggestedMotifs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Motifs suggérés
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedMotifs.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMotif(m)}
                    className={cn(
                      "rounded-full border border-dashed px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                      motif === m
                        ? "bg-foreground text-background border-foreground"
                        : "bg-muted/40 hover:bg-muted"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Textarea motif */}
          {selectedStatus && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Motif de la transition *
              </p>
              <Textarea
                placeholder="Expliquez la raison de ce changement de statut…"
                value={motif}
                onChange={e => { setMotif(e.target.value); setMotifError("") }}
                rows={3}
                className="border-dashed resize-none text-sm"
              />
              {motifError && <p className="text-xs text-red-500">{motifError}</p>}
              <p className="text-[10px] text-muted-foreground">{motif.length} caractères (minimum 10)</p>
            </div>
          )}

          {/* Bloc info légale */}
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20 px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-500 shrink-0" />
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Informations légales</p>
            </div>
            <ul className="space-y-1">
              {[
                "Tout changement de statut est tracé et horodaté dans l'historique.",
                "Un motif détaillé est requis pour les transitions vers Suspendu ou Clôturé.",
                "La transition vers Clôturé est irréversible sans intervention d'un notaire.",
              ].map((info, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600/80 dark:text-gray-400/80">
                  <span className="h-px w-3 bg-gray-300 dark:bg-gray-600 shrink-0 mt-2" />
                  {info}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <SheetFooter className="px-6 py-4 border-t shrink-0 flex gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Annuler
          </Button>
          <LoadingButton
            isLoading={isLoading}
            onClick={handleConfirm}
            disabled={!selectedStatus}
            className="flex-1 gap-2 cursor-pointer"
          >
            Confirmer la transition
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
