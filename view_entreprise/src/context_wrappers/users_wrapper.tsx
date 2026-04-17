"use client"

import * as React from "react"
import { useCallback } from "react"
import { toast } from "sonner"
import type { User } from "@/app/[locale]/(pages)/user-management/_components/schema"
import type { ApiRole } from "@/actions/user/rbac/rbac_actions"
import { UserManagementProvider } from "@/contexts/users-context"

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_ROLES: ApiRole[] = [
  { code: "notaire",    name: "Notaire",        level: 1 },
  { code: "clerc",      name: "Clerc",          level: 2 },
  { code: "secretaire", name: "Secrétaire",     level: 3 },
  { code: "admin",      name: "Administrateur", level: 0 },
]

const MOCK_USERS: User[] = [
  {
    id: 1,
    apiId: "mock-001",
    nom: "Diallo",
    prenom: "Mamadou",
    email: "mamadou.diallo@notadesk.sn",
    telephone: "+221701234567",
    nationalite: "Sénégalaise",
    roleId: 1,
    roleName: "Notaire",
    roleNames: ["Notaire"],
    statut: "Actif",
    permissionsSupplementaires: [],
    permissionsRetirees: [],
    createdAt: new Date("2023-01-10").toISOString(),
    lastLogin: new Date("2026-04-15").toISOString(),
  },
  {
    id: 2,
    apiId: "mock-002",
    nom: "Sow",
    prenom: "Aminata",
    email: "aminata.sow@notadesk.sn",
    telephone: "+221776543210",
    nationalite: "Sénégalaise",
    roleId: 2,
    roleName: "Clerc",
    roleNames: ["Clerc"],
    statut: "Actif",
    permissionsSupplementaires: [],
    permissionsRetirees: [],
    createdAt: new Date("2023-03-15").toISOString(),
    lastLogin: new Date("2026-04-14").toISOString(),
  },
  {
    id: 3,
    apiId: "mock-003",
    nom: "Konaté",
    prenom: "Ibrahim",
    email: "ibrahim.konate@notadesk.sn",
    telephone: "+221705551234",
    nationalite: "Ivoirienne",
    roleId: 2,
    roleName: "Clerc",
    roleNames: ["Clerc"],
    statut: "Actif",
    permissionsSupplementaires: [],
    permissionsRetirees: [],
    createdAt: new Date("2023-06-01").toISOString(),
    lastLogin: new Date("2026-04-10").toISOString(),
  },
  {
    id: 4,
    apiId: "mock-004",
    nom: "Ndiaye",
    prenom: "Rokhaya",
    email: "rokhaya.ndiaye@notadesk.sn",
    telephone: "+221786667788",
    nationalite: "Sénégalaise",
    roleId: 3,
    roleName: "Secrétaire",
    roleNames: ["Secrétaire"],
    statut: "Actif",
    permissionsSupplementaires: [],
    permissionsRetirees: [],
    createdAt: new Date("2023-09-20").toISOString(),
    lastLogin: new Date("2026-04-15").toISOString(),
  },
  {
    id: 5,
    apiId: "mock-005",
    nom: "Traoré",
    prenom: "Moussa",
    email: "moussa.traore@notadesk.sn",
    telephone: "+221708889900",
    nationalite: "Malienne",
    roleId: 3,
    roleName: "Secrétaire",
    roleNames: ["Secrétaire"],
    statut: "Inactif",
    permissionsSupplementaires: [],
    permissionsRetirees: [],
    createdAt: new Date("2024-01-08").toISOString(),
    lastLogin: new Date("2026-03-20").toISOString(),
  },
  {
    id: 6,
    apiId: "mock-006",
    nom: "Baldé",
    prenom: "Fatoumata",
    email: "fatoumata.balde@notadesk.sn",
    telephone: "+221774445566",
    nationalite: "Guinéenne",
    roleId: 1,
    roleName: "Notaire",
    roleNames: ["Notaire"],
    statut: "Suspendu",
    permissionsSupplementaires: [],
    permissionsRetirees: [],
    createdAt: new Date("2024-02-14").toISOString(),
    lastLogin: new Date("2026-02-28").toISOString(),
  },
  {
    id: 7,
    apiId: "mock-007",
    nom: "Fall",
    prenom: "Cheikh",
    email: "cheikh.fall@notadesk.sn",
    telephone: "+221701112233",
    nationalite: "Sénégalaise",
    roleId: 4,
    roleName: "Administrateur",
    roleNames: ["Administrateur"],
    statut: "Actif",
    permissionsSupplementaires: [],
    permissionsRetirees: [],
    createdAt: new Date("2023-01-05").toISOString(),
    lastLogin: new Date("2026-04-16").toISOString(),
  },
]

// ─── Wrapper ─────────────────────────────────────────────────────────────────

export default function UsersWrapper({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = React.useState<User[]>(MOCK_USERS)
  const [apiRoles] = React.useState<ApiRole[]>(MOCK_ROLES)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const refreshUsers = useCallback(async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setUsers(MOCK_USERS)
    toast.success("Données rafraîchies", { position: "bottom-right" })
    setIsRefreshing(false)
  }, [])

  const createUser = useCallback((newUser: User) => {
    setUsers(prev => [...prev, newUser])
  }, [])

  const updateUser = useCallback((updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
  }, [])

  const deleteUser = useCallback((id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }, [])

  return (
    <UserManagementProvider
      users={users}
      apiRoles={apiRoles}
      totalRoles={apiRoles.length}
      isLoading={isRefreshing}
      refreshUsers={refreshUsers}
      createUser={createUser}
      updateUser={updateUser}
      deleteUser={deleteUser}
    >
      {children}
    </UserManagementProvider>
  )
}
