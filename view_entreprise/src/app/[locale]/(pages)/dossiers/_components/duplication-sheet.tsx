"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/loading-button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Copy,
  Check,
  FolderOpen,
  Files,
  Info,
} from "lucide-react"
import { IconStack2 } from "@tabler/icons-react"
import type { Dossier } from "../_lib/dossiers-data"
import type { DuplicationOptions } from "../../recherche/_lib/recherche-data"

interface DuplicationSheetProps {
  dossier: Dossier | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (options: DuplicationOptions) => void
  dossiersList: Dossier[]
}

export function DuplicationSheet({
  dossier,
  open,
  onOpenChange,
  onConfirm,
  dossiersList,
}: DuplicationSheetProps) {
  const [type, setType] = React.useState<DuplicationOptions["type"]>("dossier_complet")
  const [destination, setDestination] = React.useState<DuplicationOptions["destination"]>("nouveau_dossier")
  const [dossierDestId, setDossierDestId] = React.useState("")
  const [modePartie, setModePartie] = React.useState<DuplicationOptions["modePartie"]>("copier_fige")
  const [options, setOptions] = React.useState({
    inclureParties: true,
    inclureBiens: true,
    inclureDocuments: true,
  })
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setType("dossier_complet")
      setDestination("nouveau_dossier")
      setDossierDestId("")
      setModePartie("copier_fige")
      setOptions({ inclureParties: true, inclureBiens: true, inclureDocuments: true })
    }
  }, [open])

  const handleConfirm = async () => {
    if (!dossier) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))
    onConfirm({
      sourceId: dossier.id,
      type,
      destination,
      dossierDestinationId: dossierDestId || undefined,
      inclureParties: options.inclureParties,
      inclureBiens: options.inclureBiens,
      inclureDocuments: options.inclureDocuments,
      resetMetadonnees: true,
      modePartie,
    })
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-5 border-b border-dashed">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Copy className="h-4 w-4" />
            </div>
            <div>
              <p className="text-base font-bold">Dupliquer un élément</p>
              {dossier && (
                <p className="text-xs font-normal text-muted-foreground mt-0.5">
                  {dossier.reference} — {dossier.intitule}
                </p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Type de duplication */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Que souhaitez-vous dupliquer ?
            </p>
            <div className="space-y-2">
              {[
                { value: "dossier_complet", label: "Dossier complet", desc: "Copie tous les paramètres, parties et biens", icon: FolderOpen },
                { value: "acte",            label: "Acte",             desc: "Copie un acte vers un autre dossier",        icon: IconStack2 },
                { value: "document",        label: "Document",         desc: "Copie un document avec fiche vierge",        icon: Files },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value as DuplicationOptions["type"])}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border border-dashed p-4 text-left transition-all cursor-pointer w-full",
                    type === opt.value
                      ? "bg-foreground text-background border-foreground shadow"
                      : "bg-muted/40 hover:bg-muted"
                  )}
                >
                  <opt.icon className={cn("h-4 w-4 mt-0.5 shrink-0",
                    type === opt.value ? "text-background" : "text-muted-foreground"
                  )} />
                  <div className="flex-1">
                    <p className={cn("text-sm font-semibold",
                      type === opt.value ? "text-background" : "text-foreground"
                    )}>{opt.label}</p>
                    <p className={cn("text-[11px] mt-0.5",
                      type === opt.value ? "text-background/60" : "text-muted-foreground"
                    )}>{opt.desc}</p>
                  </div>
                  {type === opt.value && <Check className="h-4 w-4 text-background ml-auto shrink-0 mt-0.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Destination
            </p>
            <div className="space-y-2">
              {[
                { value: "nouveau_dossier",  label: "Nouveau dossier",  desc: "Référence générée automatiquement" },
                { value: "dossier_existant", label: "Dossier existant", desc: "Choisir parmi les dossiers en cours" },
              ].map(opt => (
                <label key={opt.value}
                  className="flex items-center gap-3 rounded-xl border border-dashed p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="radio" name="destination" value={opt.value}
                    checked={destination === opt.value}
                    onChange={() => setDestination(opt.value as DuplicationOptions["destination"])}
                    className="accent-foreground" />
                  <div>
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {destination === "dossier_existant" && (
              <div className="space-y-1.5 pl-1">
                <Label className="text-xs font-bold">Dossier de destination</Label>
                <Select value={dossierDestId} onValueChange={setDossierDestId}>
                  <SelectTrigger className="border-0 bg-muted h-9 text-sm">
                    <SelectValue placeholder="Sélectionner un dossier…" />
                  </SelectTrigger>
                  <SelectContent>
                    {dossiersList
                      .filter(d => d.id !== dossier?.id && d.status !== "cloture")
                      .map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          <span className="font-mono text-xs text-muted-foreground mr-2">{d.reference}</span>
                          {d.intitule}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Options inclusion */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Options d'inclusion
            </p>
            <div className="space-y-2">
              {[
                { key: "inclureParties",   label: "Inclure les parties",   desc: "Noms, contacts, références" },
                { key: "inclureBiens",     label: "Inclure les biens",     desc: "Biens immobiliers, TF, cadastre" },
                { key: "inclureDocuments", label: "Inclure les documents", desc: "Avec fiche vierge dans destination" },
              ].map(opt => (
                <label key={opt.key}
                  className="flex items-center gap-3 rounded-xl border border-dashed px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors">
                  <div className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                    options[opt.key as keyof typeof options]
                      ? "bg-foreground border-foreground"
                      : "border-muted-foreground/40"
                  )}>
                    {options[opt.key as keyof typeof options] && <Check className="h-3 w-3 text-background" />}
                  </div>
                  <input type="checkbox" className="sr-only"
                    checked={options[opt.key as keyof typeof options] as boolean}
                    onChange={e => setOptions(p => ({ ...p, [opt.key]: e.target.checked }))} />
                  <div>
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Mode fiche partie */}
          {options.inclureParties && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Gestion des fiches parties
              </p>
              {[
                {
                  value: "copier_fige",
                  label: "Copie figée",
                  desc: "Version indépendante — les modifications futures n'affectent pas ce dossier",
                },
                {
                  value: "lier_et_maj",
                  label: "Liée avec mise à jour possible",
                  desc: "Fiche partagée — possibilité de MAJ si adresse ou situation matrimoniale change",
                },
              ].map(opt => (
                <label key={opt.value}
                  className="flex items-center gap-3 rounded-xl border border-dashed p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                  <input type="radio" name="modePartie" value={opt.value}
                    checked={modePartie === opt.value}
                    onChange={() => setModePartie(opt.value as DuplicationOptions["modePartie"])}
                    className="accent-foreground" />
                  <div>
                    <p className="text-xs font-semibold">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Métadonnées documents */}
          {options.inclureDocuments && (
            <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <p className="text-xs font-semibold">Métadonnées des documents</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                Les documents dupliqués repartent d'une fiche vierge dans le dossier de destination.
                La date de réception et la date de demande d'origine ne sont pas conservées.
              </p>
            </div>
          )}

          {/* Récapitulatif */}
          <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Récapitulatif</p>
            {[
              { label: "Source",      value: dossier ? `${dossier.reference} — ${dossier.intitule}` : "—" },
              { label: "Type",        value: type === "dossier_complet" ? "Dossier complet" : type === "acte" ? "Acte" : "Document" },
              { label: "Destination", value: destination === "nouveau_dossier" ? "Nouveau dossier (auto)" : dossiersList.find(d => d.id === dossierDestId)?.reference ?? "—" },
              { label: "Parties",     value: options.inclureParties ? (modePartie === "lier_et_maj" ? "Liées (MAJ possible)" : "Copie figée") : "Non incluses" },
              { label: "Biens",       value: options.inclureBiens ? "Inclus" : "Non inclus" },
              { label: "Documents",   value: options.inclureDocuments ? "Inclus (fiche vierge)" : "Non inclus" },
            ].map(row => (
              <div key={row.label} className="flex items-start justify-between gap-3 text-xs">
                <span className="text-muted-foreground font-medium shrink-0">{row.label}</span>
                <span className="font-semibold text-right">{row.value}</span>
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
            <Copy className="h-4 w-4" />
            Dupliquer
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
