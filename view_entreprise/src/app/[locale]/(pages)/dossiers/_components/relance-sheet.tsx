"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { LoadingButton } from "@/components/loading-button"
import { Bell, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { formatDate, type Dossier, type Alerte, type AlerteType } from "../_lib/dossiers-data"

interface RelanceSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (dossierId: string, alerte: Omit<Alerte, "id" | "dossierId">) => void
}

const TYPES_RELANCE: { value: AlerteType; label: string }[] = [
  { value: "signature",            label: "Signature" },
  { value: "depot_enregistrement", label: "Dépôt enregistrement" },
  { value: "publicite_fonciere",   label: "Publicité foncière" },
  { value: "retour_titre_foncier", label: "Retour titre foncier" },
  { value: "relance",              label: "Relance générale" },
]

export function RelanceSheet({
  dossier,
  open,
  onOpenChange,
  onConfirm,
}: RelanceSheetProps) {
  const [typeRelance, setTypeRelance] = React.useState<AlerteType>("signature")
  const [dateEcheance, setDateEcheance] = React.useState<Date | undefined>(undefined)
  const [calOpen, setCalOpen] = React.useState(false)
  const [alertJ7, setAlertJ7] = React.useState(true)
  const [alertJ3, setAlertJ3] = React.useState(true)
  const [alertJ1, setAlertJ1] = React.useState(true)
  const [message, setMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setTypeRelance("signature")
      setDateEcheance(undefined)
      setCalOpen(false)
      setAlertJ7(true)
      setAlertJ3(true)
      setAlertJ1(true)
      setMessage("")
      setIsLoading(false)
    }
  }, [open])

  // Calcul des dates d'alerte
  const alerteDates = React.useMemo(() => {
    if (!dateEcheance) return null
    const j7 = new Date(dateEcheance.getTime() - 7 * 86400000)
    const j3 = new Date(dateEcheance.getTime() - 3 * 86400000)
    const j1 = new Date(dateEcheance.getTime() - 1 * 86400000)
    return { j7, j3, j1 }
  }, [dateEcheance])

  if (!dossier) return null

  const handleConfirm = async () => {
    if (!dateEcheance) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setIsLoading(false)
    onConfirm(dossier.id, {
      type: typeRelance,
      niveau: "j7",
      message: message || `Relance : ${TYPES_RELANCE.find(t => t.value === typeRelance)?.label}`,
      dateEcheance: dateEcheance.toISOString(),
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden">
        <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 shrink-0">
              <Bell className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <SheetTitle className="text-base text-left">Programmer une relance</SheetTitle>
              <SheetDescription className="text-left mt-0.5 text-xs font-mono">
                {dossier.reference}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Type de relance */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type de relance</p>
            <div className="flex flex-wrap gap-2">
              {TYPES_RELANCE.map(t => {
                const isSelected = typeRelance === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTypeRelance(t.value)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium border border-dashed transition-all cursor-pointer",
                      isSelected
                        ? "bg-foreground text-background border-foreground"
                        : "bg-muted/40 hover:bg-muted"
                    )}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date d'échéance */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Date d'échéance *</Label>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between rounded-md border border-dashed px-3 py-2 text-sm transition-colors hover:bg-muted/40 cursor-pointer",
                    !dateEcheance && "text-muted-foreground"
                  )}
                >
                  <span>{dateEcheance ? format(dateEcheance, "dd/MM/yyyy", { locale: fr }) : "jj/mm/aaaa"}</span>
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateEcheance}
                  onSelect={(d) => { setDateEcheance(d); setCalOpen(false) }}
                  locale={fr}
                  captionLayout="label"
                  initialFocus
                />
                <div className="flex items-center justify-between border-t border-dashed px-3 py-2">
                  <button
                    type="button"
                    onClick={() => { setDateEcheance(undefined); setCalOpen(false) }}
                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    Effacer
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDateEcheance(new Date()); setCalOpen(false) }}
                    className="text-xs text-primary font-medium hover:underline cursor-pointer"
                  >
                    Aujourd'hui
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Toggles J-7 / J-3 / J-1 */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Alertes automatiques</p>
            <div className="space-y-2">
              {[
                { label: "J-7", sublabel: "7 jours avant l'échéance", value: alertJ7, onChange: setAlertJ7 },
                { label: "J-3", sublabel: "3 jours avant l'échéance", value: alertJ3, onChange: setAlertJ3 },
                { label: "J-1", sublabel: "La veille de l'échéance",   value: alertJ1, onChange: setAlertJ1 },
              ].map(({ label, sublabel, value, onChange }) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-dashed px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{sublabel}</p>
                  </div>
                  <Switch checked={value} onCheckedChange={onChange} />
                </div>
              ))}
            </div>
          </div>

          {/* Aperçu dates calculées */}
          {alerteDates && (
            <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Vous recevrez des alertes le :
              </p>
              <div className="space-y-1">
                {alertJ7 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-500 font-semibold">J-7</span>
                    <span className="text-muted-foreground">{formatDate(alerteDates.j7.toISOString())}</span>
                  </div>
                )}
                {alertJ3 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-500 font-semibold">J-3</span>
                    <span className="text-muted-foreground">{formatDate(alerteDates.j3.toISOString())}</span>
                  </div>
                )}
                {alertJ1 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-500 font-semibold">J-1</span>
                    <span className="text-muted-foreground">{formatDate(alerteDates.j1.toISOString())}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message optionnel */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Message optionnel</Label>
            <Textarea
              placeholder="Ajouter un message personnalisé pour cette relance…"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="border-dashed resize-none text-sm"
            />
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
            disabled={!dateEcheance}
            className="flex-1 gap-2 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            Programmer la relance
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
