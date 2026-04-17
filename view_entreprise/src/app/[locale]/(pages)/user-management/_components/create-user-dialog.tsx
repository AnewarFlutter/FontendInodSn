"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/loading-button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { User } from "./schema"
import { toast } from "sonner"
import type { ApiRole } from "@/actions/user/rbac/rbac_actions"
import {
  UserRoundPlus,
  UserRoundPen,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  User as UserIcon,
  KeyRound,
  Check,
  Loader2,
} from "lucide-react"
import { useTransition, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  handleCreateUserAction,
  handleGetUserDetailAction,
  handleUpdateUserAction,
  handleUpdateUserEmailAction,
  handleUpdateUserPhoneAction,
} from "@/actions/user/user_management/user_management_actions"
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum"
import { PhoneInput } from "@/components/ui/phone-input"
import { CountryDropdown } from "@/components/ui/country-dropdown"

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  onCreateUser?: (user: User) => void
  onUpdateUser?: (user: User) => void
  roles?: ApiRole[]
}

const steps = [
  { title: "Infos Personnelles", icon: UserIcon },
  { title: "Rôle", icon: KeyRound },
]

// ─── SECTION EDIT ────────────────────────────────────────────────────────────

function EditSection({
  title,
  description,
  children,
  onCancel,
  onSubmit,
  isPending,
}: {
  title: string
  description: string
  children: React.ReactNode
  onCancel: () => void
  onSubmit: () => void
  isPending?: boolean
}) {
  return (
    <div className="py-8 px-6 space-y-4">
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {children}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button" variant="secondary" size="sm"
          className="border-0 cursor-pointer shadow-none font-semibold"
          disabled={isPending}
          onClick={onCancel}
        >
          Annuler
        </Button>
        <LoadingButton
          type="button" size="sm"
          className="border-0 cursor-pointer shadow-none font-semibold"
          isLoading={isPending}
          onClick={onSubmit}
        >
          Mettre à jour
        </LoadingButton>
      </div>
    </div>
  )
}

// ─── MODE EDIT ───────────────────────────────────────────────────────────────

function EditForm({ user, onClose, onUpdateUser }: { user: User; onClose: () => void; onUpdateUser?: (user: User) => void }) {
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false)
  const [prenom, setPrenom] = React.useState(user.prenom)
  const [nom, setNom] = React.useState(user.nom)
  const [adresse, setAdresse] = React.useState("")
  const [nationalite, setNationalite] = React.useState(user.nationalite ?? "")
  const [dateNaissance, setDateNaissance] = React.useState("")
  const [sexe, setSexe] = React.useState<"Homme" | "Femme">("Homme")
  const [email, setEmail] = React.useState(user.email)
  const [telephone, setTelephone] = React.useState(user.telephone ?? "")
  const [resetOpen, setResetOpen] = React.useState(true)
  const [generatedPassword, setGeneratedPassword] = React.useState<string | null>(null)
  const [isGenerating, startGenerate] = useTransition()
  const [isSavingInfo, startSaveInfo] = useTransition()
  const [isSavingEmail, startSaveEmail] = useTransition()
  const [isSavingPhone, startSavePhone] = useTransition()

  // valeurs originales pour reset par section
  const [origInfo, setOrigInfo] = React.useState({ prenom: user.prenom, nom: user.nom, adresse: "", nationalite: user.nationalite ?? "", dateNaissance: "", sexe: "Homme" as "Homme" | "Femme" })
  const [origEmail, setOrigEmail] = React.useState(user.email)
  const [origTelephone, setOrigTelephone] = React.useState(user.telephone ?? "")

  // Charge le détail utilisateur pour pré-remplir les champs non disponibles dans UserBasic
  useEffect(() => {
    if (!user.apiId) return
    setIsLoadingDetails(true)
    handleGetUserDetailAction(user.apiId).then(({ data }) => {
      const u = (data as any)?.data ?? data
      if (!u) return
      const loadedNationalite = u.nationality ?? ""
      const loadedAdresse = u.address ?? ""
      const loadedDateNaissance = u.birth_date ?? ""
      const loadedSexe: "Homme" | "Femme" = u.gender === "F" ? "Femme" : "Homme"
      const loadedEmail = u.email ?? user.email
      const loadedTelephone = u.telephone ?? user.telephone ?? ""

      setNationalite(loadedNationalite)
      setAdresse(loadedAdresse)
      setDateNaissance(loadedDateNaissance)
      setSexe(loadedSexe)
      setEmail(loadedEmail)
      setTelephone(loadedTelephone)

      setOrigInfo({ prenom: user.prenom, nom: user.nom, adresse: loadedAdresse, nationalite: loadedNationalite, dateNaissance: loadedDateNaissance, sexe: loadedSexe })
      setOrigEmail(loadedEmail)
      setOrigTelephone(loadedTelephone)
    }).finally(() => setIsLoadingDetails(false))
  }, [user.apiId])

  const generatePassword = () => {
    startGenerate(async () => {
      await new Promise(r => setTimeout(r, 800))
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"
      const pwd = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
      setGeneratedPassword(pwd)
      toast.success("Mot de passe généré", { position: "bottom-right" })
    })
  }

  if (isLoadingDetails) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-100px)] overflow-y-auto divide-y divide-dashed">

      {/* Section 1 — Infos personnelles */}
      <EditSection
        title="Informations personnelles"
        description="Modifiez les informations personnelles de l'utilisateur."
        isPending={isSavingInfo}
        onCancel={() => {
          setPrenom(origInfo.prenom)
          setNom(origInfo.nom)
          setAdresse(origInfo.adresse)
          setNationalite(origInfo.nationalite)
          setDateNaissance(origInfo.dateNaissance)
          setSexe(origInfo.sexe)
        }}
        onSubmit={() => {
          if (!prenom.trim() || !nom.trim()) { toast.error("Prénom et nom requis"); return }
          startSaveInfo(async () => {
            if (user.apiId) {
              const result = await handleUpdateUserAction(user.apiId, {
                first_name: prenom.trim(),
                last_name: nom.trim(),
                birth_date: dateNaissance.trim() || undefined,
                address: adresse.trim() || undefined,
                gender: sexe === "Femme" ? "F" : "M",
                nationality: nationalite.trim() || undefined,
              })
              if (!result.success) { toast.error("Erreur: " + result.message, { position: "bottom-right" }); return }
            }
            // pas de onUpdateUser ici pour éviter le re-render qui ferme le modal
            toast.success("Informations mises à jour", { position: "bottom-right" })
          })
        }}
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
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Date de naissance</Label>
            <Input type="date" className="border-0 bg-muted" value={dateNaissance}
              onChange={e => setDateNaissance(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Nationalité</Label>
            <CountryDropdown
              defaultValue={nationalite}
              onChange={(country) => setNationalite(country.name)}
              placeholder="Sélectionner un pays"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-bold">Adresse</Label>
          <Input className="border-0 bg-muted" placeholder="Entrez l'adresse"
            value={adresse} onChange={e => setAdresse(e.target.value)} />
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
      </EditSection>

      {/* Section 2 — Forcer l'email */}
      <EditSection
        title="Forcer la mise à jour de l'adresse e-mail"
        description="Voulez-vous forcer la mise à jour de l'adresse e-mail de l'utilisateur ?"
        isPending={isSavingEmail}
        onCancel={() => setEmail(origEmail)}
        onSubmit={() => {
          if (!email.trim()) { toast.error("Email requis"); return }
          startSaveEmail(async () => {
            if (user.apiId) {
              const result = await handleUpdateUserEmailAction(user.apiId, { email: email.trim() })
              if (!result.success) { toast.error("Erreur: " + result.message, { position: "bottom-right" }); return }
            }
            toast.success("Email mis à jour", { position: "bottom-right" })
          })
        }}
      >
        <div className="space-y-1.5">
          <Label className="text-xs font-bold">Email</Label>
          <Input type="email" className="border-0 bg-muted" value={email}
            onChange={e => setEmail(e.target.value)} />
        </div>
      </EditSection>

      {/* Section 3 — Forcer le téléphone */}
      <EditSection
        title="Forcer la mise à jour du numéro de téléphone"
        description="Voulez-vous forcer la mise à jour du numéro de téléphone de l'utilisateur ?"
        isPending={isSavingPhone}
        onCancel={() => setTelephone(origTelephone)}
        onSubmit={() => {
          startSavePhone(async () => {
            if (user.apiId) {
              const result = await handleUpdateUserPhoneAction(user.apiId, { phone: telephone.trim() })
              if (!result.success) { toast.error("Erreur: " + result.message, { position: "bottom-right" }); return }
            }
            toast.success("Téléphone mis à jour", { position: "bottom-right" })
          })
        }}
      >
        <div className="space-y-1.5">
          <Label className="text-xs font-bold">Téléphone</Label>
          <PhoneInput
            defaultCountry="SN"
            countries={["SN"]}
            value={telephone}
            onChange={(value) => setTelephone(value ?? "")}
            placeholder="77 123 45 67"
            className="w-full"
          />
        </div>
      </EditSection>

      {/* Section 4 — Réinitialiser le mot de passe */}
      <div className="py-0">
        <button type="button"
          className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => setResetOpen(v => !v)}
        >
          <span className="font-bold text-sm">Réinitialiser le mot de passe</span>
          <ChevronUp className={cn("w-4 h-4 transition-transform", !resetOpen && "rotate-180")} />
        </button>
        {resetOpen && (
          <div className="px-6 pb-6 space-y-3">
            <div className="w-full flex items-center justify-center bg-muted rounded-lg py-3 text-sm text-muted-foreground font-mono">
              {generatedPassword ?? "Aucun mot de passe généré"}
            </div>
            <LoadingButton type="button" variant="secondary" size="sm"
              className="cursor-pointer shadow-none font-semibold border-0"
              isLoading={isGenerating}
              onClick={generatePassword}
            >
              Générer un mot de passe
            </LoadingButton>
            <Button type="button" size="sm"
              className="w-full cursor-pointer shadow-none font-semibold border-0"
              disabled={!generatedPassword}
              onClick={() => { toast.success("Mot de passe réinitialisé", { position: "bottom-right" }); setGeneratedPassword(null) }}
            >
              Confirmer la réinitialisation
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}

// ─── MODE CREATE ─────────────────────────────────────────────────────────────

function CreateForm({ onClose, onCreateUser, roles = [] }: { onClose: () => void; onCreateUser?: (user: User) => void; roles?: ApiRole[] }) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    nom: "", prenom: "", email: "", telephone: "", nationalite: "", dateNaissance: "", gender: "M" as "M" | "F", roleCode: "",
  })
  const [isSubmitting, startSubmit] = useTransition()

  const selectedRole = roles.find(r => r.code === formData.roleCode)

  const handleSubmit = () => {
    if (!formData.nom.trim()) { toast.error("Le nom est requis"); return }
    if (!formData.prenom.trim()) { toast.error("Le prénom est requis"); return }
    if (!formData.email.trim()) { toast.error("L'email est requis"); return }
    if (!formData.roleCode) { toast.error("Veuillez sélectionner un rôle"); return }

    startSubmit(async () => {
      const result = await handleCreateUserAction({
        first_name: formData.prenom.trim(),
        last_name: formData.nom.trim(),
        email: formData.email.trim(),
        phone: formData.telephone.trim() || undefined,
        gender: formData.gender,
        birth_date: formData.dateNaissance.trim() || undefined,
        nationality: formData.nationalite.trim() || undefined,
        roles: formData.roleCode ? [formData.roleCode as UserRoleCodeEnum] : undefined,
      })
      if (!result.success) {
        toast.error("Erreur: " + result.message, { position: "bottom-right" })
        return
      }
      const newUser: User = {
        id: result.data ? 0 : Date.now(),
        apiId: result.data?.id,
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim() || undefined,
        nationalite: formData.nationalite.trim() || undefined,
        roleId: 0,
        roleName: selectedRole?.name ?? "",
        roleNames: selectedRole?.name ? [selectedRole.name] : [],
        statut: "Actif",
        permissionsSupplementaires: [],
        permissionsRetirees: [],
        createdAt: new Date().toISOString(),
      }
      onCreateUser?.(newUser)
      toast.success(`${newUser.prenom} ${newUser.nom} créé avec succès`, { position: "bottom-right" })
      onClose()
    })
  }

  return (
    <>
      <div className="h-[calc(100vh-120px)] overflow-y-auto px-6 space-y-6 pt-6 pb-24">
        {/* Stepper */}
        <div className="flex items-start gap-3">
          {steps.map((step, index) => {
            const stepNum = index + 1
            const isCompleted = currentStep > stepNum
            const isActive = currentStep === stepNum
            const isLast = index === steps.length - 1
            return (
              <React.Fragment key={index}>
                <button type="button"
                  className="flex flex-col items-start gap-1.5 cursor-pointer"
                  onClick={() => setCurrentStep(stepNum)}
                >
                  <div className={cn(
                    "size-8 border-2 rounded-full flex items-center justify-center transition-colors",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isActive && "border-primary text-primary",
                    !isCompleted && !isActive && "border-border text-muted-foreground"
                  )}>
                    {isCompleted ? <Check className="size-4" /> : <step.icon className="size-4" />}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground">Étape {stepNum}</span>
                    <span className={cn("text-sm font-semibold", !isActive && !isCompleted && "text-muted-foreground")}>
                      {step.title}
                    </span>
                  </div>
                </button>
                {!isLast && (
                  <div className={cn("flex-1 h-0.5 mt-4 rounded-full", isCompleted ? "bg-green-500" : "bg-border")} />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Étape 1 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Prénom <span className="text-red-500">*</span></Label>
                <Input className="border-0 bg-muted" placeholder="Ex: Mamadou"
                  value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Nom <span className="text-red-500">*</span></Label>
                <Input className="border-0 bg-muted" placeholder="Ex: Diallo"
                  value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Email <span className="text-red-500">*</span></Label>
              <Input type="email" className="border-0 bg-muted" placeholder="exemple@restaurant.sn"
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Téléphone</Label>
                <PhoneInput
                  defaultCountry="SN"
                  countries={["SN"]}
                  value={formData.telephone}
                  onChange={(value) => setFormData({ ...formData, telephone: value ?? "" })}
                  placeholder="77 123 45 67"
                  className="w-full"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Nationalité</Label>
                <CountryDropdown
                  defaultValue={formData.nationalite}
                  onChange={(country) => setFormData({ ...formData, nationalite: country.name })}
                  placeholder="Sélectionner un pays"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Date de naissance</Label>
                <Input type="date" className="border-0 bg-muted" value={formData.dateNaissance}
                  onChange={e => setFormData({ ...formData, dateNaissance: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Sexe <span className="text-red-500">*</span></Label>
                <div className="grid grid-cols-2 gap-1">
                  {(["M", "F"] as const).map(g => (
                    <Button key={g} type="button" size="sm"
                      variant={formData.gender === g ? "default" : "secondary"}
                      className="cursor-pointer shadow-none border-0 font-semibold"
                      onClick={() => setFormData({ ...formData, gender: g })}>
                      {g === "M" ? "Homme" : "Femme"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-1 justify-end">
              <Button type="button" variant="secondary" size="sm"
                className="shadow-none cursor-pointer font-semibold"
                onClick={() => setCurrentStep(s => s - 1)} disabled={(currentStep as number) <= 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button type="button" variant="secondary" size="sm"
                className="shadow-none cursor-pointer font-semibold"
                onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 2 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Rôle <span className="text-red-500">*</span> — Sélectionnez le rôle</Label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(role => (
                  <div key={role.code}
                    className="flex items-center gap-2 bg-muted/50 rounded-md p-3 cursor-pointer"
                    onClick={() => setFormData({ ...formData, roleCode: role.code })}
                  >
                    <Checkbox checked={formData.roleCode === role.code}
                      onCheckedChange={() => setFormData({ ...formData, roleCode: role.code })} />
                    <span className="text-sm font-medium">{role.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-1 justify-end">
              <Button type="button" variant="secondary" size="sm"
                className="shadow-none cursor-pointer font-semibold"
                onClick={() => setCurrentStep(s => s - 1)} disabled={(currentStep as number) <= 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button type="button" variant="secondary" size="sm"
                className="shadow-none cursor-pointer font-semibold"
                onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-background px-6 py-4 flex items-center justify-end">
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm"
            className="border-0 cursor-pointer shadow-none font-semibold" onClick={onClose}>
            Annuler
          </Button>
          <LoadingButton type="button" size="sm"
            className="border-0 cursor-pointer shadow-none font-semibold"
            onClick={handleSubmit} disabled={currentStep < steps.length}
            isLoading={isSubmitting}>
            Créer
          </LoadingButton>
        </div>
      </div>
    </>
  )
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────

export function CreateUserDialog({ open, onOpenChange, user, onCreateUser, onUpdateUser, roles }: CreateUserDialogProps) {
  const isEditing = !!user

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-none w-full sm:w-[calc(100vw-400px)] h-full p-0 gap-0" side="right">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-dashed">
          <SheetTitle className="flex items-center gap-2">
            {isEditing
              ? <UserRoundPen className="w-4 h-4 fill-blue-500" />
              : <UserRoundPlus className="w-4 h-4 fill-green-500" />}
            {isEditing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Modifiez les informations du compte utilisateur"
              : "Créez un nouveau compte utilisateur"}
          </SheetDescription>
        </SheetHeader>

        {isEditing
          ? <EditForm user={user} onClose={() => onOpenChange(false)} onUpdateUser={onUpdateUser} />
          : <CreateForm onClose={() => onOpenChange(false)} onCreateUser={onCreateUser} roles={roles} />
        }
      </SheetContent>
    </Sheet>
  )
}
