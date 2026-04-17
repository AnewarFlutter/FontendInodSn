import { LoginPayload } from "@/modules/auth/session/domain/types/login_payload";
import { LoginResponseData } from "@/modules/auth/types/login_response_data_types";
import { TokenPair } from "@/modules/auth/types/token_pair_types";
import { LoginUserWrapper } from "@/modules/auth/types/login_user_wrapper_types";
import { UserProfileData } from "@/modules/auth/types/user_profile_data_types";
import { CurrentRole } from "@/modules/auth/types/current_role_types";
import { RolePermissions } from "@/modules/auth/types/role_permissions_types";
import { SwitchContextPayload } from "@/modules/auth/session/domain/types/switch_context_payload";

/**
 * SessionRepository – Contrat de persistance pour l'entité Session
 * 
 * **Rôle** : Interface abstraite utilisée par les UseCases.
 * 
 * **Implémentations** :
 * - `SessionRepositoryImpl` (couche data)
 * - Mock pour tests
 * 
 * **Généré automatiquement** à partir des UseCases du module **auth**.
 * 
 * @example
 * const repo: SessionRepository = container.get(SessionRepository);
 * const user = await repo.getUserById("123");
 */
export interface SessionRepository {
    /**
    * Authentification d'un utilisateur avec email ou téléphone et contexte de rôle
    *
   * @param payload 
   * @returns Tokens d'accès et informations de l'utilisateur connecté
    */
    login(payload: LoginPayload): Promise<LoginResponseData | null>;

  /**
    * Déconnexion et révocation des tokens. Option pour révoquer toutes les sessions actives.
    *
   * @param refresh_token 
   * @param logout_all 
   * @returns Confirmation de déconnexion
    */
    logout(refresh_token: string, logout_all?: boolean): Promise<string | null>;

  /**
    * Rafraîchissement du token d'accès. Rotation des tokens : l'ancien refresh_token est révoqué et un nouveau émis.
    *
   * @param refresh_token 
   * @returns Nouveau pair de tokens (access + refresh)
    */
    refreshToken(refresh_token: string): Promise<TokenPair | null>;

  /**
    * Change le contexte (rôle) de l'utilisateur connecté. Retourne de nouveaux tokens avec le contexte mis à jour.
    *
   * @param payload 
   * @returns Réponse complète avec nouveaux tokens et profil utilisateur mis à jour (même structure que login)
    */
    switchContext(payload: SwitchContextPayload): Promise<LoginResponseData | null>;
}
