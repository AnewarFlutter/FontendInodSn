"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/loading-button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Printer,
  FileText,
  Check,
} from "lucide-react"
import { IconFileTypePdf, IconTable, IconFileText } from "@tabler/icons-react"
import type { Dossier } from "../_lib/dossiers-data"
import {
  COLONNES_EXPORT_CSV,
  type TypeImpression,
  type FormatExport,
  type ImpressionOptions,
} from "../../recherche/_lib/recherche-data"

interface ImpressionSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (options: ImpressionOptions) => void
}

const TYPES_IMPRESSION: {
  value: TypeImpression
  label: string
  desc: string
  avecEnTete: boolean
}[] = [
  { value: "acte_complet",        label: "Acte complet",        desc: "L'acte notarié dans son intégralité",        avecEnTete: false },
  { value: "expedition",          label: "Expédition",          desc: "Copie authentique signée du notaire",        avecEnTete: false },
  { value: "courrier",            label: "Courrier",            desc: "Sur papier à en-tête de l'étude",            avecEnTete: true  },
  { value: "attestation",         label: "Attestation",         desc: "Attestation officielle sur papier en-tête",  avecEnTete: true  },
  { value: "bordereau_depot",     label: "Bordereau de dépôt",  desc: "Bordereau pour dépôt enregistrement/foncier",avecEnTete: false },
  { value: "note_frais",          label: "Note de frais",       desc: "Note d'honoraires et frais",                 avecEnTete: false },
  { value: "fiche_recapitulatif", label: "Fiche récapitulatif", desc: "Résumé exportable du dossier",               avecEnTete: false },
]

export function ImpressionSheet({
  dossier,
  open,
  onOpenChange,
  onConfirm,
}: ImpressionSheetProps) {
  const [typeDoc, setTypeDoc]       = React.useState<TypeImpression>("acte_complet")
  const [format, setFormat]         = React.useState<FormatExport>("pdf")
  const [avecEnTete, setAvecEnTete] = React.useState(false)
  const [avecQRCode, setAvecQRCode] = React.useState(false)
  const [colonnes, setColonnes]     = React.useState<string[]>(COLONNES_EXPORT_CSV.map(c => c.key))
  const [isLoading, setIsLoading]   = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setTypeDoc("acte_complet")
      setFormat("pdf")
      setAvecEnTete(false)
      setAvecQRCode(false)
      setColonnes(COLONNES_EXPORT_CSV.map(c => c.key))
    }
  }, [open])

  const handleConfirm = async () => {
    if (!dossier) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))
    onConfirm({
      dossierId: dossier.id,
      type: typeDoc,
      format,
      avecEnTete,
      avecQRCode,
      champsCsv: format === "csv" ? colonnes : undefined,
    })
    setIsLoading(false)
    onOpenChange(false)
  }

  const formatOptions: { value: FormatExport; label: string; icon: React.ElementType; desc: string }[] = [
    { value: "pdf",   label: "PDF",   icon: IconFileTypePdf, desc: "Mise en forme juridique" },
    { value: "excel", label: "Excel", icon: IconTable,       desc: "Tableur pour reporting" },
    { value: "csv",   label: "CSV",   icon: IconFileText,    desc: "Données brutes" },
  ]

  const optionSwitches = [
    {
      key: "avecEnTete",
      label: "En-tête officielle de l'étude",
      desc: "Pour courriers et attestations — papier à en-tête pré-imprimé",
      disabled: !["courrier", "attestation"].includes(typeDoc),
      disabledMsg: "Disponible uniquement pour courriers et attestations",
      val: avecEnTete,
      setter: setAvecEnTete,
    },
    {
      key: "avecQRCode",
      label: "Code QR de rattachement",
      desc: "Permet de rattacher automatiquement les actes et courriers scannés",
      disabled: format !== "pdf",
      disabledMsg: "Disponible uniquement en format PDF",
      val: avecQRCode,
      setter: setAvecQRCode,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-5 border-b border-dashed">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Printer className="h-4 w-4" />
            </div>
            <div>
              <p className="text-base font-bold">Impression & Export</p>
              {dossier && (
                <p className="text-xs font-normal text-muted-foreground mt-0.5">
                  {dossier.reference} — {dossier.intitule}
                </p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Type de document */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Type de document
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TYPES_IMPRESSION.map(opt => (
                <button key={opt.value}
                  onClick={() => {
                    setTypeDoc(opt.value)
                    if (opt.avecEnTete) setAvecEnTete(true)
                    else setAvecEnTete(false)
                  }}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border border-dashed p-3 text-left transition-all cursor-pointer",
                    typeDoc === opt.value
                      ? "bg-foreground text-background border-foreground shadow"
                      : "bg-muted/40 hover:bg-muted"
                  )}
                >
                  <p className={cn("text-xs font-semibold",
                    typeDoc === opt.value ? "text-background" : "text-foreground"
                  )}>{opt.label}</p>
                  <p className={cn("text-[10px] leading-relaxed",
                    typeDoc === opt.value ? "text-background/60" : "text-muted-foreground"
                  )}>{opt.desc}</p>
                  {opt.avecEnTete && (
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                      typeDoc === opt.value
                        ? "bg-background/20 text-background"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>En-tête officielle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Format de sortie */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Format de sortie
            </p>
            <div className="flex gap-2">
              {formatOptions.map(fmt => (
                <button key={fmt.value}
                  onClick={() => setFormat(fmt.value)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1.5 rounded-xl border border-dashed py-3 px-2 text-center transition-all cursor-pointer",
                    format === fmt.value
                      ? "bg-foreground text-background border-foreground shadow"
                      : "bg-muted/40 hover:bg-muted"
                  )}
                >
                  <fmt.icon className={cn("h-4 w-4", format === fmt.value ? "text-background" : "text-muted-foreground")} />
                  <p className={cn("text-xs font-bold", format === fmt.value ? "text-background" : "text-foreground")}>
                    {fmt.label}
                  </p>
                  <p className={cn("text-[10px]", format === fmt.value ? "text-background/60" : "text-muted-foreground")}>
                    {fmt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Options
            </p>
            <div className="space-y-2">
              {optionSwitches.map(opt => (
                <div key={opt.key}
                  className={cn(
                    "rounded-xl border border-dashed px-4 py-3 space-y-1.5 transition-opacity",
                    opt.disabled && "opacity-40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                    </div>
                    <Switch
                      checked={opt.val && !opt.disabled}
                      onCheckedChange={v => !opt.disabled && opt.setter(v)}
                      disabled={opt.disabled}
                    />
                  </div>
                  {opt.disabled && (
                    <p className="text-[10px] text-muted-foreground italic">{opt.disabledMsg}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Colonnes CSV */}
          {format === "csv" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Colonnes à exporter
                </p>
                <button onClick={() => setColonnes(COLONNES_EXPORT_CSV.map(c => c.key))}
                  className="text-[10px] text-blue-500 font-semibold cursor-pointer hover:underline">
                  Tout sélectionner
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {COLONNES_EXPORT_CSV.map(col => (
                  <label key={col.key}
                    className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 cursor-pointer hover:bg-muted/40 transition-colors">
                    <div className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                      colonnes.includes(col.key)
                        ? "bg-foreground border-foreground"
                        : "border-muted-foreground/40"
                    )}>
                      {colonnes.includes(col.key) && <Check className="h-2.5 w-2.5 text-background" />}
                    </div>
                    <input type="checkbox" className="sr-only"
                      checked={colonnes.includes(col.key)}
                      onChange={e => setColonnes(prev =>
                        e.target.checked ? [...prev, col.key] : prev.filter(k => k !== col.key)
                      )} />
                    <span className="text-xs font-medium">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Aperçu QR Code */}
          {avecQRCode && format === "pdf" && dossier && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Aperçu code QR
              </p>
              <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-4 flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-lg border-2 border-foreground/20 bg-white p-1.5">
                  <svg viewBox="0 0 21 21" className="h-full w-full">
                    <rect x="0" y="0" width="7" height="7" fill="none" stroke="black" strokeWidth="1" />
                    <rect x="1" y="1" width="5" height="5" fill="black" />
                    <rect x="14" y="0" width="7" height="7" fill="none" stroke="black" strokeWidth="1" />
                    <rect x="15" y="1" width="5" height="5" fill="black" />
                    <rect x="0" y="14" width="7" height="7" fill="none" stroke="black" strokeWidth="1" />
                    <rect x="1" y="15" width="5" height="5" fill="black" />
                    {[9, 11, 13, 9, 11, 13, 9, 11].map((x, i) => (
                      <rect key={i} x={x} y={9 + i * 1.2} width="1" height="1" fill="black" />
                    ))}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{dossier.reference}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono break-all">
                    {dossier.intitule}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Généré le {new Date().toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Le scan de ce code QR permettra de rattacher automatiquement le document numérisé au dossier.
              </p>
            </div>
          )}

          {/* Informations légales */}
          <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-3 space-y-1">
            {[
              "Document généré horodaté conformément aux exigences légales.",
              "Format juridique et mise en page préservés.",
            ].map((msg, i) => (
              <div key={i} className="flex items-start gap-2">
                <FileText className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground">{msg}</p>
              </div>
            ))}
          </div>

        </div>

        <SheetFooter className="px-6 py-4 border-t border-dashed flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 cursor-pointer">
            Annuler
          </Button>
          <LoadingButton
            isLoading={isLoading}
            onClick={handleConfirm}
            className="flex-1 cursor-pointer gap-2"
          >
            <Printer className="h-4 w-4" />
            Générer
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
