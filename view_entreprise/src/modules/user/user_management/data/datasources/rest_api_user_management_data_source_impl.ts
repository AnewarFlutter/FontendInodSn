import { apiClient } from "@/lib/api/api_client";
import { ApiError, BadRequestError, ForbiddenError, InternalServerError, UnauthorizedError } from "@/lib/api/api_errors";
import { formatApiRoute } from "@/lib/api/format_api_route";
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum";
import { PaginatedUsers } from "@/modules/user/types/paginated_users_types";
import { UserBasic } from "@/modules/user/types/user_basic_types";
import { UserDetail } from "@/modules/user/types/user_detail_types";
import { CreateUserPayload } from "@/modules/user/user_management/domain/types/create_user_payload";
import { UpdateUserCaissierProfilePayload } from "@/modules/user/user_management/domain/types/update_user_caissier_profile_payload";
import { UpdateUserCuisinierProfilePayload } from "@/modules/user/user_management/domain/types/update_user_cuisinier_profile_payload";
import { UpdateUserManagerProfilePayload } from "@/modules/user/user_management/domain/types/update_user_manager_profile_payload";
import { UpdateUserPayload } from "@/modules/user/user_management/domain/types/update_user_payload";
import { UpdateUserServeurProfilePayload } from "@/modules/user/user_management/domain/types/update_user_serveur_profile_payload";
import { API_ROUTES } from "@/shared/constants/api_routes";
import { USER_ACTIVATE_USER_LIVREUR_PROFILE_RESPONSE_200, USER_ACTIVATE_USER_LIVREUR_PROFILE_RESPONSE_400, USER_ACTIVATE_USER_RESPONSE_200, USER_ACTIVATE_USER_RESPONSE_400, USER_ASSIGN_USER_ROLES_RESPONSE_200, USER_ASSIGN_USER_ROLES_RESPONSE_400, USER_ASSIGN_USER_ROLES_RESPONSE_403, USER_CREATE_USER_RESPONSE_200, USER_CREATE_USER_RESPONSE_400, USER_CREATE_USER_RESPONSE_403, USER_CREATE_USER_RESPONSE_500, USER_GET_USER_DETAIL_RESPONSE_200, USER_GET_USER_DETAIL_RESPONSE_403, USER_GET_USERS_LIST_RESPONSE_200, USER_GET_USERS_LIST_RESPONSE_401, USER_GET_USERS_LIST_RESPONSE_403, USER_GRANT_USER_PERMISSIONS_RESPONSE_200, USER_GRANT_USER_PERMISSIONS_RESPONSE_400, USER_GRANT_USER_PERMISSIONS_RESPONSE_403, USER_RESTORE_USER_RESPONSE_200, USER_RESTORE_USER_RESPONSE_400, USER_REVOKE_USER_PERMISSIONS_RESPONSE_200, USER_REVOKE_USER_PERMISSIONS_RESPONSE_400, USER_REVOKE_USER_PERMISSIONS_RESPONSE_403, USER_REVOKE_USER_ROLES_RESPONSE_200, USER_REVOKE_USER_ROLES_RESPONSE_400, USER_SOFT_DELETE_USER_RESPONSE_200, USER_SUSPEND_USER_RESPONSE_200, USER_SUSPEND_USER_RESPONSE_400, USER_SUSPEND_USER_RESPONSE_403, USER_UPDATE_USER_CAISSIER_PROFILE_RESPONSE_200, USER_UPDATE_USER_CUISINIER_PROFILE_RESPONSE_200, USER_UPDATE_USER_EMAIL_RESPONSE_200, USER_UPDATE_USER_EMAIL_RESPONSE_400, USER_UPDATE_USER_LIVREUR_PROFILE_RESPONSE_200, USER_UPDATE_USER_MANAGER_PROFILE_RESPONSE_200, USER_UPDATE_USER_PHONE_RESPONSE_200, USER_UPDATE_USER_PHONE_RESPONSE_400, USER_UPDATE_USER_RESPONSE_200, USER_UPDATE_USER_RESPONSE_400, USER_UPDATE_USER_SERVEUR_PROFILE_RESPONSE_200 } from "@/shared/constants/api_types";
import { UserManagementDataSource } from "./user_management_data_source";

/**
 * Implémentation REST du datasource pour user_management.
 * Toutes les méthodes sont à implémenter.
 */
export class RestApiUserManagementDataSourceImpl implements UserManagementDataSource {

    /**
     * Liste tous les utilisateurs. Permission: user.view_all
     */
    async getUsersList(page?: number, page_size?: number, search?: string): Promise<PaginatedUsers | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GET_USERS_LIST.path, undefined, { page, page_size, search });
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GET_USERS_LIST_RESPONSE_200>(route, {
                method: "GET",


            });

            if (error) {
                switch (status) {
                    case 401: throw new UnauthorizedError(error as USER_GET_USERS_LIST_RESPONSE_401);
                    case 403: throw new ForbiddenError(error as USER_GET_USERS_LIST_RESPONSE_403, "Permission insuffisante");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GET_USERS_LIST_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as PaginatedUsers | null;
        } catch (err) {
            console.error("Unexpected error in getUsersList:", err);
            throw err;
        }
    }

    /**
     * Crée un utilisateur via le Saga Pattern Auth+User. Permission: user.create
     */
    async createUser(payload: CreateUserPayload): Promise<UserBasic | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.CREATE_USER.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_CREATE_USER_RESPONSE_200>(route, {
                method: "POST",
                body: {
                    email: payload.email,
                    phone: payload.phone,
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    gender: payload.gender,
                    roles: payload.roles,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_CREATE_USER_RESPONSE_400, "Données invalides (champs manquants ou email déjà utilisé)");
                    case 403: throw new ForbiddenError(error as USER_CREATE_USER_RESPONSE_403, "Permission insuffisante");
                    case 500: throw new InternalServerError(error as USER_CREATE_USER_RESPONSE_500, "Saga Pattern échoué — rollback automatique effectué");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_CREATE_USER_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as UserBasic | null;
        } catch (err) {
            console.error("Unexpected error in createUser:", err);
            throw err;
        }
    }

    /**
     * Récupère les détails complets d'un utilisateur. Permission: user.view_all
     */
    async getUserDetail(user_id: string): Promise<UserDetail | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GET_USER_DETAIL.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GET_USER_DETAIL_RESPONSE_200>(route, {
                method: "GET",


            });

            if (error) {
                switch (status) {
                    case 403: throw new ForbiddenError(error as USER_GET_USER_DETAIL_RESPONSE_403, "Permission insuffisante");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GET_USER_DETAIL_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as UserDetail | null;
        } catch (err) {
            console.error("Unexpected error in getUserDetail:", err);
            throw err;
        }
    }

    /**
     * Modifie les informations d'un utilisateur. Permission: user.update
     */
    async updateUser(user_id: string, payload: UpdateUserPayload): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_USER.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_USER_RESPONSE_200>(route, {
                method: "PATCH",
                body: {
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    telephone: payload.telephone,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_UPDATE_USER_RESPONSE_400, "Données invalides (champ manquant ou format incorrect)");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPDATE_USER_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in updateUser:", err);
            throw err;
        }
    }

    /**
     * Modifie l'email d'un utilisateur (synchronise avec Auth Service). Permission: user.update
     */
    async updateUserEmail(user_id: string, new_email: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_USER_EMAIL.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_USER_EMAIL_RESPONSE_200>(route, {
                method: "PATCH",
                body: {
                    new_email: new_email,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_UPDATE_USER_EMAIL_RESPONSE_400, "Email invalide ou déjà utilisé");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPDATE_USER_EMAIL_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in updateUserEmail:", err);
            throw err;
        }
    }

    /**
     * Modifie le téléphone d'un utilisateur (synchronise avec Auth Service). Permission: user.update
     */
    async updateUserPhone(user_id: string, new_phone: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_USER_PHONE.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_USER_PHONE_RESPONSE_200>(route, {
                method: "PATCH",
                body: {
                    new_phone: new_phone,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_UPDATE_USER_PHONE_RESPONSE_400, "Numéro de téléphone invalide ou déjà utilisé");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPDATE_USER_PHONE_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in updateUserPhone:", err);
            throw err;
        }
    }

    /**
     * Suspend un utilisateur. Permission: user.deactivate
     */
    async suspendUser(user_id: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.SUSPEND_USER.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_SUSPEND_USER_RESPONSE_200>(route, {
                method: "POST",


            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_SUSPEND_USER_RESPONSE_400, "Utilisateur déjà suspendu");
                    case 403: throw new ForbiddenError(error as USER_SUSPEND_USER_RESPONSE_403, "Permission insuffisante pour suspendre un utilisateur");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_SUSPEND_USER_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in suspendUser:", err);
            throw err;
        }
    }

    /**
     * Active un utilisateur suspendu. Permission: user.activate
     */
    async activateUser(user_id: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.ACTIVATE_USER.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_ACTIVATE_USER_RESPONSE_200>(route, {
                method: "POST",


            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_ACTIVATE_USER_RESPONSE_400, "Utilisateur déjà actif");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_ACTIVATE_USER_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in activateUser:", err);
            throw err;
        }
    }

    /**
     * Soft delete d'un utilisateur (restaurable). Permission: user.delete
     */
    async softDeleteUser(user_id: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.SOFT_DELETE_USER.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_SOFT_DELETE_USER_RESPONSE_200>(route, {
                method: "DELETE",


            });

            if (error) {
                switch (status) {
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_SOFT_DELETE_USER_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in softDeleteUser:", err);
            throw err;
        }
    }

    /**
     * Restaure un utilisateur soft-deleted. Permission: user.restore
     */
    async restoreUser(user_id: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.RESTORE_USER.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_RESTORE_USER_RESPONSE_200>(route, {
                method: "POST",


            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_RESTORE_USER_RESPONSE_400, "Le compte n'est pas en état supprimé");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_RESTORE_USER_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in restoreUser:", err);
            throw err;
        }
    }

    /**
     * Modifie le profil cuisinier d'un utilisateur. Permission: user.update
     */
    async updateUserCuisinierProfile(user_id: string, payload: UpdateUserCuisinierProfilePayload): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_USER_CUISINIER_PROFILE.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_USER_CUISINIER_PROFILE_RESPONSE_200>(route, {
                method: "PATCH",
                body: {
                    specialites: payload.specialites,
                    poste_principal: payload.poste_principal,
                    allergenes_maitrises: payload.allergenes_maitrises,
                },

            });

            if (error) {
                switch (status) {
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPDATE_USER_CUISINIER_PROFILE_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in updateUserCuisinierProfile:", err);
            throw err;
        }
    }

    /**
     * Modifie le profil serveur d'un utilisateur. Permission: user.update
     */
    async updateUserServeurProfile(user_id: string, payload: UpdateUserServeurProfilePayload): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_USER_SERVEUR_PROFILE.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_USER_SERVEUR_PROFILE_RESPONSE_200>(route, {
                method: "PATCH",
                body: {
                    sections_assignees: payload.sections_assignees,
                    tables_assignees: payload.tables_assignees,
                    langues_parlees: payload.langues_parlees,
                },

            });

            if (error) {
                switch (status) {
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPDATE_USER_SERVEUR_PROFILE_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in updateUserServeurProfile:", err);
            throw err;
        }
    }

    /**
     * Modifie le profil caissier d'un utilisateur. Permission: user.update
     */
    async updateUserCaissierProfile(user_id: string, payload: UpdateUserCaissierProfilePayload): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_USER_CAISSIER_PROFILE.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_USER_CAISSIER_PROFILE_RESPONSE_200>(route, {
                method: "PATCH",
                body: {
                    pos_terminal_id: payload.pos_terminal_id,
                    assigned_cash_register: payload.assigned_cash_register,
                },

            });

            if (error) {
                switch (status) {
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPDATE_USER_CAISSIER_PROFILE_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in updateUserCaissierProfile:", err);
            throw err;
        }
    }

    /**
     * Modifie le profil livreur d'un utilisateur. Permission: user.update
     */
    async updateUserLivreurProfile(user_id: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_USER_LIVREUR_PROFILE.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_USER_LIVREUR_PROFILE_RESPONSE_200>(route, {
                method: "PATCH",


            });

            if (error) {
                switch (status) {
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPDATE_USER_LIVREUR_PROFILE_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in updateUserLivreurProfile:", err);
            throw err;
        }
    }

    /**
     * Active le profil livreur d'un utilisateur. Permission: user.update
     */
    async activateUserLivreurProfile(user_id: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.ACTIVATE_USER_LIVREUR_PROFILE.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_ACTIVATE_USER_LIVREUR_PROFILE_RESPONSE_200>(route, {
                method: "POST",


            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_ACTIVATE_USER_LIVREUR_PROFILE_RESPONSE_400, "Champs obligatoires manquants");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_ACTIVATE_USER_LIVREUR_PROFILE_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in activateUserLivreurProfile:", err);
            throw err;
        }
    }

    /**
     * Modifie le profil manager d'un utilisateur (ADMIN uniquement). Permission: user.update
     */
    async updateUserManagerProfile(user_id: string, payload: UpdateUserManagerProfilePayload): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_USER_MANAGER_PROFILE.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_USER_MANAGER_PROFILE_RESPONSE_200>(route, {
                method: "PATCH",
                body: {
                    notes: payload.notes,
                    responsabilites: payload.responsabilites,
                },

            });

            if (error) {
                switch (status) {
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPDATE_USER_MANAGER_PROFILE_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in updateUserManagerProfile:", err);
            throw err;
        }
    }

    /**
     * Assigne des rôles à un utilisateur. Permission: role.assign
     */
    async assignUserRoles(user_id: string, roles: UserRoleCodeEnum[]): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.ASSIGN_USER_ROLES.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_ASSIGN_USER_ROLES_RESPONSE_200>(route, {
                method: "POST",
                body: {
                    roles: roles,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_ASSIGN_USER_ROLES_RESPONSE_400, "Rôle invalide ou déjà assigné à cet utilisateur");
                    case 403: throw new ForbiddenError(error as USER_ASSIGN_USER_ROLES_RESPONSE_403, "Permission insuffisante pour assigner des rôles");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_ASSIGN_USER_ROLES_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in assignUserRoles:", err);
            throw err;
        }
    }

    /**
     * Révoque des rôles d'un utilisateur. Permission: role.revoke
     */
    async revokeUserRoles(user_id: string, roles: UserRoleCodeEnum[]): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.REVOKE_USER_ROLES.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_REVOKE_USER_ROLES_RESPONSE_200>(route, {
                method: "POST",
                body: {
                    roles: roles,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_REVOKE_USER_ROLES_RESPONSE_400, "Rôle invalide ou non assigné à cet utilisateur");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_REVOKE_USER_ROLES_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in revokeUserRoles:", err);
            throw err;
        }
    }

    /**
     * Accorde des permissions individuelles à un utilisateur. Permission: permission.grant
     */
    async grantUserPermissions(user_id: string, permissions: string[]): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GRANT_USER_PERMISSIONS.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GRANT_USER_PERMISSIONS_RESPONSE_200>(route, {
                method: "POST",
                body: {
                    permissions: permissions,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_GRANT_USER_PERMISSIONS_RESPONSE_400, "Permission invalide ou déjà accordée à cet utilisateur");
                    case 403: throw new ForbiddenError(error as USER_GRANT_USER_PERMISSIONS_RESPONSE_403, "Permission insuffisante pour accorder des permissions");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GRANT_USER_PERMISSIONS_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in grantUserPermissions:", err);
            throw err;
        }
    }

    /**
     * Révoque des permissions individuelles d'un utilisateur. Permission: permission.revoke
     */
    async revokeUserPermissions(user_id: string, permissions: string[]): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.REVOKE_USER_PERMISSIONS.path, { user_id: user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_REVOKE_USER_PERMISSIONS_RESPONSE_200>(route, {
                method: "POST",
                body: {
                    permissions: permissions,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_REVOKE_USER_PERMISSIONS_RESPONSE_400, "Permission invalide ou non accordée à cet utilisateur");
                    case 403: throw new ForbiddenError(error as USER_REVOKE_USER_PERMISSIONS_RESPONSE_403, "Permission insuffisante pour révoquer des permissions");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_REVOKE_USER_PERMISSIONS_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in revokeUserPermissions:", err);
            throw err;
        }
    }
}
