"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LoadingButton } from "@/components/loading-button"
import { GitBranch, Check, Search } from "lucide-react"
import {
  FAMILLE_META,
  TYPES_PAR_FAMILLE,
  MOCK_NOTAIRES,
  MOCK_CLERCS,
  type Dossier,
  type FamilleDossier,
  type TypeOperation,
  type CreateDossierPayload,
  type ConditionSuspensive,
} from "../_lib/dossiers-data"

interface CreateDossierSheetProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (data: CreateDossierPayload) => void
  dossier?: Dossier | null
  parentId?: string
}

const FAMILLES: FamilleDossier[] = [
  "droit_immobilier",
  "droit_famille",
  "droit_entreprise",
  "divers",
]

interface FormErrors {
  famille?: string
  typeOperation?: string
  intitule?: string
  notaire?: string
  clerc?: string
  dateSignaturePrevue?: string
  montant?: string
}

export function CreateDossierSheet({
  open,
  onOpenChange,
  onSubmit,
  dossier,
  parentId,
}: CreateDossierSheetProps) {
  const [famille, setFamille] = React.useState<FamilleDossier | "">("")
  const [typeOperation, setTypeOperation] = React.useState<TypeOperation | "">("")
  const [typeSearch, setTypeSearch] = React.useState("")
  const [intitule, setIntitule] = React.useState("")
  const [notaire, setNotaire] = React.useState("")
  const [clerc, setClerc] = React.useState("")
  const [dateSignaturePrevue, setDateSignaturePrevue] = React.useState("")
  const [montantRaw, setMontantRaw] = React.useState("")
  const [condSuspensive, setCondSuspensive] = React.useState<ConditionSuspensive>({ active: false })
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [isLoading, setIsLoading] = React.useState(false)

  // Reset when closed
  React.useEffect(() => {
    if (!open) {
      setFamille("")
      setTypeOperation("")
      setTypeSearch("")
      setIntitule("")
      setNotaire("")
      setClerc("")
      setDateSignaturePrevue("")
      setMontantRaw("")
      setCondSuspensive({ active: false })
      setErrors({})
      setIsLoading(false)
    } else if (dossier) {
      setFamille(dossier.famille)
      setTypeOperation(dossier.typeOperation)
      setIntitule(dossier.intitule)
      setNotaire(dossier.notaire)
      setClerc(dossier.clerc)
      setDateSignaturePrevue(dossier.dateSignaturePrevue.split("T")[0])
      setMontantRaw(dossier.montantPrevisionnel > 0 ? String(dossier.montantPrevisionnel) : "")
      setCondSuspensive(dossier.conditionSuspensive ?? { active: false })
    }
  }, [open, dossier])

  const handleFamilleSelect = (f: FamilleDossier) => {
    setFamille(f)
    setTypeOperation("")
    setTypeSearch("")
  }

  const montantFormatted = React.useMemo(() => {
    const num = parseInt(montantRaw.replace(/\D/g, ""), 10)
    if (isNaN(num)) return ""
    return num.toLocaleString("fr-FR")
  }, [montantRaw])

  const filteredTypes = React.useMemo(() => {
    if (!famille) return []
    const types = TYPES_PAR_FAMILLE[famille as FamilleDossier] ?? []
    if (!typeSearch.trim()) return types
    return types.filter(t => t.label.toLowerCase().includes(typeSearch.toLowerCase()))
  }, [famille, typeSearch])

  const showCondSuspensive =
    famille === "droit_immobilier" &&
    (typeOperation.toString().includes("vente") || typeOperation.toString().includes("pret"))

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!famille) errs.famille = "Sélectionnez une famille"
    if (!typeOperation) errs.typeOperation = "Sélectionnez un type d'opération"
    if (intitule.trim().length < 5) errs.intitule = "L'intitulé doit contenir au moins 5 caractères"
    if (!notaire) errs.notaire = "Sélectionnez un notaire"
    if (!clerc) errs.clerc = "Sélectionnez un clerc"
    if (!dateSignaturePrevue) errs.dateSignaturePrevue = "Sélectionnez une date"
    const montantNum = parseInt(montantRaw.replace(/\D/g, ""), 10)
    if (isNaN(montantNum) || montantNum <= 0) errs.montant = "Saisissez un montant valide"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setIsLoading(false)
    onSubmit({
      intitule: intitule.trim(),
      famille: famille as FamilleDossier,
      typeOperation: typeOperation as TypeOperation,
      conditionSuspensive: showCondSuspensive ? condSuspensive : undefined,
      notaire,
      clerc,
      dateSignaturePrevue: new Date(dateSignaturePrevue).toISOString(),
      montantPrevisionnel: parseInt(montantRaw.replace(/\D/g, ""), 10),
      parentId,
    })
    onOpenChange(false)
  }

  const isEdit = !!dossier

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col gap-0 p-0 overflow-hidden">
        <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <SheetTitle className="text-base">
            {isEdit ? "Modifier le dossier" : parentId ? "Créer un sous-dossier" : "Nouveau dossier notarial"}
          </SheetTitle>
          <SheetDescription>
            {isEdit ? "Modifiez les informations du dossier." : "Renseignez les informations du dossier."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Bannière sous-dossier */}
          {parentId && (
            <div className="rounded-xl border border-dashed border-purple-300 bg-purple-50 dark:bg-purple-950/20 px-4 py-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 shrink-0">
                <GitBranch className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">Sous-dossier rattaché</p>
                <p className="text-xs text-purple-600/80 dark:text-purple-400/70">Ce dossier sera rattaché au dossier parent.</p>
              </div>
            </div>
          )}

          {/* Famille */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Famille de dossier *</p>
              <p className="text-xs text-muted-foreground mt-0.5">Sélectionnez la catégorie juridique du dossier.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FAMILLES.map(f => {
                const meta = FAMILLE_META[f]
                const isSelected = famille === f
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleFamilleSelect(f)}
                    className={cn(
                      "relative flex flex-col text-left p-3 rounded-xl border border-dashed transition-all cursor-pointer",
                      isSelected
                        ? "bg-foreground text-background border-foreground"
                        : "bg-card hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={cn("h-2 w-2 rounded-full shrink-0", isSelected ? "bg-background/70" : meta.dot)} />
                      <span className={cn("text-xs font-bold", isSelected ? "text-background" : "text-foreground")}>
                        {meta.label}
                      </span>
                    </div>
                    <span className={cn("text-[10px] leading-relaxed line-clamp-2", isSelected ? "text-background/60" : "text-muted-foreground")}>
                      {meta.description}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.famille && <p className="text-xs text-red-500 mt-1">{errors.famille}</p>}
          </div>

          {/* Type d'opération */}
          {famille && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">Type d'opération *</p>
                <p className="text-xs text-muted-foreground mt-0.5">Sélectionnez le type d'acte notarial.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un type…"
                  value={typeSearch}
                  onChange={e => setTypeSearch(e.target.value)}
                  className="pl-8 h-8 border-dashed text-sm"
                />
              </div>
              <div className="max-h-48 overflow-y-auto border border-dashed rounded-lg divide-y divide-dashed">
                {filteredTypes.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Aucun type trouvé</p>
                ) : filteredTypes.map(t => {
                  const isSelected = typeOperation === t.value
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTypeOperation(t.value)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors cursor-pointer",
                        isSelected
                          ? "bg-foreground text-background"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <span className={cn("text-xs", isSelected ? "font-semibold" : "")}>{t.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  )
                })}
              </div>
              {errors.typeOperation && <p className="text-xs text-red-500 mt-1">{errors.typeOperation}</p>}
            </div>
          )}

          {/* Identification */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Identification</p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Intitulé *</Label>
              <Input
                placeholder="ex: Moussa NDIAYE / Awa DIOP"
                value={intitule}
                onChange={e => setIntitule(e.target.value)}
                className="border-dashed"
              />
              <p className="text-[10px] text-muted-foreground">Format : Prénom Nom / Prénom Nom</p>
              {errors.intitule && <p className="text-xs text-red-500 mt-1">{errors.intitule}</p>}
            </div>

            {/* Condition suspensive */}
            {showCondSuspensive && (
              <div className="rounded-xl border border-dashed p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Condition suspensive</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Cette opération est-elle soumise à une condition ?</p>
                  </div>
                  <Switch
                    checked={condSuspensive.active}
                    onCheckedChange={v => setCondSuspensive(p => ({ ...p, active: v }))}
                  />
                </div>
                {condSuspensive.active && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(["pret_bancaire", "obtention_permis", "autre"] as const).map(motif => {
                      const labels: Record<string, string> = {
                        pret_bancaire: "Prêt bancaire",
                        obtention_permis: "Obtention permis",
                        autre: "Autre",
                      }
                      const isSelected = condSuspensive.motif === motif
                      return (
                        <button
                          key={motif}
                          type="button"
                          onClick={() => setCondSuspensive(p => ({ ...p, motif }))}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium border border-dashed transition-all cursor-pointer",
                            isSelected
                              ? "bg-foreground text-background border-foreground"
                              : "bg-muted/40 hover:bg-muted"
                          )}
                        >
                          {labels[motif]}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Affectation */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Affectation</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Notaire *</Label>
                <Select value={notaire} onValueChange={setNotaire}>
                  <SelectTrigger className="border-dashed">
                    <SelectValue placeholder="Choisir…" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_NOTAIRES.map(n => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.notaire && <p className="text-xs text-red-500 mt-1">{errors.notaire}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Clerc *</Label>
                <Select value={clerc} onValueChange={setClerc}>
                  <SelectTrigger className="border-dashed">
                    <SelectValue placeholder="Choisir…" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CLERCS.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clerc && <p className="text-xs text-red-500 mt-1">{errors.clerc}</p>}
              </div>
            </div>
          </div>

          {/* Planification */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Planification</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Date de signature *</Label>
                <Input
                  type="date"
                  value={dateSignaturePrevue}
                  onChange={e => setDateSignaturePrevue(e.target.value)}
                  className="border-dashed"
                />
                {errors.dateSignaturePrevue && <p className="text-xs text-red-500 mt-1">{errors.dateSignaturePrevue}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Montant prévisionnel *</Label>
                <div className="relative">
                  <Input
                    placeholder="0"
                    value={montantFormatted}
                    onChange={e => setMontantRaw(e.target.value.replace(/\D/g, ""))}
                    className="border-dashed pr-14"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">FCFA</span>
                </div>
                {errors.montant && <p className="text-xs text-red-500 mt-1">{errors.montant}</p>}
              </div>
            </div>
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
            onClick={handleSubmit}
            className="flex-1 gap-2 cursor-pointer"
          >
            {isEdit ? "Enregistrer les modifications" : "Créer le dossier"}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
