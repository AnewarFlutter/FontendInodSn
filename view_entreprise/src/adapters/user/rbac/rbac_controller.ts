// Controller pour la feature rbac

import { GetPermissionsListUseCase } from "@/modules/user/rbac/domain/usecases/get_permissions_list_use_case";
import { GetRolesListUseCase } from "@/modules/user/rbac/domain/usecases/get_roles_list_use_case";
import { GetPermissionsCategoriesUseCase } from "@/modules/user/rbac/domain/usecases/get_permissions_categories_use_case";


/**
 * This class is an adapter for the rbac feature.
 * It acts as an interface between the application and the rbac feature.
 */
export class RbacController {
    constructor(
            private readonly getPermissionsListUseCase: GetPermissionsListUseCase,
    private readonly getRolesListUseCase: GetRolesListUseCase,
    private readonly getPermissionsCategoriesUseCase: GetPermissionsCategoriesUseCase
    ) { }


    /**
     * Liste toutes les permissions disponibles dans le système. Permission: permission.list.
     */
    getPermissionsList = async (): Promise<object[] | null> => {
        try {
            const res = await this.getPermissionsListUseCase.execute();
            return res;
        } catch (e) {
            console.log(`Error while executing getPermissionsList: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Liste les rôles assignables dans le système. Permission: role.list.
     */
    getRolesList = async (): Promise<object[] | null> => {
        try {
            const res = await this.getRolesListUseCase.execute();
            return res;
        } catch (e) {
            console.log(`Error while executing getRolesList: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Liste les catégories de permissions pour affichage groupé dans le frontend. Permission: permission.list.
     */
    getPermissionsCategories = async (): Promise<object[] | null> => {
        try {
            const res = await this.getPermissionsCategoriesUseCase.execute();
            return res;
        } catch (e) {
            console.log(`Error while executing getPermissionsCategories: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }
}
