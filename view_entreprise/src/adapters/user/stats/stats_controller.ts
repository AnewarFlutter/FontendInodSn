// Controller pour la feature stats

import { GetUserStatsUseCase } from "@/modules/user/stats/domain/usecases/get_user_stats_use_case";
import { UserStatsResponse } from "@/modules/user/stats/domain/types/user_stats_response";

/**
 * This class is an adapter for the stats feature.
 * It acts as an interface between the application and the stats feature.
 */
export class StatsController {
    constructor(
            private readonly getUserStatsUseCase: GetUserStatsUseCase
    ) { }


    /**
     * Récupère les statistiques globales des utilisateurs (totaux, actifs/inactifs, répartition par rôle). Permission: user.view_stats.
     */
    getUserStats = async (): Promise<UserStatsResponse | null> => {
        try {
            const res = await this.getUserStatsUseCase.execute();
            return res;
        } catch (e) {
            console.log(`Error while executing getUserStats: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }
}
