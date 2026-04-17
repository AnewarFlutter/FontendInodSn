import { StatsRepository } from "../repositories/stats_repository";
import { UserStatsResponse } from "@/modules/user/stats/domain/types/user_stats_response";

/**
 * Récupère les statistiques globales des utilisateurs (totaux, actifs/inactifs, répartition par rôle). Permission: user.view_stats
 */
export class GetUserStatsUseCase {
    constructor(private readonly repository: StatsRepository) {}

    /**
     * Executes the use case.
     */
    async execute(): Promise<UserStatsResponse | null> {
        return this.repository.getUserStats();
    }
}
