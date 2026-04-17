"use client"

import * as React from "react"
import { useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/loading-button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Item, ItemContent, ItemTitle, ItemActions } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Loader2,
  RotateCw,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Pencil,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import {
  IconLoader2,
  IconRefresh,
  IconEdit,
  IconUserOff,
  IconUserCheck,
} from "@tabler/icons-react"
import { User } from "./schema"
import { CountryDropdown } from "@/components/ui/country-dropdown"
import { PhoneInput } from "@/components/ui/phone-input"
import {
  handleGetUserDetailAction,
  handleUpdateUserAction,
  handleUpdateUserEmailAction,
  handleUpdateUserPhoneAction,
  handleAssignUserRolesAction,
  handleRevokeUserRolesAction,
  handleGrantUserPermissionsAction,
  handleRevokeUserPermissionsAction,
} from "@/actions/user/user_management/user_management_actions"
import {
  handleGetRolesListAction,
  handleGetPermissionsListAction,
  type ApiRole,
  type ApiPermission,
} from "@/actions/user/rbac/rbac_actions"
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum"

// ─── Mock Permissions Data ────────────────────────────────────────────────────

const MOCK_ROLES: ApiRole[] = [
  { code: "ADMIN",      name: "Administrateur", level: 1 },
  { code: "NOTAIRE",    name: "Notaire",         level: 2 },
  { code: "CLERC",      name: "Clerc",           level: 3 },
  { code: "SECRETAIRE", name: "Secrétaire",      level: 4 },
]

const MOCK_PERMISSIONS: ApiPermission[] = [
  // Utilisateurs
  { code: "user.view",   name: "Voir les utilisateurs",    description: "Consulter la liste et le détail des comptes.", category: "Utilisateurs" },
  { code: "user.create", name: "Créer un utilisateur",     description: "Ajouter un nouveau compte dans le système.",   category: "Utilisateurs" },
  { code: "user.edit",   name: "Modifier un utilisateur",  description: "Mettre à jour les informations d'un compte.",  category: "Utilisateurs" },
  { code: "user.delete", name: "Supprimer un utilisateur", description: "Supprimer définitivement un compte.",          category: "Utilisateurs" },
  // Modules
  { code: "module.view",        name: "Voir les modules",       description: "Accéder au catalogue des modules.",         category: "Modules" },
  { code: "module.activate",    name: "Activer un module",      description: "Souscrire et activer un module payant.",    category: "Modules" },
  { code: "module.unsubscribe", name: "Désabonner un module",   description: "Résilier un abonnement à un module.",       category: "Modules" },
  // Documents
  { code: "document.view",   name: "Voir les documents",   description: "Consulter les actes et fichiers.",       category: "Documents" },
  { code: "document.create", name: "Créer un document",    description: "Rédiger et enregistrer un nouvel acte.", category: "Documents" },
  { code: "document.sign",   name: "Signer un document",   description: "Apposer une signature électronique.",    category: "Documents" },
  // Rapports
  { code: "report.view",   name: "Voir les rapports",    description: "Accéder aux tableaux de bord et stats.", category: "Rapports" },
  { code: "report.export", name: "Exporter les rapports", description: "Télécharger les données en CSV/PDF.",   category: "Rapports" },
]

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserDetailTab = "modifier" | "permissions"

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  defaultTab?: UserDetailTab
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (prenom: string, nom: string) =>
  `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()

const formatDate = (iso?: string | null) => {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric",
    })
  } catch { return "—" }
}

const StatutBadge = ({ statut }: { statut: string }) => {
  const cls =
    statut === "Actif"    ? "bg-green-600/10 text-green-600" :
    statut === "Suspendu" ? "bg-red-600/10 text-red-600"     :
                            "bg-amber-600/10 text-amber-600"
  return (
    <Badge className={`rounded-md border-none text-xs uppercase ${cls}`}>
      {statut}
    </Badge>
  )
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-dashed">
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  )
}

// ─── EditableSection ──────────────────────────────────────────────────────────

function EditableSection({ title, children, onCancel, onSubmit, isPending, isOpen, onToggle }: {
  title: string
  children: React.ReactNode
  onCancel: () => void
  onSubmit: () => void
  isPending?: boolean
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-dashed rounded-lg overflow-hidden">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors">
        <span className="text-sm font-semibold">{title}</span>
        {isOpen
          ? <X className="w-4 h-4 text-muted-foreground" />
          : <Pencil className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-dashed">
          <div className="pt-3 space-y-3">{children}</div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" size="sm"
              className="border-0 shadow-none font-semibold cursor-pointer"
              disabled={isPending} onClick={onCancel}>
              Annuler
            </Button>
            <LoadingButton type="button" size="sm"
              className="border-0 shadow-none font-semibold cursor-pointer"
              isLoading={isPending} onClick={onSubmit}>
              Enregistrer
            </LoadingButton>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function UserProfileDialog({ open, onOpenChange, user, defaultTab = "modifier" }: UserProfileDialogProps) {

  // ── Onglet actif ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = React.useState<UserDetailTab>(defaultTab)
  useEffect(() => { if (open) setActiveTab(defaultTab) }, [open, defaultTab])

  // ────────────────────────────────────────────────────────────────────────────
  // CHARGEMENT PROFIL
  // ────────────────────────────────────────────────────────────────────────────

  const [isLoading, setIsLoading]     = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [detail, setDetail]           = React.useState<{
    adresse: string; nationalite: string; dateNaissance: string
    sexe: "Homme" | "Femme"; createdAt: string; roleNames: string[]; statut: string
  } | null>({
    adresse: "123 Rue des Notaires, Dakar",
    nationalite: "Sénégal",
    dateNaissance: "1985-06-15",
    sexe: "Homme",
    createdAt: "2023-01-10T00:00:00.000Z",
    roleNames: ["Notaire"],
    statut: "Actif",
  })

  const [editInfoOpen, setEditInfoOpen]   = React.useState(false)
  const [editEmailOpen, setEditEmailOpen] = React.useState(false)
  const [editPhoneOpen, setEditPhoneOpen] = React.useState(false)

  const [prenom, setPrenom]               = React.useState(user.prenom)
  const [nom, setNom]                     = React.useState(user.nom)
  const [nationalite, setNationalite]     = React.useState("")
  const [adresse, setAdresse]             = React.useState("")
  const [dateNaissance, setDateNaissance] = React.useState("")
  const [sexe, setSexe]                   = React.useState<"Homme" | "Femme">("Homme")
  const [email, setEmail]                 = React.useState(user.email)
  const [telephone, setTelephone]         = React.useState(user.telephone ?? "")

  const [origInfo, setOrigInfo]   = React.useState({ prenom: user.prenom, nom: user.nom, nationalite: "", adresse: "", dateNaissance: "", sexe: "Homme" as "Homme" | "Femme" })
  const [origEmail, setOrigEmail] = React.useState(user.email)
  const [origPhone, setOrigPhone] = React.useState(user.telephone ?? "")

  const [isSavingInfo, startSaveInfo]   = useTransition()
  const [isSavingEmail, startSaveEmail] = useTransition()
  const [isSavingPhone, startSavePhone] = useTransition()

  const loadDetail = React.useCallback((showLoader = true) => {
    if (!user.apiId) return
    if (showLoader) setIsLoading(true)
    else setIsRefreshing(true)
    handleGetUserDetailAction(user.apiId).then(({ data }) => {
      const d = (data as any)?.data ?? data
      if (!d) return
      const loadedNationalite = d.nationality ?? ""
      const loadedAdresse     = d.address ?? ""
      const loadedDate        = d.birth_date ?? ""
      const loadedSexe: "Homme" | "Femme" = d.gender === "F" ? "Femme" : "Homme"
      const loadedEmail       = d.email ?? user.email
      const loadedPhone       = d.telephone ?? user.telephone ?? ""
      const loadedRoles: string[] = Array.isArray(d.roles) ? d.roles.map((r: any) => r.name ?? r.code ?? String(r)) : user.roleNames ?? []
      const statusRaw = String(d.status_activation ?? "").toUpperCase()
      const statut = statusRaw === "ACTIVE" ? "Actif" : statusRaw === "SUSPENDED" ? "Suspendu" : "Inactif"

      setDetail({ adresse: loadedAdresse, nationalite: loadedNationalite, dateNaissance: loadedDate, sexe: loadedSexe, createdAt: d.created_at ?? "", roleNames: loadedRoles, statut })
      setPrenom(user.prenom); setNom(user.nom)
      setNationalite(loadedNationalite); setAdresse(loadedAdresse)
      setDateNaissance(loadedDate); setSexe(loadedSexe)
      setEmail(loadedEmail); setTelephone(loadedPhone)
      setOrigInfo({ prenom: user.prenom, nom: user.nom, nationalite: loadedNationalite, adresse: loadedAdresse, dateNaissance: loadedDate, sexe: loadedSexe })
      setOrigEmail(loadedEmail); setOrigPhone(loadedPhone)
    }).finally(() => { setIsLoading(false); setIsRefreshing(false) })
  }, [user.apiId, user.prenom, user.nom, user.email, user.telephone, user.roleNames])

  const handleSaveInfo = () => {
    if (!prenom.trim() || !nom.trim()) { toast.error("Prénom et nom requis"); return }
    startSaveInfo(async () => {
      if (user.apiId) {
        const result = await handleUpdateUserAction(user.apiId, { first_name: prenom.trim(), last_name: nom.trim(), birth_date: dateNaissance || undefined, address: adresse || undefined, gender: sexe === "Femme" ? "F" : "M", nationality: nationalite || undefined })
        if (!result.success) { toast.error("Erreur: " + result.message, { position: "bottom-right" }); return }
      }
      setOrigInfo({ prenom, nom, nationalite, adresse, dateNaissance, sexe })
      setEditInfoOpen(false)
      toast.success("Informations mises à jour", { position: "bottom-right" })
    })
  }

  const handleSaveEmail = () => {
    if (!email.trim()) { toast.error("Email requis"); return }
    startSaveEmail(async () => {
      if (user.apiId) {
        const result = await handleUpdateUserEmailAction(user.apiId, { email: email.trim() })
        if (!result.success) { toast.error("Erreur: " + result.message, { position: "bottom-right" }); return }
      }
      setOrigEmail(email); setEditEmailOpen(false)
      toast.success("Email mis à jour", { position: "bottom-right" })
    })
  }

  const handleSavePhone = () => {
    startSavePhone(async () => {
      if (user.apiId) {
        const result = await handleUpdateUserPhoneAction(user.apiId, { phone: telephone.trim() })
        if (!result.success) { toast.error("Erreur: " + result.message, { position: "bottom-right" }); return }
      }
      setOrigPhone(telephone); setEditPhoneOpen(false)
      toast.success("Téléphone mis à jour", { position: "bottom-right" })
    })
  }

  // ────────────────────────────────────────────────────────────────────────────
  // PERMISSIONS
  // ────────────────────────────────────────────────────────────────────────────

  const [permsLoading, setPermsLoading]           = React.useState(false)
  const [apiRoles, setApiRoles]                   = React.useState<ApiRole[]>(MOCK_ROLES)
  const [allPermissions, setAllPermissions]       = React.useState<ApiPermission[]>(MOCK_PERMISSIONS)
  const [userRoleNames, setUserRoleNames]         = React.useState<string[]>(["Notaire"])
  const [userRoleCodes, setUserRoleCodes]         = React.useState<string[]>(["NOTAIRE"])
  const [userBasePermCodes, setUserBasePermCodes] = React.useState<string[]>(["user.view", "module.view", "document.view", "document.sign", "report.view"])
  const [userAddedPermCodes, setUserAddedPermCodes]   = React.useState<string[]>(["user.edit"])
  const [userRemovedPermCodes, setUserRemovedPermCodes] = React.useState<string[]>(["user.delete"])
  const [openCategories, setOpenCategories]       = React.useState<Record<string, boolean>>({})
  const [openSections, setOpenSections]           = React.useState<Record<string, boolean>>({})
  const [, startPerm] = useTransition()
  const [, startRole] = useTransition()
  const [pendingRoleCode, setPendingRoleCode] = React.useState<string | null>(null)
  const [pendingPerm, setPendingPerm]         = React.useState<string | null>(null)

  const parsePermissions = (raw: any) => {
    if (!raw) return
    const perms = raw.permissions ?? raw.data?.permissions
    if (Array.isArray(perms)) {
      setUserBasePermCodes(perms); setUserAddedPermCodes([]); setUserRemovedPermCodes([])
    } else if (perms && typeof perms === "object") {
      const extractCodes = (group: any): string[] => {
        if (!group) return []
        if (Array.isArray(group)) return group.map((p: any) => (typeof p === "string" ? p : p.code)).filter(Boolean)
        return Object.values(group).flat().map((p: any) => (typeof p === "string" ? p : p.code)).filter(Boolean)
      }
      setUserBasePermCodes(extractCodes(perms.base))
      setUserAddedPermCodes(extractCodes(perms.custom?.added))
      setUserRemovedPermCodes(extractCodes(perms.custom?.removed))
    }
  }

  const loadPermissions = React.useCallback(() => {
    setPermsLoading(true)
    Promise.all([
      handleGetRolesListAction(),
      handleGetPermissionsListAction(),
      user.apiId ? handleGetUserDetailAction(user.apiId) : Promise.resolve(null),
    ]).then(([rolesRes, permsRes, detailRes]) => {
      if (rolesRes.data && (rolesRes.data as any[]).length > 0) setApiRoles(rolesRes.data)
      if (permsRes.data && (permsRes.data as any[]).length > 0) setAllPermissions(permsRes.data)
      if (detailRes?.data) {
        const raw = detailRes.data as any
        const d = raw?.data ?? raw
        const rolesRaw: any[] = Array.isArray(d.roles) ? d.roles : []
        setUserRoleNames(rolesRaw.map((r: any) => r.name ?? r.code ?? String(r)))
        setUserRoleCodes(rolesRaw.map((r: any) => r.code ?? r.name ?? String(r)))
        parsePermissions(d)
      }
    }).finally(() => setPermsLoading(false))
  }, [user.apiId])

  const grouped = React.useMemo(() => {
    return allPermissions.reduce((acc, p) => {
      const cat = (p as any).category ?? (p as any).module ?? (p as any).group ?? "Général"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(p)
      return acc
    }, {} as Record<string, ApiPermission[]>)
  }, [allPermissions])

  const handleGrantPerm = (code: string) => {
    if (!user.apiId) return
    setPendingPerm(code)
    startPerm(async () => {
      const result = await handleGrantUserPermissionsAction(user.apiId!, { permission: code })
      if (result.success) {
        if (userRemovedPermCodes.includes(code)) {
          setUserRemovedPermCodes(prev => prev.filter(c => c !== code))
          setUserBasePermCodes(prev => [...new Set([...prev, code])])
        } else {
          setUserAddedPermCodes(prev => [...new Set([...prev, code])])
        }
        toast.success("Permission attribuée", { position: "bottom-right" })
      } else { toast.error(`Erreur: ${result.message}`, { position: "bottom-right" }) }
      setPendingPerm(null)
    })
  }

  const handleRevokePerm = (code: string) => {
    if (!user.apiId) return
    setPendingPerm(code)
    startPerm(async () => {
      const result = await handleRevokeUserPermissionsAction(user.apiId!, { permission: code })
      if (result.success) {
        if (userAddedPermCodes.includes(code)) {
          setUserAddedPermCodes(prev => prev.filter(c => c !== code))
        } else {
          setUserBasePermCodes(prev => prev.filter(c => c !== code))
          setUserRemovedPermCodes(prev => [...new Set([...prev, code])])
        }
        toast.success("Permission révoquée", { position: "bottom-right" })
      } else { toast.error(`Erreur: ${result.message}`, { position: "bottom-right" }) }
      setPendingPerm(null)
    })
  }

  const handleAssignRole = (roleCode: string, roleName: string) => {
    if (!user.apiId) return
    setPendingRoleCode(roleCode)
    startRole(async () => {
      const result = await handleAssignUserRolesAction(user.apiId!, { role: roleCode as UserRoleCodeEnum })
      if (result.success) {
        setUserRoleNames(prev => [...new Set([...prev, roleName])])
        setUserRoleCodes(prev => [...new Set([...prev, roleCode])])
        toast.success(`Rôle ${roleName} assigné`, { position: "bottom-right" })
      } else { toast.error(`Erreur: ${result.message}`, { position: "bottom-right" }) }
      setPendingRoleCode(null)
    })
  }

  const handleRevokeRole = (roleCode: string, roleName: string) => {
    if (!user.apiId) return
    setPendingRoleCode(roleCode)
    startRole(async () => {
      const result = await handleRevokeUserRolesAction(user.apiId!, { role: roleCode as UserRoleCodeEnum })
      if (result.success) {
        setUserRoleNames(prev => prev.filter(n => n !== roleName))
        setUserRoleCodes(prev => prev.filter(c => c !== roleCode))
        toast.success(`Rôle ${roleName} révoqué`, { position: "bottom-right" })
      } else { toast.error(`Erreur: ${result.message}`, { position: "bottom-right" }) }
      setPendingRoleCode(null)
    })
  }

  // ── Chargement à l'ouverture ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    setDetail(null)
    loadDetail(true)
    loadPermissions()
  }, [open, user.apiId])

  const handleRefresh = () => { loadDetail(false); loadPermissions() }

  const displayStatut = detail?.statut ?? user.statut
  const displayRoles  = detail?.roleNames ?? user.roleNames ?? []

  // ─── Render ────────────────────────────────────────────────────────────────────
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-4xl flex flex-col gap-0 p-0 overflow-hidden">

        {/* ── Header ── */}
        <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarFallback className="text-sm font-bold bg-blue-500/10 text-blue-600">
                {getInitials(user.prenom, user.nom)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base truncate">{user.prenom} {user.nom}</SheetTitle>
              <SheetDescription className="text-xs truncate mt-0.5">{user.email}</SheetDescription>
            </div>
            <div className="flex flex-row items-center gap-1.5 mr-8">
              <StatutBadge statut={displayStatut} />
              {displayRoles.length > 0 && (
                <Badge variant="secondary" className="text-xs rounded-md">{displayRoles[0]}</Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* ── Barre actualiser ── */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b bg-muted/30 shrink-0">
          <span className="text-xs font-medium text-muted-foreground">Détails de l'utilisateur</span>
          <div className="flex items-center gap-1 mr-8">
            <LoadingButton
              type="button" variant="secondary" size="sm"
              className="h-7 px-2.5 text-xs gap-1.5 border-0 shadow-none font-semibold"
              isLoading={isRefreshing || permsLoading}
              onClick={handleRefresh}
            >
              <IconRefresh className="h-3.5 w-3.5" />
              Actualiser
            </LoadingButton>
          </div>
        </div>

        {/* ── Body ── */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <IconLoader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">

            {/* ── Colonne gauche ── */}
            <div className="w-[300px] shrink-0 flex flex-col border-r overflow-y-auto">
              <div className="flex-1 px-5 py-4 space-y-0">

                <InfoRow icon={Mail}        label="Email"            value={email} />
                <InfoRow icon={Phone}       label="Téléphone"        value={telephone || "—"} />
                <InfoRow icon={Globe}       label="Nationalité"      value={detail?.nationalite} />
                <InfoRow icon={MapPin}      label="Adresse"          value={detail?.adresse} />
                <InfoRow icon={Calendar}    label="Date de naissance" value={formatDate(detail?.dateNaissance)} />
                <InfoRow icon={Users}       label="Sexe"             value={detail?.sexe} />
                <InfoRow icon={ShieldCheck} label="Membre depuis"    value={formatDate(detail?.createdAt)} />

                {/* Rôles */}
                {displayRoles.length > 1 && (
                  <div className="flex items-start gap-3 py-2 border-b border-dashed">
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Rôles</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {displayRoles.map(r => (
                          <Badge key={r} variant="secondary" className="text-xs rounded-md">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* ── Colonne droite : Onglets ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as UserDetailTab)}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="px-6 pt-4 pb-3 border-b shrink-0">
                  <TabsList className="h-9 bg-muted/60 p-1 rounded-lg">
                    <TabsTrigger value="modifier" className="text-xs gap-1.5 cursor-pointer">
                      <IconEdit className="w-3.5 h-3.5" />
                      Modifier
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="text-xs gap-1.5 cursor-pointer">
                      Permissions
                      <span className="rounded-full bg-blue-500/15 text-blue-600 text-[10px] px-1.5 py-0.5 font-semibold leading-none">
                        {userRoleNames.length}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* ── Onglet Modifier ── */}
                <TabsContent value="modifier" className="flex-1 overflow-y-auto px-6 py-5 mt-0">
                  <div className="space-y-4">

                    <div className="px-0 pb-4 border-b border-dashed">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <IconEdit className="w-4 h-4 text-blue-500" />
                        Modifier l'utilisateur
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Modifiez les informations de ce compte
                      </p>
                    </div>

                    {/* Section : Infos personnelles */}
                    <EditableSection
                      title="Informations personnelles"
                      isOpen={editInfoOpen}
                      onToggle={() => setEditInfoOpen(v => !v)}
                      isPending={isSavingInfo}
                      onCancel={() => { setPrenom(origInfo.prenom); setNom(origInfo.nom); setNationalite(origInfo.nationalite); setAdresse(origInfo.adresse); setDateNaissance(origInfo.dateNaissance); setSexe(origInfo.sexe); setEditInfoOpen(false) }}
                      onSubmit={handleSaveInfo}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">Prénom</Label>
                          <Input className="border-0 bg-muted" value={prenom} onChange={e => setPrenom(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">Nom</Label>
                          <Input className="border-0 bg-muted" value={nom} onChange={e => setNom(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Nationalité</Label>
                        <CountryDropdown defaultValue={nationalite} onChange={c => setNationalite(c.name)} placeholder="Sélectionner un pays" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Adresse</Label>
                        <Input className="border-0 bg-muted" placeholder="Adresse" value={adresse} onChange={e => setAdresse(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">Date de naissance</Label>
                          <Input type="date" className="border-0 bg-muted" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">Sexe</Label>
                          <div className="grid grid-cols-2 gap-1">
                            {(["Homme", "Femme"] as const).map(s => (
                              <Button key={s} type="button" size="sm"
                                variant={sexe === s ? "default" : "secondary"}
                                className="cursor-pointer shadow-none border-0 font-semibold"
                                onClick={() => setSexe(s)}>
                                {s}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </EditableSection>

                    {/* Section : Email */}
                    <EditableSection
                      title="Adresse e-mail"
                      isOpen={editEmailOpen}
                      onToggle={() => setEditEmailOpen(v => !v)}
                      isPending={isSavingEmail}
                      onCancel={() => { setEmail(origEmail); setEditEmailOpen(false) }}
                      onSubmit={handleSaveEmail}
                    >
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Email</Label>
                        <Input type="email" className="border-0 bg-muted" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                    </EditableSection>

                    {/* Section : Téléphone */}
                    <EditableSection
                      title="Numéro de téléphone"
                      isOpen={editPhoneOpen}
                      onToggle={() => setEditPhoneOpen(v => !v)}
                      isPending={isSavingPhone}
                      onCancel={() => { setTelephone(origPhone); setEditPhoneOpen(false) }}
                      onSubmit={handleSavePhone}
                    >
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Téléphone</Label>
                        <PhoneInput
                          defaultCountry="SN"
                          countries={["SN"]}
                          value={telephone}
                          onChange={v => setTelephone(v ?? "")}
                          placeholder="77 123 45 67"
                          className="w-full"
                        />
                      </div>
                    </EditableSection>

                  </div>
                </TabsContent>

                {/* ── Onglet Permissions ── */}
                <TabsContent value="permissions" className="flex-1 overflow-y-auto px-4 py-4 mt-0">
                  {permsLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Tabs defaultValue="roles" className="w-full">
                      <TabsList className="w-full h-9 bg-muted/60 p-1 rounded-lg mb-3">
                        <TabsTrigger value="roles" className="cursor-pointer flex-1 text-xs">Rôles</TabsTrigger>
                        <TabsTrigger value="acces" className="cursor-pointer flex-1 text-xs">Accès</TabsTrigger>
                      </TabsList>

                      {/* ── Rôles ── */}
                      <TabsContent value="roles">
                        <div className="w-full space-y-1 py-1">
                          {apiRoles.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">Aucun rôle disponible</p>
                          ) : (
                            apiRoles.map((r) => {
                              const hasRole = userRoleNames.includes(r.name) || userRoleCodes.includes(r.code)
                                || userRoleNames.some(n => n.toLowerCase() === r.name.toLowerCase())
                                || userRoleCodes.some(c => c.toLowerCase() === r.code.toLowerCase())
                              const isThisRolePending = pendingRoleCode === r.code
                              return (
                                <Item key={r.code} variant="muted" className="py-2 rounded-lg">
                                  <ItemContent><ItemTitle>{r.name}</ItemTitle></ItemContent>
                                  <ItemActions>
                                    {hasRole ? (
                                      <LoadingButton variant="destructive" size="sm"
                                        className="cursor-pointer shadow-none text-white"
                                        isLoading={isThisRolePending} disabled={isThisRolePending}
                                        onClick={() => handleRevokeRole(r.code, r.name)}>
                                        Révoquer
                                      </LoadingButton>
                                    ) : (
                                      <LoadingButton size="sm"
                                        className="cursor-pointer shadow-none font-semibold"
                                        isLoading={isThisRolePending} disabled={isThisRolePending}
                                        onClick={() => handleAssignRole(r.code, r.name)}>
                                        Assigner
                                      </LoadingButton>
                                    )}
                                  </ItemActions>
                                </Item>
                              )
                            })
                          )}
                        </div>
                      </TabsContent>

                      {/* ── Accès ── */}
                      <TabsContent value="acces">
                        <div className="space-y-1 pt-1">
                          {allPermissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">Aucune permission disponible</p>
                          ) : (
                            Object.entries(grouped).map(([category, permissions]) => {
                              const isCategoryOpen = openCategories[category] ?? false
                              const addedPerms   = permissions.filter(p => userAddedPermCodes.includes(p.code))
                              const removedPerms = permissions.filter(p => userRemovedPermCodes.includes(p.code))
                              const basePerms    = permissions.filter(p => !addedPerms.some(a => a.code === p.code) && !removedPerms.some(r => r.code === p.code))

                              const renderSub = (title: string, sKey: string, perms: ApiPermission[]) => {
                                const key = `${category}-${sKey}`
                                const isOpen = openSections[key] ?? false
                                return (
                                  <div className="border-t border-dashed" key={key}>
                                    <div className="flex items-center p-2 gap-2">
                                      <Button size="icon" variant="secondary"
                                        className="cursor-pointer shadow-none h-7 w-7 shrink-0"
                                        onClick={() => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))}>
                                        {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                      </Button>
                                      <div className="flex-1 border-t border-dashed border-border" />
                                      <span className="font-semibold text-sm px-2">{title}</span>
                                      <div className="flex-1 border-t border-dashed border-border" />
                                      <Badge variant="secondary">{perms.length}</Badge>
                                    </div>
                                    {isOpen && (
                                      perms.length > 0 ? (
                                        <div className="divide-y divide-dashed">
                                          {perms.map(p => {
                                            const isPending = pendingPerm === p.code
                                            const isOwned = sKey === "base" ? userBasePermCodes.includes(p.code) : sKey === "added"
                                            return (
                                              <div key={p.code} className="flex items-center justify-between p-3">
                                                <div className="space-y-0.5 min-w-0">
                                                  <p className="text-sm font-semibold">{p.name}</p>
                                                  {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                                                  <p className="text-xs text-muted-foreground/50 font-mono">{p.code}</p>
                                                </div>
                                                <LoadingButton size="sm"
                                                  variant={isOwned ? "destructive" : "secondary"}
                                                  className="cursor-pointer shadow-none font-semibold shrink-0 ml-3"
                                                  isLoading={isPending}
                                                  onClick={() => isOwned ? handleRevokePerm(p.code) : handleGrantPerm(p.code)}>
                                                  {sKey === "base" ? (isOwned ? "Révoquer" : "Attribuer") : sKey === "added" ? "Retirer" : "Attribuer"}
                                                </LoadingButton>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-muted-foreground text-center py-4 pb-3">Aucune permission</p>
                                      )
                                    )}
                                  </div>
                                )
                              }

                              return (
                                <Card key={category} className="border-dashed shadow-none divide-y divide-dashed p-0 gap-0">
                                  <CardHeader className="flex flex-row items-center justify-between p-2">
                                    <div className="flex items-center gap-2">
                                      <Button size="icon" variant="ghost"
                                        className="cursor-pointer shadow-none h-7 w-7 shrink-0"
                                        onClick={() => setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }))}>
                                        {isCategoryOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                      </Button>
                                      <span className="font-semibold text-sm">{category}</span>
                                    </div>
                                    <Badge variant="secondary">{permissions.length}</Badge>
                                  </CardHeader>
                                  {isCategoryOpen && (
                                    <CardContent className="p-0">
                                      {renderSub("Base", "base", basePerms)}
                                      {renderSub("Ajoutées", "added", addedPerms)}
                                      {renderSub("Révoquées", "removed", removedPerms)}
                                    </CardContent>
                                  )}
                                </Card>
                              )
                            })
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </TabsContent>

              </Tabs>
            </div>

          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}
