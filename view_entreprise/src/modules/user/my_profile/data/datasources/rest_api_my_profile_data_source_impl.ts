import { apiClient } from "@/lib/api/api_client";
import { ApiError, BadRequestError, UnauthorizedError } from "@/lib/api/api_errors";
import { formatApiRoute } from "@/lib/api/format_api_route";
import { UpdateMyProfilePayload } from "@/modules/user/my_profile/domain/types/update_my_profile_payload";
import { UserDetail } from "@/modules/user/types/user_detail_types";
import { API_ROUTES } from "@/shared/constants/api_routes";
import { USER_GET_MY_PERMISSIONS_RESPONSE_200, USER_GET_MY_PERMISSIONS_RESPONSE_401, USER_GET_MY_PROFILE_RESPONSE_200, USER_GET_MY_PROFILE_RESPONSE_401, USER_GET_MY_ROLES_RESPONSE_200, USER_GET_MY_ROLES_RESPONSE_401, USER_UPDATE_MY_PROFILE_RESPONSE_200, USER_UPDATE_MY_PROFILE_RESPONSE_400, USER_UPDATE_MY_PROFILE_RESPONSE_401, USER_UPLOAD_MY_AVATAR_RESPONSE_200, USER_UPLOAD_MY_AVATAR_RESPONSE_400, USER_UPDATE_MY_PHONE_RESPONSE_200, USER_UPDATE_MY_PHONE_RESPONSE_400, USER_UPDATE_MY_PHONE_RESPONSE_404, AUTH_CHANGE_PASSWORD_RESPONSE_200, AUTH_CHANGE_PASSWORD_RESPONSE_400, AUTH_CHANGE_PASSWORD_RESPONSE_401 } from "@/shared/constants/api_types";
import { MyProfileDataSource } from "./my_profile_data_source";

/**
 * Implémentation REST du datasource pour my_profile.
 * Toutes les méthodes sont à implémenter.
 */
export class RestApiMyProfileDataSourceImpl implements MyProfileDataSource {

    /**
     * Récupère le profil complet de l'administrateur connecté (infos personnelles + profils métier + rôles)
     */
    async getMyProfile(): Promise<UserDetail | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GET_MY_PROFILE.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GET_MY_PROFILE_RESPONSE_200>(route, {
                method: "GET",


            });

            if (error) {
                switch (status) {
                    case 401: throw new UnauthorizedError(error as USER_GET_MY_PROFILE_RESPONSE_401, "Token manquant ou invalide");
                    case 404: return null;
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GET_MY_PROFILE_RESPONSE_200;

            console.log("Response after cast:", typedData);

            // Remap des champs API → UserDetail (photo → avatar, status_activation → is_active)
            return {
                ...typedData,
                auth_user_id: typedData.id,
                avatar: typedData.photo ?? null,
                is_active: typedData.status_activation === "ACTIVE",
                roles: [],
            } as unknown as UserDetail;
        } catch (err) {
            console.error("Unexpected error in getMyProfile:", err);
            throw err;
        }
    }

    /**
     * Met à jour le profil personnel de l'administrateur connecté
     */
    async updateMyProfile(payload: UpdateMyProfilePayload): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_MY_PROFILE.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_MY_PROFILE_RESPONSE_200>(route, {
                method: "PATCH",
                body: {
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    birth_date: payload.birth_date,
                    gender: payload.gender,
                    address: payload.address,
                    nationality: payload.nationality,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_UPDATE_MY_PROFILE_RESPONSE_400, "Données invalides (champ manquant ou format incorrect)");
                    case 401: throw new UnauthorizedError(error as USER_UPDATE_MY_PROFILE_RESPONSE_401, "Token manquant ou invalide");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPDATE_MY_PROFILE_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in updateMyProfile:", err);
            throw err;
        }
    }

    /**
     * Récupère les rôles actifs de l'administrateur connecté
     */
    async getMyRoles(): Promise<object[] | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GET_MY_ROLES.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GET_MY_ROLES_RESPONSE_200>(route, {
                method: "GET",


            });

            if (error) {
                switch (status) {
                    case 401: throw new UnauthorizedError(error as USER_GET_MY_ROLES_RESPONSE_401, "Token manquant ou invalide");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GET_MY_ROLES_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as object[] | null;
        } catch (err) {
            console.error("Unexpected error in getMyRoles:", err);
            throw err;
        }
    }

    /**
     * Récupère les permissions effectives de l'administrateur connecté (rôles + permissions individuelles)
     */
    async getMyPermissions(): Promise<string[] | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GET_MY_PERMISSIONS.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GET_MY_PERMISSIONS_RESPONSE_200>(route, {
                method: "GET",


            });

            if (error) {
                switch (status) {
                    case 401: throw new UnauthorizedError(error as USER_GET_MY_PERMISSIONS_RESPONSE_401, "Token manquant ou invalide");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GET_MY_PERMISSIONS_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string[] | null;
        } catch (err) {
            console.error("Unexpected error in getMyPermissions:", err);
            throw err;
        }
    }

    /**
     * Upload de la photo de profil de l'administrateur connecté (multipart/form-data). Le File est passé directement à travers la Server Action — Next.js sérialise les File nativement.
     */
    async uploadMyAvatar(photo: File): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPLOAD_MY_AVATAR.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPLOAD_MY_AVATAR_RESPONSE_200>(route, {
                method: "POST",
                isMultipart: true, // envoi en multipart/form-data, requis pour les fichiers
                body: {
                    avatar: photo,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_UPLOAD_MY_AVATAR_RESPONSE_400, "Format de fichier invalide ou taille dépassée");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_UPLOAD_MY_AVATAR_RESPONSE_200;

            console.log("Response after cast:", typedData);

            // Retourne l'URL de la photo uploadée
            return typedData.photo ?? null;
        } catch (err) {
            console.error("Unexpected error in uploadMyAvatar:", err);
            throw err;
        }
    }

    /**
     * Modifier son propre numéro de téléphone (via l'endpoint admin avec l'ID du user connecté)
     */
    async updateMyPhone(user_id: string, new_phone: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.UPDATE_MY_PHONE.path, { user_id }, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_UPDATE_MY_PHONE_RESPONSE_200>(route, {
                method: "PATCH",
                body: { new_phone },
            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as USER_UPDATE_MY_PHONE_RESPONSE_400, "Numéro de téléphone invalide ou déjà utilisé");
                    case 404: throw new BadRequestError(error as USER_UPDATE_MY_PHONE_RESPONSE_404, "Utilisateur non trouvé");
                    default: throw new ApiError(status, error);
                }
            }

            const typedData = data as USER_UPDATE_MY_PHONE_RESPONSE_200;
            return typedData.message ?? null;
        } catch (err) {
            console.error("Unexpected error in updateMyPhone:", err);
            throw err;
        }
    }

    /**
     * Changer le mot de passe de l'utilisateur connecté
     */
    async changePassword(old_password: string, new_password: string): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.AUTH.CHANGE_PASSWORD.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<AUTH_CHANGE_PASSWORD_RESPONSE_200>(route, {
                method: "POST",
                body: { old_password, new_password },
            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as AUTH_CHANGE_PASSWORD_RESPONSE_400, "Ancien mot de passe incorrect ou nouveau mot de passe invalide");
                    case 401: throw new UnauthorizedError(error as AUTH_CHANGE_PASSWORD_RESPONSE_401, "Token manquant ou invalide");
                    default: throw new ApiError(status, error);
                }
            }

            const typedData = data as AUTH_CHANGE_PASSWORD_RESPONSE_200;
            return typedData.message ?? null;
        } catch (err) {
            console.error("Unexpected error in changePassword:", err);
            throw err;
        }
    }
}
