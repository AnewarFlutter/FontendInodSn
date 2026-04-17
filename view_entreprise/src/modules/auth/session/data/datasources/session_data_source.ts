import { LoginPayload } from "@/modules/auth/session/domain/types/login_payload";
import { SwitchContextPayload } from "@/modules/auth/session/domain/types/switch_context_payload";
import { LoginResponseData } from "@/modules/auth/types/login_response_data_types";
import { TokenPair } from "@/modules/auth/types/token_pair_types";

/**
 * SessionDataSource – Contrat d'accès aux données brutes pour l'entité Session
 *
 * **Rôle** : Interface abstraite utilisée par le RepositoryImpl pour accéder aux données.
 *
 * **Implémentations** :
 * - `RestApiSessionDataSourceImpl`
 * - `FirebaseSessionDataSourceImpl`
 * - Mock pour tests
 *
 * **Généré automatiquement** à partir des UseCases du module **auth**.
 *
 * **Attention** : Utilise **ModelSession**, pas l'entité métier.
 *
 * @example
 * const ds: SessionDataSource = new RestApiSessionDataSourceImpl();
 * const model = await ds.getUserById("123");
 */
export interface SessionDataSource {
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
     * @param access_token Token d'accès Bearer requis par l'API
     * @returns Confirmation de déconnexion
      */
    logout(refresh_token: string, logout_all?: boolean, access_token?: string): Promise<string | null>;

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
     * @param access_token Token d'accès Bearer requis par l'API
     * @returns Réponse complète avec nouveaux tokens et profil utilisateur mis à jour (même structure que login)
      */
    switchContext(payload: SwitchContextPayload, access_token?: string): Promise<LoginResponseData | null>;
}
