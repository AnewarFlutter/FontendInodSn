"use client"

import * as React from "react"
import { BreadcrumbUsers } from "./_components/Breadcrumb"
import { DataTable } from "./_components/data-table"
import { CreateUserDialog } from "./_components/create-user-dialog"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/loading-button"
import {
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react"
import UsersWrapper from "@/context_wrappers/users_wrapper"
import { useUserManagementContext } from "@/contexts/users-context"

function UserManagementContent() {
  const { users, apiRoles, totalRoles, isLoading, refreshUsers, createUser } = useUserManagementContext()
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.statut === "Actif").length
  const suspendedUsers = users.filter((u) => u.statut === "Suspendu").length

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-4 mb-4">
        <BreadcrumbUsers />
      </div>

      <hr className="border-dashed" />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Cartes de statistiques */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl bg-blue-50 dark:bg-blue-950/30 px-5 py-4">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Utilisateurs</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{totalUsers}</p>
          </div>
          <div className="flex-1 rounded-xl bg-green-50 dark:bg-green-950/30 px-5 py-4">
            <p className="text-xs font-medium text-green-600 dark:text-green-400">Utilisateurs Actifs</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{activeUsers}</p>
          </div>
          <div className="flex-1 rounded-xl bg-red-50 dark:bg-red-950/30 px-5 py-4">
            <p className="text-xs font-medium text-red-600 dark:text-red-400">Utilisateurs Suspendus</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{suspendedUsers}</p>
          </div>
          <div className="flex-1 rounded-xl bg-purple-50 dark:bg-purple-950/30 px-5 py-4">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Rôles Définis</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{totalRoles}</p>
          </div>
        </div>

        <hr className="border-dashed" />

        {/* Tableau des utilisateurs */}
        <div>
          <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-2 sm:items-center justify-between sm:bg-muted/30 sm:rounded-lg sm:p-4 mb-4">
            <div>
              <h1 className="text-xl font-bold">Gestion des Utilisateurs</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Gérez les utilisateurs, leurs rôles et permissions d'accès au système.
              </p>
            </div>
            <div className="flex flex-row gap-2 items-center sm:justify-end shrink-0">
              <LoadingButton
                size="sm"
                variant="secondary"
                isLoading={isLoading}
                className="border-0 w-auto shadow-none font-semibold cursor-pointer text-xs"
                onClick={refreshUsers}
              >
                <IconRefresh className="h-4 w-4" />
                Rafraîchir
              </LoadingButton>
              <Button size="sm" className="cursor-pointer shadow-none font-semibold" onClick={() => setCreateDialogOpen(true)}>
                <IconPlus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </div>
          </div>
          <DataTable />
        </div>
        <CreateUserDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateUser={createUser}
          roles={apiRoles}
        />
      </div>
    </div>
  )
}

export default function UserManagementPage() {
  return (
    <UsersWrapper>
      <UserManagementContent />
    </UsersWrapper>
  )
}
