import { UserStatsResponse } from "@/modules/user/stats/domain/types/user_stats_response";
import { StatsRepository } from "../../domain/repositories/stats_repository";
import { StatsDataSource } from "../datasources/stats_data_source";

/**
 * Implémentation concrète du repository pour stats.
 * Délègue l'accès aux données à un datasource et mappe entre Model et Entity.
 */
export class StatsRepositoryImpl implements StatsRepository {
    constructor(private ds: StatsDataSource) { }


    /**
     * Récupère les statistiques globales des utilisateurs (totaux, actifs/inactifs, répartition par rôle). Permission: user.view_stats
     */
    async getUserStats(): Promise<UserStatsResponse | null> {

        try {
            const data = await this.ds.getUserStats();
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }
}
