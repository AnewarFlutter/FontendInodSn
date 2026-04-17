import { apiClient } from "@/lib/api/api_client";
import { ApiError, ForbiddenError } from "@/lib/api/api_errors";
import { formatApiRoute } from "@/lib/api/format_api_route";
import { API_ROUTES } from "@/shared/constants/api_routes";
import { USER_GET_PERMISSIONS_CATEGORIES_RESPONSE_200, USER_GET_PERMISSIONS_CATEGORIES_RESPONSE_403, USER_GET_PERMISSIONS_LIST_RESPONSE_200, USER_GET_PERMISSIONS_LIST_RESPONSE_403, USER_GET_ROLES_LIST_RESPONSE_200, USER_GET_ROLES_LIST_RESPONSE_403 } from "@/shared/constants/api_types";
import { RbacDataSource } from "./rbac_data_source";

/**
 * Implémentation REST du datasource pour rbac.
 * Toutes les méthodes sont à implémenter.
 */
export class RestApiRbacDataSourceImpl implements RbacDataSource {

    /**
     * Liste toutes les permissions disponibles dans le système. Permission: permission.list
     */
    async getPermissionsList(): Promise<object[] | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GET_PERMISSIONS_LIST.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GET_PERMISSIONS_LIST_RESPONSE_200>(route, {
                method: "GET",


            });

            if (error) {
                switch (status) {
                    case 403: throw new ForbiddenError(error as USER_GET_PERMISSIONS_LIST_RESPONSE_403);
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GET_PERMISSIONS_LIST_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as object[] | null;
        } catch (err) {
            console.error("Unexpected error in getPermissionsList:", err);
            throw err;
        }
    }

    /**
     * Liste les rôles assignables dans le système. Permission: role.list
     */
    async getRolesList(): Promise<object[] | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GET_ROLES_LIST.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GET_ROLES_LIST_RESPONSE_200>(route, {
                method: "GET",


            });

            if (error) {
                switch (status) {
                    case 403: throw new ForbiddenError(error as USER_GET_ROLES_LIST_RESPONSE_403);
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GET_ROLES_LIST_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as object[] | null;
        } catch (err) {
            console.error("Unexpected error in getRolesList:", err);
            throw err;
        }
    }

    /**
     * Liste les catégories de permissions pour affichage groupé dans le frontend. Permission: permission.list
     */
    async getPermissionsCategories(): Promise<object[] | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GET_PERMISSIONS_CATEGORIES.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GET_PERMISSIONS_CATEGORIES_RESPONSE_200>(route, {
                method: "GET",


            });

            if (error) {
                switch (status) {
                    case 403: throw new ForbiddenError(error as USER_GET_PERMISSIONS_CATEGORIES_RESPONSE_403);
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GET_PERMISSIONS_CATEGORIES_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as object[] | null;
        } catch (err) {
            console.error("Unexpected error in getPermissionsCategories:", err);
            throw err;
        }
    }
}
