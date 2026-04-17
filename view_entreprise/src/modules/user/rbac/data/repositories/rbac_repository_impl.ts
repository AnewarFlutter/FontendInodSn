import { RbacRepository } from "../../domain/repositories/rbac_repository";
import { RbacDataSource } from "../datasources/rbac_data_source";

/**
 * Implémentation concrète du repository pour rbac.
 * Délègue l'accès aux données à un datasource et mappe entre Model et Entity.
 */
export class RbacRepositoryImpl implements RbacRepository {
    constructor(private ds: RbacDataSource) { }


    /**
     * Liste toutes les permissions disponibles dans le système. Permission: permission.list
     */
    async getPermissionsList(): Promise<object[] | null> {

        try {
            const data = await this.ds.getPermissionsList();
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Liste les rôles assignables dans le système. Permission: role.list
     */
    async getRolesList(): Promise<object[] | null> {

        try {
            const data = await this.ds.getRolesList();
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Liste les catégories de permissions pour affichage groupé dans le frontend. Permission: permission.list
     */
    async getPermissionsCategories(): Promise<object[] | null> {

        try {
            const data = await this.ds.getPermissionsCategories();
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }
}
