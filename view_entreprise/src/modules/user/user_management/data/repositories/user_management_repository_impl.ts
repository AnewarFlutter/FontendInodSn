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
import { UserManagementRepository } from "../../domain/repositories/user_management_repository";
import { UserManagementDataSource } from "../datasources/user_management_data_source";

/**
 * Implémentation concrète du repository pour user_management.
 * Délègue l'accès aux données à un datasource et mappe entre Model et Entity.
 */
export class UserManagementRepositoryImpl implements UserManagementRepository {
    constructor(private ds: UserManagementDataSource) { }


    /**
     * Liste tous les utilisateurs. Permission: user.view_all
     */
    async getUsersList(page?: number, page_size?: number, search?: string): Promise<PaginatedUsers | null> {

        try {
            const data = await this.ds.getUsersList(page, page_size, search);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Crée un utilisateur via le Saga Pattern Auth+User. Permission: user.create
     */
    async createUser(payload: CreateUserPayload): Promise<UserBasic | null> {

        try {
            const data = await this.ds.createUser(payload);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Récupère les détails complets d'un utilisateur. Permission: user.view_all
     */
    async getUserDetail(user_id: string): Promise<UserDetail | null> {

        try {
            const data = await this.ds.getUserDetail(user_id);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Modifie les informations d'un utilisateur. Permission: user.update
     */
    async updateUser(user_id: string, payload: UpdateUserPayload): Promise<string | null> {

        try {
            const data = await this.ds.updateUser(user_id, payload);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Modifie l'email d'un utilisateur (synchronise avec Auth Service). Permission: user.update
     */
    async updateUserEmail(user_id: string, new_email: string): Promise<string | null> {

        try {
            const data = await this.ds.updateUserEmail(user_id, new_email);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Modifie le téléphone d'un utilisateur (synchronise avec Auth Service). Permission: user.update
     */
    async updateUserPhone(user_id: string, new_phone: string): Promise<string | null> {

        try {
            const data = await this.ds.updateUserPhone(user_id, new_phone);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Suspend un utilisateur. Permission: user.deactivate
     */
    async suspendUser(user_id: string): Promise<string | null> {

        try {
            const data = await this.ds.suspendUser(user_id);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Active un utilisateur suspendu. Permission: user.activate
     */
    async activateUser(user_id: string): Promise<string | null> {

        try {
            const data = await this.ds.activateUser(user_id);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Soft delete d'un utilisateur (restaurable). Permission: user.delete
     */
    async softDeleteUser(user_id: string): Promise<string | null> {

        try {
            const data = await this.ds.softDeleteUser(user_id);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Restaure un utilisateur soft-deleted. Permission: user.restore
     */
    async restoreUser(user_id: string): Promise<string | null> {

        try {
            const data = await this.ds.restoreUser(user_id);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Modifie le profil cuisinier d'un utilisateur. Permission: user.update
     */
    async updateUserCuisinierProfile(user_id: string, payload: UpdateUserCuisinierProfilePayload): Promise<string | null> {

        try {
            const data = await this.ds.updateUserCuisinierProfile(user_id, payload);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Modifie le profil serveur d'un utilisateur. Permission: user.update
     */
    async updateUserServeurProfile(user_id: string, payload: UpdateUserServeurProfilePayload): Promise<string | null> {

        try {
            const data = await this.ds.updateUserServeurProfile(user_id, payload);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Modifie le profil caissier d'un utilisateur. Permission: user.update
     */
    async updateUserCaissierProfile(user_id: string, payload: UpdateUserCaissierProfilePayload): Promise<string | null> {

        try {
            const data = await this.ds.updateUserCaissierProfile(user_id, payload);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Modifie le profil livreur d'un utilisateur. Permission: user.update
     */
    async updateUserLivreurProfile(user_id: string): Promise<string | null> {

        try {
            const data = await this.ds.updateUserLivreurProfile(user_id);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Active le profil livreur d'un utilisateur. Permission: user.update
     */
    async activateUserLivreurProfile(user_id: string): Promise<string | null> {

        try {
            const data = await this.ds.activateUserLivreurProfile(user_id);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Modifie le profil manager d'un utilisateur (ADMIN uniquement). Permission: user.update
     */
    async updateUserManagerProfile(user_id: string, payload: UpdateUserManagerProfilePayload): Promise<string | null> {

        try {
            const data = await this.ds.updateUserManagerProfile(user_id, payload);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Assigne des rôles à un utilisateur. Permission: role.assign
     */
    async assignUserRoles(user_id: string, roles: UserRoleCodeEnum[]): Promise<string | null> {

        try {
            const data = await this.ds.assignUserRoles(user_id, roles);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Révoque des rôles d'un utilisateur. Permission: role.revoke
     */
    async revokeUserRoles(user_id: string, roles: UserRoleCodeEnum[]): Promise<string | null> {

        try {
            const data = await this.ds.revokeUserRoles(user_id, roles);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Accorde des permissions individuelles à un utilisateur. Permission: permission.grant
     */
    async grantUserPermissions(user_id: string, permissions: string[]): Promise<string | null> {

        try {
            const data = await this.ds.grantUserPermissions(user_id, permissions);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Révoque des permissions individuelles d'un utilisateur. Permission: permission.revoke
     */
    async revokeUserPermissions(user_id: string, permissions: string[]): Promise<string | null> {

        try {
            const data = await this.ds.revokeUserPermissions(user_id, permissions);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }
}
