"use server";

/**
 * Fichier action prévu pour le module user et la feature user_management.
 * Actions utilisées par les composants React pour interagir avec les UseCases via les controllers.
 * N'appelez pas de UseCases directement ici, mais via les controllers.
 * N'appelez jamais les controllers depuis les composants React, seulement depuis les fichiers actions.
 */

import { featuresDi } from "@/di/features_di";
import { GenderEnum } from "@/modules/user/enums/gender_enum";
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum";
import { MockPaginatedUsers, MockUsers } from "@/modules/user/user_management/domain/mocks/mock_users";
import { CreateUserPayload } from "@/modules/user/user_management/domain/types/create_user_payload";
import { UpdateUserCaissierProfilePayload } from "@/modules/user/user_management/domain/types/update_user_caissier_profile_payload";
import { UpdateUserCuisinierProfilePayload } from "@/modules/user/user_management/domain/types/update_user_cuisinier_profile_payload";
import { UpdateUserManagerProfilePayload } from "@/modules/user/user_management/domain/types/update_user_manager_profile_payload";
import { UpdateUserPayload } from "@/modules/user/user_management/domain/types/update_user_payload";
import { UpdateUserServeurProfilePayload } from "@/modules/user/user_management/domain/types/update_user_serveur_profile_payload";
import { PaginatedUsers } from "@/modules/user/types/paginated_users_types";
import { UserBasic } from "@/modules/user/types/user_basic_types";
import { UserDetail } from "@/modules/user/types/user_detail_types";
import { APP_CONFIG } from "@/shared/constants/app_config";
import {
    assignRolesFormSchema,
    createUserFormSchema,
    updateCaissierProfileFormSchema,
    updateCuisinierProfileFormSchema,
    updateManagerProfileFormSchema,
    updateServeurProfileFormSchema,
    updateUserEmailFormSchema,
    updateUserFormSchema,
    updateUserPhoneFormSchema,
    userPermissionsFormSchema,
} from "@/shared/constants/forms/user";
import { AppActionResult } from "@/shared/types/global";
import z from "zod";

// ─── Liste & Détail ────────────────────────────────────────────────────────────

export async function handleGetCuisiniersAction(
    search?: string
): Promise<AppActionResult<PaginatedUsers>> {
    if (APP_CONFIG.IS_DEV_MODE()) {
        const cuisiniers = MockUsers.filter(u =>
            (u.roles as any[]).some((r: any) => r.code === UserRoleCodeEnum.CUISINIER)
        );
        return {
            success: true,
            message: "Cuisiniers récupérés.",
            data: { count: cuisiniers.length, results: cuisiniers as any },
        };
    }

    const result = await featuresDi.userManagementController.getUsersList(1, 200, search);

    if (!result) return { success: false, message: "Impossible de récupérer les cuisiniers." };

    const cuisiniers = (result.results ?? []).filter((u: any) =>
        Array.isArray(u.roles) && u.roles.some((r: any) => r.code === UserRoleCodeEnum.CUISINIER)
    );

    return {
        success: true,
        message: "Cuisiniers récupérés.",
        data: { ...result, count: cuisiniers.length, results: cuisiniers },
    };
}

export async function handleGetUsersListAction(
    page?: number,
    page_size?: number,
    search?: string
): Promise<AppActionResult<PaginatedUsers>> {

    if (APP_CONFIG.IS_DEV_MODE()) {
        return {
            success: true,
            message: "Recherche des utilisateurs effectuée.",
            data: MockPaginatedUsers,
        };
    }

    const result = await featuresDi.userManagementController.getUsersList(page, page_size, search);

    if (!result) {
        return { success: false, message: "Impossible de récupérer la liste des utilisateurs." };
    }

    return {
        success: true,
        message: "Recherche des utilisateurs effectuée.",
        data: result,
    };
}

export async function handleGetUserDetailAction(user_id: string): Promise<AppActionResult<UserDetail | null>> {

    if (APP_CONFIG.IS_DEV_MODE()) {
        const mockUser = MockUsers.find(u => u.id === user_id) || null;
        return {
            success: true,
            message: "Recherche des détails de l'utilisateur effectuée.",
            data: mockUser,
        };
    }

    const result = await featuresDi.userManagementController.getUserDetail(user_id);

    if (!result) {
        return { success: false, message: "Utilisateur introuvable.", data: null };
    }

    return {
        success: true,
        message: "Détails récupérés avec succès.",
        data: result as UserDetail,
    };
}

// ─── Création & Mise à jour ────────────────────────────────────────────────────

export async function handleCreateUserAction(
    formData: z.infer<ReturnType<typeof createUserFormSchema>>
): Promise<AppActionResult<UserBasic | null>> {

    const payload: CreateUserPayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        gender: formData.gender === "F" ? GenderEnum.F : GenderEnum.M,
        birth_date: formData.birth_date || undefined,
        nationality: formData.nationality || undefined,
        roles: formData.roles,
    };

    const result = await featuresDi.userManagementController.createUser(payload);

    if (!result) {
        return {
            success: false,
            message: "L'opération de création de compte a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Utilisateur créé avec succès.",
        data: result,
    };
}

export async function handleUpdateUserAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof updateUserFormSchema>>
): Promise<AppActionResult<string | null>> {

    const payload: UpdateUserPayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        telephone: formData.telephone || undefined,
        birth_date: formData.birth_date || undefined,
        address: formData.address || undefined,
        gender: formData.gender || undefined,
        nationality: formData.nationality || undefined,
    };

    const result = await featuresDi.userManagementController.updateUser(user_id, payload);

    if (!result) {
        return {
            success: false,
            message: "L'opération de mise à jour de compte a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Utilisateur mis à jour.",
        data: result,
    };
}

export async function handleUpdateUserEmailAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof updateUserEmailFormSchema>>
): Promise<AppActionResult<string | null>> {

    const result = await featuresDi.userManagementController.updateUserEmail(user_id, formData.email);

    if (!result) {
        return {
            success: false,
            message: "L'opération de mise à jour de l'email a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Email mis à jour.",
        data: result,
    };
}

export async function handleUpdateUserPhoneAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof updateUserPhoneFormSchema>>
): Promise<AppActionResult<string | null>> {

    const result = await featuresDi.userManagementController.updateUserPhone(user_id, formData.phone);

    if (!result) {
        return {
            success: false,
            message: "L'opération de mise à jour du téléphone a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Téléphone mis à jour.",
        data: result,
    };
}

// ─── Activation / Suspension / Suppression ────────────────────────────────────

export async function handleActivateUserAction(user_id: string): Promise<AppActionResult<string | null>> {
    const result = await featuresDi.userManagementController.activateUser(user_id);
    return {
        success: result !== null ? true : false,
        message: "Utilisateur activé.",
        data: result,
    };
}

export async function handleSuspendUserAction(user_id: string): Promise<AppActionResult<string | null>> {
    const result = await featuresDi.userManagementController.suspendUser(user_id);
    return {
        success: result !== null ? true : false,
        message: "Utilisateur suspendu.",
        data: result,
    };
}

export async function handleSoftDeleteUserAction(user_id: string): Promise<AppActionResult<string | null>> {
    const result = await featuresDi.userManagementController.softDeleteUser(user_id);
    return {
        success: result !== null ? true : false,
        message: "Utilisateur supprimé.",
        data: result,
    };
}

export async function handleRestoreUserAction(user_id: string): Promise<AppActionResult<string | null>> {
    const result = await featuresDi.userManagementController.restoreUser(user_id);
    return {
        success: result !== null ? true : false,
        message: "Utilisateur restauré.",
        data: result,
    };
}

// ─── Profils métier ────────────────────────────────────────────────────────────

export async function handleUpdateUserCuisinierProfileAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof updateCuisinierProfileFormSchema>>
): Promise<AppActionResult<string | null>> {

    const payload: UpdateUserCuisinierProfilePayload = {
        poste_principal: formData.poste_principal,
        specialites: formData.specialites?.split(",").map(v => v.trim()).filter(Boolean),
        allergenes_maitrises: formData.allergenes_maitrises?.split(",").map(v => v.trim()).filter(Boolean),
    };

    const result = await featuresDi.userManagementController.updateUserCuisinierProfile(user_id, payload);

    if (!result) {
        return {
            success: false,
            message: "L'opération de mise à jour du profil cuisinier a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Profil cuisinier mis à jour.",
        data: result,
    };
}

export async function handleUpdateUserServeurProfileAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof updateServeurProfileFormSchema>>
): Promise<AppActionResult<string | null>> {

    const payload: UpdateUserServeurProfilePayload = {
        sections_assignees: formData.sections_assignees?.split(",").map(v => v.trim()).filter(Boolean),
        tables_assignees: formData.tables_assignees
            ?.split(",")
            .map(v => v.trim())
            .filter(Boolean)
            .map(Number)
            .filter(n => !isNaN(n)),
        langues_parlees: formData.langues_parlees?.split(",").map(v => v.trim()).filter(Boolean),
    };

    const result = await featuresDi.userManagementController.updateUserServeurProfile(user_id, payload);

    if (!result) {
        return {
            success: false,
            message: "L'opération de mise à jour du profil serveur a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Profil serveur mis à jour.",
        data: result,
    };
}

export async function handleUpdateUserCaissierProfileAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof updateCaissierProfileFormSchema>>
): Promise<AppActionResult<string | null>> {

    const payload: UpdateUserCaissierProfilePayload = {
        pos_terminal_id: formData.pos_terminal_id,
        assigned_cash_register: formData.assigned_cash_register,
    };

    const result = await featuresDi.userManagementController.updateUserCaissierProfile(user_id, payload);

    if (!result) {
        return {
            success: false,
            message: "L'opération de mise à jour du profil caissier a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Profil caissier mis à jour.",
        data: result,
    };
}

export async function handleUpdateUserLivreurProfileAction(user_id: string): Promise<AppActionResult<string | null>> {
    const result = await featuresDi.userManagementController.updateUserLivreurProfile(user_id);
    return {
        success: result !== null ? true : false,
        message: "Profil livreur mis à jour.",
        data: result,
    };
}

export async function handleActivateUserLivreurProfileAction(user_id: string): Promise<AppActionResult<string | null>> {
    const result = await featuresDi.userManagementController.activateUserLivreurProfile(user_id);
    return {
        success: result !== null ? true : false,
        message: "Profil livreur activé.",
        data: result,
    };
}

export async function handleUpdateUserManagerProfileAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof updateManagerProfileFormSchema>>
): Promise<AppActionResult<string | null>> {

    const payload: UpdateUserManagerProfilePayload = {
        notes: formData.notes,
        responsabilites: formData.responsabilites?.split(",").map(v => v.trim()).filter(Boolean),
    };

    const result = await featuresDi.userManagementController.updateUserManagerProfile(user_id, payload);

    if (!result) {
        return {
            success: false,
            message: "L'opération de mise à jour du profil manager a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Profil manager mis à jour.",
        data: result,
    };
}

// ─── Rôles & Permissions ───────────────────────────────────────────────────────

export async function handleAssignUserRolesAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof assignRolesFormSchema>>
): Promise<AppActionResult<string | null>> {

    const result = await featuresDi.userManagementController.assignUserRoles(
        user_id,
        formData.role as UserRoleCodeEnum
    );

    if (!result) {
        return {
            success: false,
            message: "L'opération d'assignation des rôles a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Rôle assigné.",
        data: result,
    };
}

export async function handleRevokeUserRolesAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof assignRolesFormSchema>>
): Promise<AppActionResult<string | null>> {

    const result = await featuresDi.userManagementController.revokeUserRoles(
        user_id,
        formData.role as UserRoleCodeEnum
    );

    if (!result) {
        return {
            success: false,
            message: "L'opération de révocation des rôles a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Rôle révoqué.",
        data: result,
    };
}

export async function handleGrantUserPermissionsAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof userPermissionsFormSchema>>
): Promise<AppActionResult<string | null>> {

    const result = await featuresDi.userManagementController.grantUserPermissions(user_id, formData.permission);

    if (!result) {
        return {
            success: false,
            message: "L'opération d'attribution des permissions a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Permission accordée.",
        data: result,
    };
}

export async function handleRevokeUserPermissionsAction(
    user_id: string,
    formData: z.infer<ReturnType<typeof userPermissionsFormSchema>>
): Promise<AppActionResult<string | null>> {

    const result = await featuresDi.userManagementController.revokeUserPermissions(user_id, formData.permission);

    if (!result) {
        return {
            success: false,
            message: "L'opération de révocation des permissions a échoué.",
            data: null,
        };
    }

    return {
        success: result !== null ? true : false,
        message: "Permission révoquée.",
        data: result,
    };
}
