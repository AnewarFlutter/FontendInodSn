"use client"

import { createContext, useContext } from "react"
import type { User } from "@/app/[locale]/(pages)/user-management/_components/schema"
import type { ApiRole } from "@/actions/user/rbac/rbac_actions"

type UserManagementContextType = {
  users: User[]
  apiRoles: ApiRole[]
  totalRoles: number
  isLoading: boolean
  refreshUsers: () => Promise<void>
  createUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: (id: number) => void
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined)

export const useUserManagementContext = () => {
  const ctx = useContext(UserManagementContext)
  if (!ctx) throw new Error("useUserManagementContext must be used inside UserManagementProvider")
  return ctx
}

export const UserManagementProvider = ({
  children,
  ...value
}: { children: React.ReactNode } & UserManagementContextType) => {
  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  )
}
