import { apiClient } from "@/lib/api/api_client";
import { ApiError, BadRequestError, ForbiddenError, UnauthorizedError } from "@/lib/api/api_errors";
import { formatApiRoute } from "@/lib/api/format_api_route";
import { LoginPayload } from "@/modules/auth/session/domain/types/login_payload";
import { SwitchContextPayload } from "@/modules/auth/session/domain/types/switch_context_payload";
import { LoginResponseData } from "@/modules/auth/types/login_response_data_types";
import { TokenPair } from "@/modules/auth/types/token_pair_types";
import { API_ROUTES } from "@/shared/constants/api_routes";
import { AUTH_LOGIN_RESPONSE_200, AUTH_LOGIN_RESPONSE_400, AUTH_LOGIN_RESPONSE_401, AUTH_LOGIN_RESPONSE_403, AUTH_LOGOUT_RESPONSE_200, AUTH_LOGOUT_RESPONSE_400, AUTH_LOGOUT_RESPONSE_401, AUTH_REFRESH_TOKEN_RESPONSE_200, AUTH_REFRESH_TOKEN_RESPONSE_400, AUTH_SWITCH_CONTEXT_RESPONSE_200, AUTH_SWITCH_CONTEXT_RESPONSE_400, AUTH_SWITCH_CONTEXT_RESPONSE_401 } from "@/shared/constants/api_types";
import { SessionDataSource } from "./session_data_source";

// Base URL de l'API Auth — disponible côté serveur et client
const AUTH_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api/v1/auth";

/**
 * Implémentation REST du datasource pour session.
 * Effectue les appels HTTP vers l'API Auth via apiClient.
 */
export class RestApiSessionDataSourceImpl implements SessionDataSource {

    /**
     * Authentification d'un utilisateur avec email ou téléphone et contexte de rôle
     */
    async login(payload: LoginPayload): Promise<LoginResponseData | null> {
        try {
            const route = formatApiRoute(API_ROUTES.AUTH.LOGIN.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<AUTH_LOGIN_RESPONSE_200>(route, {
                method: "POST",
                body: {
                    identifier_type: payload.identifier_type,
                    identifier: payload.identifier,
                    password: payload.password,
                    context: payload.context,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as AUTH_LOGIN_RESPONSE_400, "Erreur de validation DRF (champs manquants/invalides) ou échec logique métier (identifiants incorrects, compte verrouillé)");
                    case 401: throw new UnauthorizedError(error as AUTH_LOGIN_RESPONSE_401, "Identifiants incorrects — réponse réelle observée avec remaining_attempts");
                    case 403: throw new ForbiddenError(error as AUTH_LOGIN_RESPONSE_403, "Compte inactif, non approuvé, ou contexte de rôle non autorisé");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as AUTH_LOGIN_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as LoginResponseData | null;
        } catch (err) {
            console.error("Unexpected error in login:", err);
            throw err;
        }
    }

    /**
     * Déconnexion et révocation des tokens. Option pour révoquer toutes les sessions actives.
     */
    async logout(refresh_token: string, logout_all?: boolean): Promise<string | null> {
        try {
            const route = formatApiRoute(API_ROUTES.AUTH.LOGOUT.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<AUTH_LOGOUT_RESPONSE_200>(route, {
                method: "POST",
                body: {
                    refresh_token: refresh_token,
                    logout_all: logout_all,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as AUTH_LOGOUT_RESPONSE_400, "Token invalide, malformé ou déjà révoqué");
                    case 401: throw new UnauthorizedError(error as AUTH_LOGOUT_RESPONSE_401, "Token d'accès manquant ou invalide dans le header Authorization");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as AUTH_LOGOUT_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as string | null;
        } catch (err) {
            console.error("Unexpected error in logout:", err);
            throw err;
        }
    }

    /**
     * Rafraîchissement du token d'accès. Rotation des tokens : l'ancien refresh_token est révoqué et un nouveau émis.
     */
    async refreshToken(refresh_token: string): Promise<TokenPair | null> {
        try {
            const route = formatApiRoute(API_ROUTES.AUTH.REFRESH_TOKEN.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<AUTH_REFRESH_TOKEN_RESPONSE_200>(route, {
                method: "POST",
                body: {
                    refresh_token: refresh_token,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as AUTH_REFRESH_TOKEN_RESPONSE_400, "Refresh token expiré, révoqué ou invalide");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as AUTH_REFRESH_TOKEN_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as TokenPair | null;
        } catch (err) {
            console.error("Unexpected error in refreshToken:", err);
            throw err;
        }
    }

    /**
     * Change le contexte (rôle) de l'utilisateur connecté. Retourne de nouveaux tokens avec le contexte mis à jour.
     */
    async switchContext(payload: SwitchContextPayload): Promise<LoginResponseData | null> {
        try {
            const route = formatApiRoute(API_ROUTES.AUTH.SWITCH_CONTEXT.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<AUTH_SWITCH_CONTEXT_RESPONSE_200>(route, {
                method: "POST",
                body: {
                    context: payload.context,
                },

            });

            if (error) {
                switch (status) {
                    case 400: throw new BadRequestError(error as AUTH_SWITCH_CONTEXT_RESPONSE_400, "Contexte non autorisé pour cet utilisateur, ou erreur de validation DRF");
                    case 401: throw new UnauthorizedError(error as AUTH_SWITCH_CONTEXT_RESPONSE_401, "Token manquant, expiré ou invalide");
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as AUTH_SWITCH_CONTEXT_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as LoginResponseData | null;
        } catch (err) {
            console.error("Unexpected error in switchContext:", err);
            throw err;
        }
    }
}
