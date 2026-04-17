"use client"

import * as React from "react"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/loading-button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Item, ItemContent, ItemTitle, ItemActions } from "@/components/ui/item"
import { User } from "./schema"
import { toast } from "sonner"
import { LucideKey, ChevronDown, ChevronRight, Loader2 } from "lucide-react"
import {
  handleGetRolesListAction,
  handleGetPermissionsListAction,
  type ApiRole,
  type ApiPermission,
} from "@/actions/user/rbac/rbac_actions"
import {
  handleGetUserDetailAction,
  handleAssignUserRolesAction,
  handleRevokeUserRolesAction,
  handleGrantUserPermissionsAction,
  handleRevokeUserPermissionsAction,
} from "@/actions/user/user_management/user_management_actions"
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum"

interface ManagePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

type SectionKey = "base" | "added" | "removed"

export function ManagePermissionsDialog({
  open,
  onOpenChange,
  user,
}: ManagePermissionsDialogProps) {
  const [apiRoles, setApiRoles] = React.useState<ApiRole[]>([])
  const [allPermissions, setAllPermissions] = React.useState<ApiPermission[]>([])
  const [userRoleNames, setUserRoleNames] = React.useState<string[]>([])
  const [userRoleCodes, setUserRoleCodes] = React.useState<string[]>([])

  // Permissions structurées: base / ajoutées / révoquées
  const [userBasePermCodes, setUserBasePermCodes] = React.useState<string[]>([])
  const [userAddedPermCodes, setUserAddedPermCodes] = React.useState<string[]>([])
  const [userRemovedPermCodes, setUserRemovedPermCodes] = React.useState<string[]>([])

  const [loading, setLoading] = React.useState(false)
  const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({})
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({})
  const [, startPerm] = useTransition()
  const [, startRole] = useTransition()
  const [pendingRoleCode, setPendingRoleCode] = React.useState<string | null>(null)
  const [pendingPerm, setPendingPerm] = React.useState<string | null>(null)

  const parsePermissions = (raw: any) => {
    if (!raw) return
    // raw est déjà dé-wrappé (raw.data ?? raw) depuis refreshDatas
    const perms = raw.permissions ?? raw.data?.permissions

    if (Array.isArray(perms)) {
      // Format plat (tableau de strings) → tout en base
      setUserBasePermCodes(perms)
      setUserAddedPermCodes([])
      setUserRemovedPermCodes([])
    } else if (perms && typeof perms === "object") {
      // Format structuré: { base: { CATEGORY: [PermObj, ...] }, custom: { added: {...}, removed: {...} } }
      // On extrait les codes depuis les objets imbriqués par catégorie
      const extractCodes = (group: any): string[] => {
        if (!group) return []
        if (Array.isArray(group)) {
          // Format plat (tableau de strings ou d'objets)
          return group.map((p: any) => (typeof p === "string" ? p : p.code)).filter(Boolean)
        }
        // Format groupé par catégorie: { CATEGORY: [PermObj, ...], ... }
        return Object.values(group).flat().map((p: any) => (typeof p === "string" ? p : p.code)).filter(Boolean)
      }

      setUserBasePermCodes(extractCodes(perms.base))
      setUserAddedPermCodes(extractCodes(perms.custom?.added))
      setUserRemovedPermCodes(extractCodes(perms.custom?.removed))
    }
  }

  const refreshDatas = React.useCallback(() => {
    setLoading(true)
    Promise.all([
      handleGetRolesListAction(),
      handleGetPermissionsListAction(),
      user.apiId ? handleGetUserDetailAction(user.apiId) : Promise.resolve(null),
    ]).then(([rolesRes, permsRes, detailRes]) => {
      if (rolesRes.data) setApiRoles(rolesRes.data)
      if (permsRes.data) setAllPermissions(permsRes.data)
      if (detailRes?.data) {
        const raw = detailRes.data as any
        const d = raw?.data ?? raw
        const rolesRaw: any[] = Array.isArray(d.roles) ? d.roles : []
        const roles: string[] = rolesRaw.map((r: any) => r.name ?? r.code ?? String(r))
        const codes: string[] = rolesRaw.map((r: any) => r.code ?? r.name ?? String(r))
        setUserRoleNames(roles)
        setUserRoleCodes(codes)
        parsePermissions(d)
        // parsePermissions reçoit déjà le bon niveau (d = raw.data ?? raw)
      }
    }).finally(() => setLoading(false))
  }, [user.apiId])

  React.useEffect(() => {
    if (!open) return
    refreshDatas()
  }, [open, user.apiId])

  // Grouper les permissions par catégorie
  const grouped = React.useMemo(() => {
    return allPermissions.reduce((acc, p) => {
      const cat = (p as any).category ?? (p as any).module ?? (p as any).group ?? "Général"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(p)
      return acc
    }, {} as Record<string, ApiPermission[]>)
  }, [allPermissions])

  // ── Actions permissions ──────────────────────────────────────────────────────

  const handleGrantPerm = (code: string) => {
    if (!user.apiId) return
    setPendingPerm(code)
    startPerm(async () => {
      const result = await handleGrantUserPermissionsAction(user.apiId!, { permission: code })
      if (result.success) {
        if (userRemovedPermCodes.includes(code)) {
          // Perm révoquée → on la restaure dans Base (c'est une perm par défaut)
          setUserRemovedPermCodes(prev => prev.filter(c => c !== code))
          setUserBasePermCodes(prev => [...new Set([...prev, code])])
        } else {
          // Perm assignable dans Base → elle passe dans Ajoutées
          setUserAddedPermCodes(prev => [...new Set([...prev, code])])
        }
        toast.success("Permission attribuée", { position: "bottom-right" })
      } else {
        toast.error(`Erreur: ${result.message}`, { position: "bottom-right" })
      }
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
          // Perm ajoutée → on la retire, elle retourne dans Base (sans l'avoir en base perm)
          setUserAddedPermCodes(prev => prev.filter(c => c !== code))
        } else {
          // Perm par défaut dans Base → elle passe dans Révoquées
          setUserBasePermCodes(prev => prev.filter(c => c !== code))
          setUserRemovedPermCodes(prev => [...new Set([...prev, code])])
        }
        toast.success("Permission révoquée", { position: "bottom-right" })
      } else {
        toast.error(`Erreur: ${result.message}`, { position: "bottom-right" })
      }
      setPendingPerm(null)
    })
  }

  // ── Actions rôles ────────────────────────────────────────────────────────────

  const handleAssignRole = (roleCode: string, roleName: string) => {
    if (!user.apiId) return
    setPendingRoleCode(roleCode)
    startRole(async () => {
      const result = await handleAssignUserRolesAction(user.apiId!, { role: roleCode as UserRoleCodeEnum })
      if (result.success) {
        const newRoleNames = [...new Set([...userRoleNames, roleName])]
        const newRoleCodes = [...new Set([...userRoleCodes, roleCode])]
        setUserRoleNames(newRoleNames)
        setUserRoleCodes(newRoleCodes)
        toast.success(`Rôle ${roleName} assigné`, { position: "bottom-right" })
      } else {
        toast.error(`Erreur: ${result.message}`, { position: "bottom-right" })
      }
      setPendingRoleCode(null)
    })
  }

  const handleRevokeRole = (roleCode: string, roleName: string) => {
    if (!user.apiId) return
    setPendingRoleCode(roleCode)
    startRole(async () => {
      const result = await handleRevokeUserRolesAction(user.apiId!, { role: roleCode as UserRoleCodeEnum })
      if (result.success) {
        const newRoleNames = userRoleNames.filter(n => n !== roleName)
        const newRoleCodes = userRoleCodes.filter(c => c !== roleCode)
        setUserRoleNames(newRoleNames)
        setUserRoleCodes(newRoleCodes)
        toast.success(`Rôle ${roleName} révoqué`, { position: "bottom-right" })
      } else {
        toast.error(`Erreur: ${result.message}`, { position: "bottom-right" })
      }
      setPendingRoleCode(null)
    })
  }

  // ── Render sub-section (Base / Ajoutées / Révoquées) ─────────────────────────

  const renderSection = (
    title: string,
    sectionKey: SectionKey,
    category: string,
    permissions: ApiPermission[],
    renderAction: (p: ApiPermission) => React.ReactNode
  ) => {
    const key = `${category}-${sectionKey}`
    const isOpen = openSections[key] ?? false

    return (
      <div className="border-t border-dashed" key={key}>
        <div className="flex items-center p-2 gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="cursor-pointer shadow-none h-7 w-7 shrink-0"
            onClick={() => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))}
          >
            {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </Button>
          <div className="flex-1 border-t border-dashed border-border" />
          <span className="font-semibold text-sm px-2">{title}</span>
          <div className="flex-1 border-t border-dashed border-border" />
          <Badge variant="secondary">{permissions.length}</Badge>
        </div>

        {isOpen && (
          permissions.length > 0 ? (
            <div className="divide-y divide-dashed">
              {permissions.map(p => {
                const isPending = pendingPerm === p.code
                return (
                  <div key={p.code} className="flex items-center justify-between p-3">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-semibold">{p.name}</p>
                      {p.description && (
                        <p className="text-xs text-muted-foreground">{p.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground/50 font-mono">{p.code}</p>
                    </div>
                    <LoadingButton
                      size="sm"
                      variant="secondary"
                      className="cursor-pointer shadow-none font-semibold shrink-0 ml-3"
                      isLoading={isPending}
                      onClick={() => renderAction(p)}
                    >
                      {(renderAction(p) as any)?.props?.children ?? "Action"}
                    </LoadingButton>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">Aucune permission</p>
          )
        )}
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[560px] h-full p-0 divide-y divide-dashed gap-0" side="right">

        {/* Header */}
        <SheetHeader className="mb-0 pb-4 px-5 pt-5">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <LucideKey className="w-4 h-4 fill-blue-500" />
              Gestion des accès
            </SheetTitle>
            <LoadingButton
              size="sm"
              variant="secondary"
              className="cursor-pointer shadow-none font-semibold border-0"
              isLoading={loading}
              onClick={refreshDatas}
            >
              Actualiser
            </LoadingButton>
          </div>
          <SheetDescription>
            Rôles et permissions de {user.prenom} {user.nom}.
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        <section className="h-[calc(100vh-100px)] overflow-y-auto px-4 pt-4 pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Tabs defaultValue="roles" className="w-full space-y-0">
              <TabsList className="w-full">
                <TabsTrigger value="roles" className="cursor-pointer flex-1">Rôles</TabsTrigger>
                <TabsTrigger value="acces" className="cursor-pointer flex-1">Accès</TabsTrigger>
              </TabsList>

              {/* ── Rôles Tab ── */}
              <TabsContent value="roles">
                <div className="w-full space-y-1 py-3">
                  {apiRoles.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Aucun rôle disponible</p>
                  ) : (
                    apiRoles.map((r) => {
                      const hasRole = userRoleNames.includes(r.name)
                        || userRoleCodes.includes(r.code)
                        || userRoleNames.some(n => n.toLowerCase() === r.name.toLowerCase())
                        || userRoleCodes.some(c => c.toLowerCase() === r.code.toLowerCase())
                      const isThisRolePending = pendingRoleCode === r.code
                      return (
                        <Item key={r.code} variant="muted" className="py-2 rounded-lg">
                          <ItemContent>
                            <ItemTitle>{r.name}</ItemTitle>
                          </ItemContent>
                          <ItemActions>
                            {hasRole ? (
                              <LoadingButton
                                variant="destructive"
                                size="sm"
                                className="cursor-pointer shadow-none text-white"
                                isLoading={isThisRolePending}
                                disabled={isThisRolePending}
                                onClick={() => handleRevokeRole(r.code, r.name)}
                              >
                                Révoquer
                              </LoadingButton>
                            ) : (
                              <LoadingButton
                                size="sm"
                                className="cursor-pointer shadow-none font-semibold"
                                isLoading={isThisRolePending}
                                disabled={isThisRolePending}
                                onClick={() => handleAssignRole(r.code, r.name)}
                              >
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

              {/* ── Accès Tab ── */}
              <TabsContent value="acces">
                <div className="space-y-1 pt-3">
                  {allPermissions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Aucune permission disponible</p>
                  ) : (
                    Object.entries(grouped).map(([category, permissions]) => {
                      const isCategoryOpen = openCategories[category] ?? false

                      // Répartir les permissions dans les 3 sections
                      const addedPerms = permissions.filter(p => userAddedPermCodes.includes(p.code))
                      const removedPerms = permissions.filter(p => userRemovedPermCodes.includes(p.code))
                      const basePerms = permissions.filter(
                        p => !addedPerms.some(a => a.code === p.code) && !removedPerms.some(r => r.code === p.code)
                      )

                      return (
                        <Card key={category} className="border-dashed shadow-none divide-y divide-dashed p-0 gap-0">
                          {/* En-tête catégorie */}
                          <CardHeader className="flex flex-row items-center justify-between p-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="cursor-pointer shadow-none h-7 w-7 shrink-0"
                                onClick={() => setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                              >
                                {isCategoryOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                              </Button>
                              <span className="font-semibold text-sm">{category}</span>
                            </div>
                            <Badge variant="secondary">{permissions.length}</Badge>
                          </CardHeader>

                          {isCategoryOpen && (
                            <CardContent className="p-0">

                              {/* Base */}
                              <div className="border-t border-dashed">
                                <div className="flex items-center p-2 gap-2">
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="cursor-pointer shadow-none h-7 w-7 shrink-0"
                                    onClick={() => setOpenSections(prev => ({ ...prev, [`${category}-base`]: !prev[`${category}-base`] }))}
                                  >
                                    {openSections[`${category}-base`] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                  </Button>
                                  <div className="flex-1 border-t border-dashed border-border" />
                                  <span className="font-semibold text-sm px-2">Base</span>
                                  <div className="flex-1 border-t border-dashed border-border" />
                                  <Badge variant="secondary">{basePerms.length}</Badge>
                                </div>
                                {openSections[`${category}-base`] && (
                                  basePerms.length > 0 ? (
                                    <div className="divide-y divide-dashed">
                                      {basePerms.map(p => {
                                        // Perm par défaut que l'utilisateur possède → "Révoquer"
                                        // Perm assignable que l'utilisateur ne possède pas → "Attribuer"
                                        const isDefault = userBasePermCodes.includes(p.code)
                                        const isPending = pendingPerm === p.code
                                        return (
                                          <div key={p.code} className="flex items-center justify-between p-3">
                                            <div className="space-y-0.5 min-w-0">
                                              <p className="text-sm font-semibold">{p.name}</p>
                                              {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                                              <p className="text-xs text-muted-foreground/50 font-mono">{p.code}</p>
                                            </div>
                                            <LoadingButton
                                              size="sm"
                                              variant={isDefault ? "destructive" : "secondary"}
                                              className="cursor-pointer shadow-none font-semibold shrink-0 ml-3"
                                              isLoading={isPending}
                                              onClick={() => isDefault ? handleRevokePerm(p.code) : handleGrantPerm(p.code)}
                                            >
                                              {isDefault ? "Révoquer" : "Attribuer"}
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

                              {/* Ajoutées */}
                              <div className="border-t border-dashed">
                                <div className="flex items-center p-2 gap-2">
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="cursor-pointer shadow-none h-7 w-7 shrink-0"
                                    onClick={() => setOpenSections(prev => ({ ...prev, [`${category}-added`]: !prev[`${category}-added`] }))}
                                  >
                                    {openSections[`${category}-added`] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                  </Button>
                                  <div className="flex-1 border-t border-dashed border-border" />
                                  <span className="font-semibold text-sm px-2">Ajoutées</span>
                                  <div className="flex-1 border-t border-dashed border-border" />
                                  <Badge variant="secondary">{addedPerms.length}</Badge>
                                </div>
                                {openSections[`${category}-added`] && (
                                  addedPerms.length > 0 ? (
                                    <div className="divide-y divide-dashed">
                                      {addedPerms.map(p => {
                                        const isPending = pendingPerm === p.code
                                        return (
                                          <div key={p.code} className="flex items-center justify-between p-3">
                                            <div className="space-y-0.5 min-w-0">
                                              <p className="text-sm font-semibold">{p.name}</p>
                                              {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                                              <p className="text-xs text-muted-foreground/50 font-mono">{p.code}</p>
                                            </div>
                                            <LoadingButton
                                              size="sm"
                                              variant="destructive"
                                              className="cursor-pointer shadow-none font-semibold shrink-0 ml-3"
                                              isLoading={isPending}
                                              onClick={() => handleRevokePerm(p.code)}
                                            >
                                              Retirer
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

                              {/* Révoquées */}
                              <div className="border-t border-dashed">
                                <div className="flex items-center p-2 gap-2">
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="cursor-pointer shadow-none h-7 w-7 shrink-0"
                                    onClick={() => setOpenSections(prev => ({ ...prev, [`${category}-removed`]: !prev[`${category}-removed`] }))}
                                  >
                                    {openSections[`${category}-removed`] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                  </Button>
                                  <div className="flex-1 border-t border-dashed border-border" />
                                  <span className="font-semibold text-sm px-2">Révoquées</span>
                                  <div className="flex-1 border-t border-dashed border-border" />
                                  <Badge variant="secondary">{removedPerms.length}</Badge>
                                </div>
                                {openSections[`${category}-removed`] && (
                                  removedPerms.length > 0 ? (
                                    <div className="divide-y divide-dashed">
                                      {removedPerms.map(p => {
                                        const isPending = pendingPerm === p.code
                                        return (
                                          <div key={p.code} className="flex items-center justify-between p-3">
                                            <div className="space-y-0.5 min-w-0">
                                              <p className="text-sm font-semibold">{p.name}</p>
                                              {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                                              <p className="text-xs text-muted-foreground/50 font-mono">{p.code}</p>
                                            </div>
                                            <LoadingButton
                                              size="sm"
                                              variant="secondary"
                                              className="cursor-pointer shadow-none font-semibold shrink-0 ml-3"
                                              isLoading={isPending}
                                              onClick={() => handleGrantPerm(p.code)}
                                            >
                                              Attribuer
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
        </section>
      </SheetContent>
    </Sheet>
  )
}
