"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  IconCaretUpFilled,
  IconCaretDownFilled,
  IconCaretUpDownFilled,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDownload,
  IconFileTypeCsv,
  IconFileTypeXls,
  IconBraces,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import {
  CreditCard, Lock, CheckCircle2, RotateCcw, ShoppingBag,
  Info, Calendar, Hash, Clock, Banknote,
} from "lucide-react"
import { IconRefresh } from "@tabler/icons-react"
import Link from "next/link"
import { LoadingButton } from "@/components/loading-button"
import { APP_ROUTES } from "@/shared/constants/routes"

// ─── Types ─────────────────────────────────────────────────────────────────────

type PaiementStatus = "actif" | "expire" | "expire_bientot"

interface Paiement {
  id: string
  moduleNom: string
  montant: number
  datePaiement: Date
  dateExpiration: Date
  status: PaiementStatus
  reference: string
  autoRenew: boolean
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const HISTORIQUE: Paiement[] = [
  { id: "pay-001", moduleNom: "Gestion des Actes",       montant: 15000, datePaiement: new Date("2026-03-16"), dateExpiration: new Date("2026-04-16"), status: "expire_bientot", reference: "REF-2026-0001", autoRenew: true  },
  { id: "pay-002", moduleNom: "Gestion des Dossiers",    montant: 12000, datePaiement: new Date("2026-03-16"), dateExpiration: new Date("2026-04-16"), status: "actif",          reference: "REF-2026-0002", autoRenew: false },
  { id: "pay-003", moduleNom: "Signature Électronique",  montant: 18000, datePaiement: new Date("2026-01-10"), dateExpiration: new Date("2026-02-10"), status: "expire",         reference: "REF-2026-0003", autoRenew: false },
  { id: "pay-004", moduleNom: "Agenda & Rendez-vous",    montant: 8000,  datePaiement: new Date("2025-12-01"), dateExpiration: new Date("2026-01-01"), status: "expire",         reference: "REF-2025-0044", autoRenew: false },
  { id: "pay-005", moduleNom: "Comptabilité",            montant: 20000, datePaiement: new Date("2026-02-14"), dateExpiration: new Date("2026-03-14"), status: "expire",         reference: "REF-2026-0005", autoRenew: false },
  { id: "pay-006", moduleNom: "Archivage Numérique",     montant: 10000, datePaiement: new Date("2026-03-01"), dateExpiration: new Date("2026-04-01"), status: "actif",          reference: "REF-2026-0006", autoRenew: true  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })

const statusConfig: Record<PaiementStatus, { label: string; className: string }> = {
  actif:          { label: "Actif",          className: "rounded-md border-none text-xs uppercase bg-green-600/10 text-green-600" },
  expire_bientot: { label: "Expire bientôt", className: "rounded-md border-none text-xs uppercase bg-orange-500/10 text-orange-600" },
  expire:         { label: "Expiré",         className: "rounded-md border-none text-xs uppercase bg-red-600/10 text-red-600" },
}

// ─── Renewal Dialog ─────────────────────────────────────────────────────────────

function RenewalDialog({ paiement, open, onOpenChange, onSuccess }: {
  paiement: Paiement | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess: (id: string) => void
}) {
  const [step, setStep] = React.useState<"form" | "success">("form")
  const [loading, setLoading] = React.useState(false)
  const [card, setCard] = React.useState({ numero: "", nom: "", expiry: "", cvv: "" })

  React.useEffect(() => {
    if (!open) { setStep("form"); setCard({ numero: "", nom: "", expiry: "", cvv: "" }) }
  }, [open])

  const fmtCard   = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
  const fmtExpiry = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/^(.{2})(.+)/, "$1/$2")

  const handleRenew = async () => {
    if (!card.numero || !card.nom || !card.expiry || !card.cvv) { toast.error("Veuillez remplir tous les champs"); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setStep("success")
    if (paiement) onSuccess(paiement.id)
  }

  if (!paiement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><RotateCcw className="h-5 w-5 text-primary" />Réabonnement</DialogTitle>
              <DialogDescription>Module <span className="font-semibold text-foreground">{paiement.moduleNom}</span></DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 border border-dashed">
              <div>
                <p className="text-sm font-semibold">{paiement.moduleNom}</p>
                <p className="text-xs text-muted-foreground">30 jours d'accès</p>
              </div>
              <p className="text-base font-bold">{paiement.montant.toLocaleString("fr-FR")} FCFA</p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Numéro de carte</Label>
                <div className="relative">
                  <Input placeholder="0000 0000 0000 0000" value={card.numero} onChange={e => setCard(p => ({ ...p, numero: fmtCard(e.target.value) }))} className="pr-10" />
                  <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Nom sur la carte</Label>
                <Input placeholder="JEAN DUPONT" value={card.nom} onChange={e => setCard(p => ({ ...p, nom: e.target.value.toUpperCase() }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Date d'expiration</Label>
                  <Input placeholder="MM/AA" value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: fmtExpiry(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">CVV</Label>
                  <Input placeholder="123" type="password" maxLength={3} value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md px-3 py-2">
              <Lock className="h-3.5 w-3.5 shrink-0" />Paiement sécurisé SSL 256 bits
            </div>
            <DialogFooter className="gap-2">
              <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>Annuler</Button>
              <Button onClick={handleRenew} disabled={loading} className="flex-1">
                {loading
                  ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Traitement...</span>
                  : <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4" />Renouveler {paiement.montant.toLocaleString("fr-FR")} FCFA</span>}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Réabonnement réussi !</h3>
              <p className="text-sm text-muted-foreground mt-1">Module <span className="font-semibold text-foreground">{paiement.moduleNom}</span> renouvelé.</p>
            </div>
            <Button className="w-full" onClick={() => onOpenChange(false)}>Continuer</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── InfoRow ────────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, valueClass }: {
  icon: React.ElementType
  label: string
  value?: string | null
  valueClass?: string
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-dashed">
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium truncate ${valueClass ?? ""}`}>{value || "—"}</p>
      </div>
    </div>
  )
}

// ─── Detail Dialog ────────────────────────────────────────────────────────────────

function DetailDialog({ paiement, open, onOpenChange, onRenew, onToggleAutoRenew, onUnsubscribe }: {
  paiement: Paiement | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onRenew: (p: Paiement) => void
  onToggleAutoRenew: (id: string, value: boolean) => void
  onUnsubscribe: (id: string) => void
}) {
  if (!paiement) return null

  const isActif  = paiement.status === "actif"
  const canRenew = paiement.status === "expire" || paiement.status === "expire_bientot"
  const cfg      = statusConfig[paiement.status]
  const expColor = paiement.status === "expire" ? "text-red-500" : paiement.status === "expire_bientot" ? "text-orange-500" : ""

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden">

        {/* Header */}
        <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base truncate text-left">{paiement.moduleNom}</SheetTitle>
              <SheetDescription className="text-xs font-mono truncate mt-0.5 text-left">{paiement.reference}</SheetDescription>
            </div>
            <div className="mr-8">
              <Badge className={cfg.className}>{cfg.label}</Badge>
            </div>
          </div>
        </SheetHeader>

        {/* Sub-bar */}
        <div className="flex items-center px-6 py-2.5 border-b bg-muted/30 shrink-0">
          <span className="text-xs font-medium text-muted-foreground">Détails du paiement</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <InfoRow icon={Hash}       label="Référence"         value={paiement.reference} />
          <InfoRow icon={Calendar}   label="Date de paiement"  value={fmt(paiement.datePaiement)} />
          <InfoRow icon={Calendar}   label="Date d'expiration" value={fmt(paiement.dateExpiration)} valueClass={expColor} />
          <InfoRow icon={Clock}      label="Durée"             value="30 jours" />
          <InfoRow icon={Banknote}   label="Montant"           value={`${paiement.montant.toLocaleString("fr-FR")} FCFA`} />
          <InfoRow icon={CreditCard} label="Statut"            value={cfg.label} valueClass={
            isActif ? "text-green-600" : paiement.status === "expire" ? "text-red-500" : "text-orange-500"
          } />

          {/* Toggle renouvellement automatique */}
          <div className="flex items-center justify-between py-3 border-b border-dashed">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted shrink-0">
                <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Renouvellement automatique</p>
                <p className="text-xs text-muted-foreground">Renouveler avant expiration</p>
              </div>
            </div>
            <Switch
              checked={paiement.autoRenew}
              onCheckedChange={v => onToggleAutoRenew(paiement.id, v)}
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0 flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Fermer</Button>
          {isActif && (
            <Button variant="destructive" onClick={() => { onUnsubscribe(paiement.id); onOpenChange(false) }} className="gap-2">
              <RotateCcw className="h-4 w-4" />Désabonner
            </Button>
          )}
          {canRenew && (
            <Button onClick={() => { onOpenChange(false); onRenew(paiement) }} className="gap-2">
              <RotateCcw className="h-4 w-4" />Renouveler
            </Button>
          )}
        </div>

      </SheetContent>
    </Sheet>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function HistoriquePaiementsPage() {
  const [data, setData] = React.useState<Paiement[]>(HISTORIQUE)
  const [selected, setSelected] = React.useState<Paiement | null>(null)
  const [renewOpen, setRenewOpen] = React.useState(false)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 600))
    setData(HISTORIQUE)
    setIsRefreshing(false)
  }

  const handleDetail = (p: Paiement) => { setSelected(p); setDetailOpen(true) }
  const handleRenew  = (p: Paiement) => { setSelected(p); setRenewOpen(true) }

  const handleToggleAutoRenew = (id: string, value: boolean) => {
    setData(prev => prev.map(p => p.id === id ? { ...p, autoRenew: value } : p))
    setSelected(prev => prev?.id === id ? { ...prev, autoRenew: value } : prev)
    toast.success(value ? "Renouvellement automatique activé" : "Renouvellement automatique désactivé", { position: "bottom-right" })
  }

  const handleUnsubscribe = (id: string) => {
    setData(prev => prev.map(p => p.id === id ? { ...p, status: "expire", autoRenew: false } : p))
    toast.success("Désabonnement effectué", { position: "bottom-right" })
  }

  const handleSuccess = (id: string) => {
    const newExp = new Date(); newExp.setDate(newExp.getDate() + 30)
    setData(prev => prev.map(p => p.id === id ? { ...p, status: "actif", datePaiement: new Date(), dateExpiration: newExp } : p))
    toast.success("Réabonnement effectué avec succès", { position: "bottom-right" })
  }

  const columns: ColumnDef<Paiement>[] = [
    {
      accessorKey: "moduleNom",
      header: ({ column }) => (
        <div className="flex items-center gap-1 cursor-pointer select-none" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Module
          {column.getIsSorted() === "asc" ? <IconCaretUpFilled className="h-3 w-3" /> : column.getIsSorted() === "desc" ? <IconCaretDownFilled className="h-3 w-3" /> : <IconCaretUpDownFilled className="h-3 w-3 text-muted-foreground" />}
        </div>
      ),
      cell: ({ row }) => {
        const p = row.original
        return (
          <div>
            <p className="font-medium text-sm">{p.moduleNom}</p>
            <p className="text-xs text-muted-foreground font-mono">{p.reference}</p>
          </div>
        )
      },
    },
    {
      accessorKey: "montant",
      header: ({ column }) => (
        <div className="flex items-center gap-1 cursor-pointer select-none" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Montant
          {column.getIsSorted() === "asc" ? <IconCaretUpFilled className="h-3 w-3" /> : column.getIsSorted() === "desc" ? <IconCaretDownFilled className="h-3 w-3" /> : <IconCaretUpDownFilled className="h-3 w-3 text-muted-foreground" />}
        </div>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-sm">{(row.getValue("montant") as number).toLocaleString("fr-FR")} FCFA</p>
          <p className="text-xs text-muted-foreground">/ 30 jours</p>
        </div>
      ),
    },
    {
      accessorKey: "datePaiement",
      header: ({ column }) => (
        <div className="flex items-center gap-1 cursor-pointer select-none" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date paiement
          {column.getIsSorted() === "asc" ? <IconCaretUpFilled className="h-3 w-3" /> : column.getIsSorted() === "desc" ? <IconCaretDownFilled className="h-3 w-3" /> : <IconCaretUpDownFilled className="h-3 w-3 text-muted-foreground" />}
        </div>
      ),
      cell: ({ row }) => <span className="text-sm">{fmt(row.getValue("datePaiement") as Date)}</span>,
      sortingFn: (a, b) => (a.original.datePaiement.getTime()) - (b.original.datePaiement.getTime()),
    },
    {
      accessorKey: "dateExpiration",
      header: ({ column }) => (
        <div className="flex items-center gap-1 cursor-pointer select-none" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Expiration
          {column.getIsSorted() === "asc" ? <IconCaretUpFilled className="h-3 w-3" /> : column.getIsSorted() === "desc" ? <IconCaretDownFilled className="h-3 w-3" /> : <IconCaretUpDownFilled className="h-3 w-3 text-muted-foreground" />}
        </div>
      ),
      cell: ({ row }) => {
        const p = row.original
        const color = p.status === "expire" ? "text-red-500" : p.status === "expire_bientot" ? "text-orange-500" : ""
        return <span className={`text-sm font-medium ${color}`}>{fmt(p.dateExpiration)}</span>
      },
      sortingFn: (a, b) => (a.original.dateExpiration.getTime()) - (b.original.dateExpiration.getTime()),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="flex items-center gap-1 cursor-pointer select-none justify-center" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Statut
          {column.getIsSorted() === "asc" ? <IconCaretUpFilled className="h-3 w-3" /> : column.getIsSorted() === "desc" ? <IconCaretDownFilled className="h-3 w-3" /> : <IconCaretUpDownFilled className="h-3 w-3 text-muted-foreground" />}
        </div>
      ),
      cell: ({ row }) => {
        const s = row.getValue("status") as PaiementStatus
        const cfg = statusConfig[s]
        return <div className="text-center"><Badge className={cfg.className}>{cfg.label}</Badge></div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="text-right">
            <Button size="sm" variant="outline" className="gap-1.5 cursor-pointer text-xs" onClick={() => handleDetail(p)}>
              <Info className="h-3.5 w-3.5" />Détail
            </Button>
          </div>
        )
      },
    },
  ]

  const filteredData = React.useMemo(() => {
    if (statusFilter === "all") return data
    return data.filter(p => p.status === statusFilter)
  }, [data, statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  })

  const actifs       = data.filter(p => p.status === "actif").length
  const expires      = data.filter(p => p.status === "expire").length
  const bientot      = data.filter(p => p.status === "expire_bientot").length
  const totalDepense = data.reduce((s, p) => s + p.montant, 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl bg-blue-50 dark:bg-blue-950/30 px-5 py-4">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total dépensé</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{totalDepense.toLocaleString("fr-FR")} <span className="text-sm">FCFA</span></p>
        </div>
        <div className="flex-1 rounded-xl bg-green-50 dark:bg-green-950/30 px-5 py-4">
          <p className="text-xs font-medium text-green-600 dark:text-green-400">Actifs</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{actifs}</p>
        </div>
        <div className="flex-1 rounded-xl bg-orange-50 dark:bg-orange-950/30 px-5 py-4">
          <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Expire bientôt</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">{bientot}</p>
        </div>
        <div className="flex-1 rounded-xl bg-red-50 dark:bg-red-950/30 px-5 py-4">
          <p className="text-xs font-medium text-red-600 dark:text-red-400">Expirés</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{expires}</p>
        </div>
      </div>

      <hr className="border-dashed" />

      {/* Toolbar + Table */}
      <div className="w-full space-y-4">

        {/* Header user-management style */}
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-2 sm:items-center justify-between sm:bg-muted/30 sm:rounded-lg sm:p-4">
          <div>
            <h1 className="text-xl font-bold">Historique des Paiements</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Consultez et gérez vos abonnements aux modules.
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center sm:justify-end shrink-0">
            <LoadingButton
              size="sm"
              variant="secondary"
              isLoading={isRefreshing}
              className="border-0 w-auto shadow-none font-semibold cursor-pointer text-xs"
              onClick={handleRefresh}
            >
              <IconRefresh className="h-4 w-4" />
              Rafraîchir
            </LoadingButton>
            <Link href={APP_ROUTES.modules.shop}>
              <Button size="sm" className="cursor-pointer shadow-none font-semibold gap-2">
                <ShoppingBag className="h-4 w-4" />
                Shop des modules
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un module..."
                value={(table.getColumn("moduleNom")?.getFilterValue() as string) ?? ""}
                onChange={e => table.getColumn("moduleNom")?.setFilterValue(e.target.value)}
                className="pl-9 w-[220px] border-0 bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] cursor-pointer">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Statut</SelectLabel>
                  <SelectItem value="all" className="text-xs cursor-pointer">Tous</SelectItem>
                  <SelectItem value="actif" className="text-xs cursor-pointer">Actif</SelectItem>
                  <SelectItem value="expire_bientot" className="text-xs cursor-pointer">Expire bientôt</SelectItem>
                  <SelectItem value="expire" className="text-xs cursor-pointer">Expiré</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-semibold">
                <IconDownload className="h-4 w-4 mr-2" />Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => {
                const headers = ["Module", "Référence", "Montant", "Date paiement", "Date expiration", "Statut"]
                const rows = filteredData.map(p => [p.moduleNom, p.reference, `${p.montant} FCFA`, fmt(p.datePaiement), fmt(p.dateExpiration), statusConfig[p.status].label])
                const csv = [headers, ...rows].map(r => r.join(";")).join("\n")
                const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a"); a.href = url; a.download = "paiements.csv"; a.click()
                URL.revokeObjectURL(url)
              }}>
                <IconFileTypeCsv className="h-4 w-4 mr-2" />Exporter en CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                const headers = ["Module", "Référence", "Montant", "Date paiement", "Date expiration", "Statut"]
                const rows = filteredData.map(p => [p.moduleNom, p.reference, `${p.montant} FCFA`, fmt(p.datePaiement), fmt(p.dateExpiration), statusConfig[p.status].label])
                const xlsContent = [headers, ...rows].map(r => r.map(v => `<td>${v}</td>`).join("")).map(r => `<tr>${r}</tr>`).join("")
                const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="UTF-8"></head><body><table>${xlsContent}</table></body></html>`
                const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a"); a.href = url; a.download = "paiements.xls"; a.click()
                URL.revokeObjectURL(url)
              }}>
                <IconFileTypeXls className="h-4 w-4 mr-2" />Exporter en Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                const json = filteredData.map(p => ({ module: p.moduleNom, reference: p.reference, montant: p.montant, date_paiement: fmt(p.datePaiement), date_expiration: fmt(p.dateExpiration), statut: statusConfig[p.status].label }))
                const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a"); a.href = url; a.download = "paiements.json"; a.click()
                URL.revokeObjectURL(url)
              }}>
                <IconBraces className="h-4 w-4 mr-2" />Exporter en JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted rounded-t-lg">
              {table.getHeaderGroups().map(hg => (
                <TableRow key={hg.id}>
                  {hg.headers.map(h => (
                    <TableHead key={h.id}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Aucun paiement trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} paiement(s)
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Lignes par page</p>
              <Select value={`${table.getState().pagination.pageSize}`} onValueChange={v => table.setPageSize(Number(v))}>
                <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20].map(s => <SelectItem key={s} value={`${s}`}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><IconChevronsLeft className="h-4 w-4" /></Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><IconChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><IconChevronRight className="h-4 w-4" /></Button>
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><IconChevronsRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>

      <DetailDialog paiement={selected} open={detailOpen} onOpenChange={setDetailOpen} onRenew={handleRenew} onToggleAutoRenew={handleToggleAutoRenew} onUnsubscribe={handleUnsubscribe} />
      <RenewalDialog paiement={selected} open={renewOpen} onOpenChange={setRenewOpen} onSuccess={handleSuccess} />
    </div>
  )
}
