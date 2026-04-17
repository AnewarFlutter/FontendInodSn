// Controller pour la feature user_management

import { GetUsersListUseCase } from "@/modules/user/user_management/domain/usecases/get_users_list_use_case";
import { CreateUserUseCase } from "@/modules/user/user_management/domain/usecases/create_user_use_case";
import { GetUserDetailUseCase } from "@/modules/user/user_management/domain/usecases/get_user_detail_use_case";
import { UpdateUserUseCase } from "@/modules/user/user_management/domain/usecases/update_user_use_case";
import { UpdateUserEmailUseCase } from "@/modules/user/user_management/domain/usecases/update_user_email_use_case";
import { UpdateUserPhoneUseCase } from "@/modules/user/user_management/domain/usecases/update_user_phone_use_case";
import { SuspendUserUseCase } from "@/modules/user/user_management/domain/usecases/suspend_user_use_case";
import { ActivateUserUseCase } from "@/modules/user/user_management/domain/usecases/activate_user_use_case";
import { SoftDeleteUserUseCase } from "@/modules/user/user_management/domain/usecases/soft_delete_user_use_case";
import { RestoreUserUseCase } from "@/modules/user/user_management/domain/usecases/restore_user_use_case";
import { UpdateUserCuisinierProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_cuisinier_profile_use_case";
import { UpdateUserServeurProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_serveur_profile_use_case";
import { UpdateUserCaissierProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_caissier_profile_use_case";
import { UpdateUserLivreurProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_livreur_profile_use_case";
import { ActivateUserLivreurProfileUseCase } from "@/modules/user/user_management/domain/usecases/activate_user_livreur_profile_use_case";
import { UpdateUserManagerProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_manager_profile_use_case";
import { AssignUserRolesUseCase } from "@/modules/user/user_management/domain/usecases/assign_user_roles_use_case";
import { RevokeUserRolesUseCase } from "@/modules/user/user_management/domain/usecases/revoke_user_roles_use_case";
import { GrantUserPermissionsUseCase } from "@/modules/user/user_management/domain/usecases/grant_user_permissions_use_case";
import { RevokeUserPermissionsUseCase } from "@/modules/user/user_management/domain/usecases/revoke_user_permissions_use_case";
import { PaginatedUsers } from "@/modules/user/types/paginated_users_types";
import { CreateUserPayload } from "@/modules/user/user_management/domain/types/create_user_payload";
import { UserBasic } from "@/modules/user/types/user_basic_types";
import { UserDetail } from "@/modules/user/types/user_detail_types";
import { UpdateUserPayload } from "@/modules/user/user_management/domain/types/update_user_payload";
import { UpdateUserCuisinierProfilePayload } from "@/modules/user/user_management/domain/types/update_user_cuisinier_profile_payload";
import { UpdateUserServeurProfilePayload } from "@/modules/user/user_management/domain/types/update_user_serveur_profile_payload";
import { UpdateUserCaissierProfilePayload } from "@/modules/user/user_management/domain/types/update_user_caissier_profile_payload";
import { UpdateUserManagerProfilePayload } from "@/modules/user/user_management/domain/types/update_user_manager_profile_payload";
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum";

/**
 * This class is an adapter for the user_management feature.
 * It acts as an interface between the application and the user_management feature.
 */
export class UserManagementController {
    constructor(
            private readonly getUsersListUseCase: GetUsersListUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserDetailUseCase: GetUserDetailUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserEmailUseCase: UpdateUserEmailUseCase,
    private readonly updateUserPhoneUseCase: UpdateUserPhoneUseCase,
    private readonly suspendUserUseCase: SuspendUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly softDeleteUserUseCase: SoftDeleteUserUseCase,
    private readonly restoreUserUseCase: RestoreUserUseCase,
    private readonly updateUserCuisinierProfileUseCase: UpdateUserCuisinierProfileUseCase,
    private readonly updateUserServeurProfileUseCase: UpdateUserServeurProfileUseCase,
    private readonly updateUserCaissierProfileUseCase: UpdateUserCaissierProfileUseCase,
    private readonly updateUserLivreurProfileUseCase: UpdateUserLivreurProfileUseCase,
    private readonly activateUserLivreurProfileUseCase: ActivateUserLivreurProfileUseCase,
    private readonly updateUserManagerProfileUseCase: UpdateUserManagerProfileUseCase,
    private readonly assignUserRolesUseCase: AssignUserRolesUseCase,
    private readonly revokeUserRolesUseCase: RevokeUserRolesUseCase,
    private readonly grantUserPermissionsUseCase: GrantUserPermissionsUseCase,
    private readonly revokeUserPermissionsUseCase: RevokeUserPermissionsUseCase
    ) { }


    /**
     * Liste tous les utilisateurs. Permission: user.view_all.
     */
    getUsersList = async (page?: number, page_size?: number, search?: string): Promise<PaginatedUsers | null> => {
        try {
            const res = await this.getUsersListUseCase.execute(page, page_size, search);
            return res;
        } catch (e) {
            console.log(`Error while executing getUsersList: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Crée un utilisateur via le Saga Pattern Auth+User. Permission: user.create.
     */
    createUser = async (payload: CreateUserPayload): Promise<UserBasic | null> => {
        try {
            const res = await this.createUserUseCase.execute(payload);
            return res;
        } catch (e) {
            console.log(`Error while executing createUser: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Récupère les détails complets d'un utilisateur. Permission: user.view_all.
     */
    getUserDetail = async (user_id: string): Promise<UserDetail | null> => {
        try {
            const res = await this.getUserDetailUseCase.execute(user_id);
            return res;
        } catch (e) {
            console.log(`Error while executing getUserDetail: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Modifie les informations d'un utilisateur. Permission: user.update.
     */
    updateUser = async (user_id: string, payload: UpdateUserPayload): Promise<string | null> => {
        try {
            const res = await this.updateUserUseCase.execute(user_id, payload);
            return res;
        } catch (e) {
            console.log(`Error while executing updateUser: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Modifie l'email d'un utilisateur (synchronise avec Auth Service). Permission: user.update.
     */
    updateUserEmail = async (user_id: string, new_email: string): Promise<string | null> => {
        try {
            const res = await this.updateUserEmailUseCase.execute(user_id, new_email);
            return res;
        } catch (e) {
            console.log(`Error while executing updateUserEmail: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Modifie le téléphone d'un utilisateur (synchronise avec Auth Service). Permission: user.update.
     */
    updateUserPhone = async (user_id: string, new_phone: string): Promise<string | null> => {
        try {
            const res = await this.updateUserPhoneUseCase.execute(user_id, new_phone);
            return res;
        } catch (e) {
            console.log(`Error while executing updateUserPhone: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Suspend un utilisateur. Permission: user.deactivate.
     */
    suspendUser = async (user_id: string): Promise<string | null> => {
        try {
            const res = await this.suspendUserUseCase.execute(user_id);
            return res;
        } catch (e) {
            console.log(`Error while executing suspendUser: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Active un utilisateur suspendu. Permission: user.activate.
     */
    activateUser = async (user_id: string): Promise<string | null> => {
        try {
            const res = await this.activateUserUseCase.execute(user_id);
            return res;
        } catch (e) {
            console.log(`Error while executing activateUser: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Soft delete d'un utilisateur (restaurable). Permission: user.delete.
     */
    softDeleteUser = async (user_id: string): Promise<string | null> => {
        try {
            const res = await this.softDeleteUserUseCase.execute(user_id);
            return res;
        } catch (e) {
            console.log(`Error while executing softDeleteUser: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Restaure un utilisateur soft-deleted. Permission: user.restore.
     */
    restoreUser = async (user_id: string): Promise<string | null> => {
        try {
            const res = await this.restoreUserUseCase.execute(user_id);
            return res;
        } catch (e) {
            console.log(`Error while executing restoreUser: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Modifie le profil cuisinier d'un utilisateur. Permission: user.update.
     */
    updateUserCuisinierProfile = async (user_id: string, payload: UpdateUserCuisinierProfilePayload): Promise<string | null> => {
        try {
            const res = await this.updateUserCuisinierProfileUseCase.execute(user_id, payload);
            return res;
        } catch (e) {
            console.log(`Error while executing updateUserCuisinierProfile: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Modifie le profil serveur d'un utilisateur. Permission: user.update.
     */
    updateUserServeurProfile = async (user_id: string, payload: UpdateUserServeurProfilePayload): Promise<string | null> => {
        try {
            const res = await this.updateUserServeurProfileUseCase.execute(user_id, payload);
            return res;
        } catch (e) {
            console.log(`Error while executing updateUserServeurProfile: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Modifie le profil caissier d'un utilisateur. Permission: user.update.
     */
    updateUserCaissierProfile = async (user_id: string, payload: UpdateUserCaissierProfilePayload): Promise<string | null> => {
        try {
            const res = await this.updateUserCaissierProfileUseCase.execute(user_id, payload);
            return res;
        } catch (e) {
            console.log(`Error while executing updateUserCaissierProfile: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Modifie le profil livreur d'un utilisateur. Permission: user.update.
     */
    updateUserLivreurProfile = async (user_id: string): Promise<string | null> => {
        try {
            const res = await this.updateUserLivreurProfileUseCase.execute(user_id);
            return res;
        } catch (e) {
            console.log(`Error while executing updateUserLivreurProfile: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Active le profil livreur d'un utilisateur. Permission: user.update.
     */
    activateUserLivreurProfile = async (user_id: string): Promise<string | null> => {
        try {
            const res = await this.activateUserLivreurProfileUseCase.execute(user_id);
            return res;
        } catch (e) {
            console.log(`Error while executing activateUserLivreurProfile: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Modifie le profil manager d'un utilisateur (ADMIN uniquement). Permission: user.update.
     */
    updateUserManagerProfile = async (user_id: string, payload: UpdateUserManagerProfilePayload): Promise<string | null> => {
        try {
            const res = await this.updateUserManagerProfileUseCase.execute(user_id, payload);
            return res;
        } catch (e) {
            console.log(`Error while executing updateUserManagerProfile: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Assigne des rôles à un utilisateur. Permission: role.assign.
     * Wraps the single role value in an array before passing to the use case.
     */
    assignUserRoles = async (user_id: string, roles: UserRoleCodeEnum): Promise<string | null> => {
        try {
            const res = await this.assignUserRolesUseCase.execute(user_id, [roles]);
            return res;
        } catch (e) {
            console.log(`Error while executing assignUserRoles: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Révoque des rôles d'un utilisateur. Permission: role.revoke.
     * Wraps the single role value in an array before passing to the use case.
     */
    revokeUserRoles = async (user_id: string, roles: UserRoleCodeEnum): Promise<string | null> => {
        try {
            const res = await this.revokeUserRolesUseCase.execute(user_id, [roles]);
            return res;
        } catch (e) {
            console.log(`Error while executing revokeUserRoles: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Accorde des permissions individuelles à un utilisateur. Permission: permission.grant.
     * Wraps the single permission value in an array before passing to the use case.
     */
    grantUserPermissions = async (user_id: string, permissions: string): Promise<string | null> => {
        try {
            const res = await this.grantUserPermissionsUseCase.execute(user_id, [permissions]);
            return res;
        } catch (e) {
            console.log(`Error while executing grantUserPermissions: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Révoque des permissions individuelles d'un utilisateur. Permission: permission.revoke.
     * Wraps the single permission value in an array before passing to the use case.
     */
    revokeUserPermissions = async (user_id: string, permissions: string): Promise<string | null> => {
        try {
            const res = await this.revokeUserPermissionsUseCase.execute(user_id, [permissions]);
            return res;
        } catch (e) {
            console.log(`Error while executing revokeUserPermissions: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }
}
