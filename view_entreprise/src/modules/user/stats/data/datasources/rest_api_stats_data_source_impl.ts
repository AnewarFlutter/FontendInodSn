import { apiClient } from "@/lib/api/api_client";
import { ApiError, ForbiddenError } from "@/lib/api/api_errors";
import { formatApiRoute } from "@/lib/api/format_api_route";
import { UserStatsResponse } from "@/modules/user/stats/domain/types/user_stats_response";
import { API_ROUTES } from "@/shared/constants/api_routes";
import { USER_GET_USER_STATS_RESPONSE_200, USER_GET_USER_STATS_RESPONSE_403 } from "@/shared/constants/api_types";
import { StatsDataSource } from "./stats_data_source";

/**
 * Implémentation REST du datasource pour stats.
 * Toutes les méthodes sont à implémenter.
 */
export class RestApiStatsDataSourceImpl implements StatsDataSource {

    /**
     * Récupère les statistiques globales des utilisateurs (totaux, actifs/inactifs, répartition par rôle). Permission: user.view_stats
     */
    async getUserStats(): Promise<UserStatsResponse | null> {
        try {
            const route = formatApiRoute(API_ROUTES.USER.GET_USER_STATS.path, undefined, undefined);
            console.log("Calling API route:", route);
            const { data, error, status } = await apiClient<USER_GET_USER_STATS_RESPONSE_200>(route, {
                method: "GET",


            });

            if (error) {
                switch (status) {
                    case 403: throw new ForbiddenError(error as USER_GET_USER_STATS_RESPONSE_403);
                    default: throw new ApiError(status, error);
                }
            }

            console.log("Response before cast:", data);

            // === CAST LOCAL ===
            const typedData = data as USER_GET_USER_STATS_RESPONSE_200;

            console.log("Response after cast:", typedData);

            return typedData as unknown as UserStatsResponse | null;
        } catch (err) {
            console.error("Unexpected error in getUserStats:", err);
            throw err;
        }
    }
}
