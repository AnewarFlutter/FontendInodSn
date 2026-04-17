// Controller pour la feature session

import { LoginUseCase } from "@/modules/auth/session/domain/usecases/login_use_case";
import { LogoutUseCase } from "@/modules/auth/session/domain/usecases/logout_use_case";
import { RefreshTokenUseCase } from "@/modules/auth/session/domain/usecases/refresh_token_use_case";
import { SwitchContextUseCase } from "@/modules/auth/session/domain/usecases/switch_context_use_case";
import { LoginPayload } from "@/modules/auth/session/domain/types/login_payload";
import { LoginResponseData } from "@/modules/auth/types/login_response_data_types";
import { TokenPair } from "@/modules/auth/types/token_pair_types";
import { LoginUserWrapper } from "@/modules/auth/types/login_user_wrapper_types";
import { UserProfileData } from "@/modules/auth/types/user_profile_data_types";
import { CurrentRole } from "@/modules/auth/types/current_role_types";
import { RolePermissions } from "@/modules/auth/types/role_permissions_types";
import { SwitchContextPayload } from "@/modules/auth/session/domain/types/switch_context_payload";

/**
 * This class is an adapter for the session feature.
 * It acts as an interface between the application and the session feature.
 */
export class SessionController {
    constructor(
            private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly switchContextUseCase: SwitchContextUseCase
    ) { }


    /**
     * Authentification d'un utilisateur avec email ou téléphone et contexte de rôle.
     */
    login = async (payload: LoginPayload): Promise<LoginResponseData | null> => {
        try {
            const res = await this.loginUseCase.execute(payload);
            return res;
        } catch (e) {
            console.log(`Error while executing login: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Déconnexion et révocation des tokens. Option pour révoquer toutes les sessions actives..
     */
    logout = async (refresh_token: string, logout_all?: boolean): Promise<string | null> => {
        try {
            const res = await this.logoutUseCase.execute(refresh_token, logout_all);
            return res;
        } catch (e) {
            console.log(`Error while executing logout: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Rafraîchissement du token d'accès. Rotation des tokens : l'ancien refresh_token est révoqué et un nouveau émis..
     */
    refreshToken = async (refresh_token: string): Promise<TokenPair | null> => {
        try {
            const res = await this.refreshTokenUseCase.execute(refresh_token);
            return res;
        } catch (e) {
            console.log(`Error while executing refreshToken: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Change le contexte (rôle) de l'utilisateur connecté. Retourne de nouveaux tokens avec le contexte mis à jour..
     */
    switchContext = async (payload: SwitchContextPayload): Promise<LoginResponseData | null> => {
        try {
            const res = await this.switchContextUseCase.execute(payload);
            return res;
        } catch (e) {
            console.log(`Error while executing switchContext: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }
}
