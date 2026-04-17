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

/**
 * UserManagementDataSource – Contrat d'accès aux données brutes pour l'entité UserManagement
 * 
 * **Rôle** : Interface abstraite utilisée par le RepositoryImpl pour accéder aux données.
 * 
 * **Implémentations** :
 * - `RestApiUserManagementDataSourceImpl`
 * - `FirebaseUserManagementDataSourceImpl`
 * - Mock pour tests
 * 
 * **Généré automatiquement** à partir des UseCases du module **user**.
 * 
 * **Attention** : Utilise **ModelUserManagement**, pas l'entité métier.
 * 
 * @example
 * const ds: UserManagementDataSource = new RestApiUserManagementDataSourceImpl();
 * const model = await ds.getUserById("123");
 */
export interface UserManagementDataSource {
    /**
    * Liste tous les utilisateurs. Permission: user.view_all
    *
   * @param page 
   * @param page_size 
   * @param search 
   * @returns Liste paginée des utilisateurs
    */
    getUsersList(page?: number, page_size?: number, search?: string): Promise<PaginatedUsers | null>;

    /**
      * Crée un utilisateur via le Saga Pattern Auth+User. Permission: user.create
      *
     * @param payload 
     * @returns Utilisateur créé avec son identifiant
      */
    createUser(payload: CreateUserPayload): Promise<UserBasic | null>;

    /**
      * Récupère les détails complets d'un utilisateur. Permission: user.view_all
      *
     * @param user_id 
     * @returns Détails complets de l'utilisateur
      */
    getUserDetail(user_id: string): Promise<UserDetail | null>;

    /**
      * Modifie les informations d'un utilisateur. Permission: user.update
      *
     * @param user_id 
     * @param payload 
     * @returns Confirmation de la modification
      */
    updateUser(user_id: string, payload: UpdateUserPayload): Promise<string | null>;

    /**
      * Modifie l'email d'un utilisateur (synchronise avec Auth Service). Permission: user.update
      *
     * @param user_id 
     * @param new_email 
     * @returns Confirmation de la modification de l'email
      */
    updateUserEmail(user_id: string, new_email: string): Promise<string | null>;

    /**
      * Modifie le téléphone d'un utilisateur (synchronise avec Auth Service). Permission: user.update
      *
     * @param user_id 
     * @param new_phone 
     * @returns Confirmation de la modification du téléphone
      */
    updateUserPhone(user_id: string, new_phone: string): Promise<string | null>;

    /**
      * Suspend un utilisateur. Permission: user.deactivate
      *
     * @param user_id 
     * @returns Confirmation de la suspension
      */
    suspendUser(user_id: string): Promise<string | null>;

    /**
      * Active un utilisateur suspendu. Permission: user.activate
      *
     * @param user_id 
     * @returns Confirmation de l'activation
      */
    activateUser(user_id: string): Promise<string | null>;

    /**
      * Soft delete d'un utilisateur (restaurable). Permission: user.delete
      *
     * @param user_id 
     * @returns Confirmation du soft delete
      */
    softDeleteUser(user_id: string): Promise<string | null>;

    /**
      * Restaure un utilisateur soft-deleted. Permission: user.restore
      *
     * @param user_id 
     * @returns Confirmation de la restauration
      */
    restoreUser(user_id: string): Promise<string | null>;

    /**
      * Modifie le profil cuisinier d'un utilisateur. Permission: user.update
      *
     * @param user_id 
     * @param payload 
     * @returns Confirmation de la mise à jour du profil cuisinier
      */
    updateUserCuisinierProfile(user_id: string, payload: UpdateUserCuisinierProfilePayload): Promise<string | null>;

    /**
      * Modifie le profil serveur d'un utilisateur. Permission: user.update
      *
     * @param user_id 
     * @param payload 
     * @returns Confirmation de la mise à jour du profil serveur
      */
    updateUserServeurProfile(user_id: string, payload: UpdateUserServeurProfilePayload): Promise<string | null>;

    /**
      * Modifie le profil caissier d'un utilisateur. Permission: user.update
      *
     * @param user_id 
     * @param payload 
     * @returns Confirmation de la mise à jour du profil caissier
      */
    updateUserCaissierProfile(user_id: string, payload: UpdateUserCaissierProfilePayload): Promise<string | null>;

    /**
      * Modifie le profil livreur d'un utilisateur. Permission: user.update
      *
     * @param user_id 
     * @returns Confirmation de la mise à jour du profil livreur
      */
    updateUserLivreurProfile(user_id: string): Promise<string | null>;

    /**
      * Active le profil livreur d'un utilisateur. Permission: user.update
      *
     * @param user_id 
     * @returns Confirmation de l'activation du profil livreur
      */
    activateUserLivreurProfile(user_id: string): Promise<string | null>;

    /**
      * Modifie le profil manager d'un utilisateur (ADMIN uniquement). Permission: user.update
      *
     * @param user_id 
     * @param payload 
     * @returns Confirmation de la mise à jour du profil manager
      */
    updateUserManagerProfile(user_id: string, payload: UpdateUserManagerProfilePayload): Promise<string | null>;

    /**
      * Assigne des rôles à un utilisateur. Permission: role.assign
      *
     * @param user_id 
     * @param roles 
     * @returns Confirmation de l'assignation des rôles
      */
    assignUserRoles(user_id: string, roles: UserRoleCodeEnum[]): Promise<string | null>;

    /**
      * Révoque des rôles d'un utilisateur. Permission: role.revoke
      *
     * @param user_id
     * @param roles
     * @returns Confirmation de la révocation des rôles
      */
    revokeUserRoles(user_id: string, roles: UserRoleCodeEnum[]): Promise<string | null>;

    /**
      * Accorde des permissions individuelles à un utilisateur. Permission: permission.grant
      *
     * @param user_id
     * @param permissions
     * @returns Confirmation de l'accord des permissions
      */
    grantUserPermissions(user_id: string, permissions: string[]): Promise<string | null>;

    /**
      * Révoque des permissions individuelles d'un utilisateur. Permission: permission.revoke
      *
     * @param user_id
     * @param permissions
     * @returns Confirmation de la révocation des permissions
      */
    revokeUserPermissions(user_id: string, permissions: string[]): Promise<string | null>;
}
