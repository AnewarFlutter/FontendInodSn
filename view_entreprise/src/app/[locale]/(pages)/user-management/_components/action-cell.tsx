"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  IconChevronDown,
  IconEdit,
  IconTrash,
  IconUserOff,
  IconUserCheck,
  IconUser,
} from "@tabler/icons-react"
import {
  UserRoundMinus,
  UserRoundCheck,
  TriangleAlert,
} from "lucide-react"
import { User } from "./schema"
import { CreateUserDialog } from "./create-user-dialog"
import { UserProfileDialog, type UserDetailTab } from "./user-profile-dialog"
import { toast } from "sonner"
import {
  handleSoftDeleteUserAction,
  handleSuspendUserAction,
  handleActivateUserAction,
} from "@/actions/user/user_management/user_management_actions"
import { useTransition } from "react"
import { useUserManagementContext } from "@/contexts/users-context"

interface ActionCellProps {
  user: User
}

export function ActionCell({ user }: ActionCellProps) {
  const { updateUser, deleteUser, apiRoles, refreshUsers } = useUserManagementContext()
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [profileDefaultTab, setProfileDefaultTab] = React.useState<UserDetailTab>("modifier")
  const [editOpen, setEditOpen] = React.useState(false)
  const [suspendOpen, setSuspendOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [reason, setReason] = React.useState("")

  const isSuspended = user.statut === "Suspendu"
  const isInactive = user.statut === "Inactif"
  const canActivate = isSuspended || isInactive
  const [isDeleting, startDelete] = useTransition()
  const [isSuspending, startSuspend] = useTransition()

  const handleDelete = () => {
    startDelete(async () => {
      if (user.apiId) {
        const result = await handleSoftDeleteUserAction(user.apiId)
        if (!result.success) {
          toast.error(`Erreur: ${result.message}`, { position: "bottom-right" })
          return
        }
      }
      deleteUser(user.id)
      toast.success(`${user.prenom} ${user.nom} supprimé avec succès`, { position: "bottom-right" })
      setDeleteOpen(false)
    })
  }

  const handleSuspendSubmit = () => {
    startSuspend(async () => {
      if (user.apiId) {
        const result = canActivate
          ? await handleActivateUserAction(user.apiId)
          : await handleSuspendUserAction(user.apiId)
        if (!result.success) {
          toast.error(`Erreur: ${result.message}`, { position: "bottom-right" })
          return
        }
      }
      const newStatut = canActivate ? "Actif" : "Suspendu"
      const action = canActivate ? "réactivé" : "suspendu"
      updateUser({ ...user, statut: newStatut })
      toast.success(`${user.prenom} ${user.nom} ${action} avec succès`, { position: "bottom-right" })
      setReason("")
      setSuspendOpen(false)
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            Action
            <IconChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => { setProfileDefaultTab("modifier"); setProfileOpen(true) }}>
            <IconUser className="mr-2 h-4 w-4" />
            Détail
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setSuspendOpen(true)}>
            {canActivate ? (
              <>
                <IconUserCheck className="mr-2 h-4 w-4" />
                {isInactive ? "Activer" : "Réactiver"}
              </>
            ) : (
              <>
                <IconUserOff className="mr-2 h-4 w-4" />
                Suspendre
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-red-600"
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sheet Profil + Permissions */}
      <UserProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        user={user}
        defaultTab={profileDefaultTab}
      />

      {/* Sheet Modifier — onUpdateUser met à jour localement, refreshUsers re-fetch la liste à la fermeture */}
      <CreateUserDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          // Re-fetch la liste complète quand le dialog se ferme pour garantir la cohérence
          if (!open) refreshUsers()
        }}
        user={user}
        roles={apiRoles}
        onUpdateUser={updateUser}
      />

      {/* Sheet Suspendre / Réactiver */}
      <Sheet open={suspendOpen} onOpenChange={(v) => { setSuspendOpen(v); if (!v) setReason("") }}>
        <SheetContent className="w-[400px] sm:w-[540px] h-full p-0 gap-0">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle className="flex items-center gap-2">
              {canActivate ? (
                <UserRoundCheck className="w-4 h-4 fill-green-500" />
              ) : (
                <UserRoundMinus className="w-4 h-4 fill-orange-500" />
              )}
              {canActivate ? (isInactive ? "Activer l'utilisateur" : "Réactiver l'utilisateur") : "Suspendre l'utilisateur"}
            </SheetTitle>
            <SheetDescription>
              {user.prenom} {user.nom}
            </SheetDescription>
          </SheetHeader>

          <div className="h-[calc(100vh-120px)] overflow-y-auto px-6 space-y-5 pb-24">
            {!canActivate && (
              <>
                <div>
                  <p className="font-bold text-sm mb-2">Implications de la suspension</p>
                  <ul className="list-disc ml-5 space-y-1 text-xs text-muted-foreground">
                    <li>L'utilisateur ne pourra plus se connecter au système</li>
                    <li>Toutes ses sessions actives seront immédiatement invalidées</li>
                    <li>Ses données et historiques sont conservés</li>
                    <li>Il pourra être réactivé à tout moment</li>
                    <li>Les actions en cours seront annulées</li>
                    <li>Une notification lui sera envoyée par email</li>
                  </ul>
                </div>

                <div className="flex gap-3 items-start rounded-lg bg-muted p-3">
                  <TriangleAlert className="w-4 h-4 fill-yellow-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold">Note importante</p>
                    <p className="text-muted-foreground">
                      Cette action prend effet immédiatement. L'utilisateur sera déconnecté de toutes ses sessions en cours.
                    </p>
                  </div>
                </div>
              </>
            )}

            {canActivate && (
              <div className="flex gap-3 items-start rounded-lg bg-muted p-3">
                <UserRoundCheck className="w-4 h-4 fill-green-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold">{isInactive ? "Activation du compte" : "Réactivation du compte"}</p>
                  <p className="text-muted-foreground">
                    L'utilisateur <strong>{user.prenom} {user.nom}</strong> pourra à nouveau se connecter et accéder au système après {isInactive ? "activation" : "réactivation"}.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">
                Raison {!canActivate && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                className="border-0 bg-muted resize-none"
                placeholder={
                  canActivate
                    ? "Motif de réactivation (optionnel)..."
                    : "Indiquez la raison de la suspension..."
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t bg-background px-6 py-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="border-0 cursor-pointer shadow-none font-semibold"
              onClick={() => { setSuspendOpen(false); setReason("") }}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              className={`border-0 cursor-pointer shadow-none font-semibold ${
                canActivate
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
              onClick={handleSuspendSubmit}
              disabled={isSuspending || (!canActivate && !reason.trim())}
            >
              {canActivate ? (isInactive ? "Activer" : "Réactiver") : "Confirmer la suspension"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* AlertDialog Supprimer */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>{user.prenom} {user.nom}</strong> ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
