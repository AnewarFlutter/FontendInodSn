import { UserStatsResponse } from "@/modules/user/stats/domain/types/user_stats_response";

/**
 * StatsRepository – Contrat de persistance pour l'entité Stats
 * 
 * **Rôle** : Interface abstraite utilisée par les UseCases.
 * 
 * **Implémentations** :
 * - `StatsRepositoryImpl` (couche data)
 * - Mock pour tests
 * 
 * **Généré automatiquement** à partir des UseCases du module **user**.
 * 
 * @example
 * const repo: StatsRepository = container.get(StatsRepository);
 * const user = await repo.getUserById("123");
 */
export interface StatsRepository {
    /**
    * Récupère les statistiques globales des utilisateurs (totaux, actifs/inactifs, répartition par rôle). Permission: user.view_stats
    *
   * @returns Statistiques globales des utilisateurs
    */
    getUserStats(): Promise<UserStatsResponse | null>;
}
